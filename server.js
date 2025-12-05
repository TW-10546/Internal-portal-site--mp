const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // Make sure this is your actual database name
  password: "root1234",
  port: 5432,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

// TEST API (for checking backend is running)
app.get("/test", (req, res) => {
  res.send("Backend Connected Successfully!");
});

// Health check API with DB connection test
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({ 
      status: "OK", 
      database: "Connected", 
      time: result.rows[0].current_time 
    });
  } catch (err) {
    res.status(500).json({ status: "ERROR", database: "Disconnected", error: err.message });
  }
});

// Login API - Updated with correct column names
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for email:", email);

  try {
    // Using the correct column name 'email_id' from our schema
    const result = await pool.query(
      `SELECT u.user_id, u.email_id, u.password, u.role,
              string_agg(d.department_name, ', ' ORDER BY 
                CASE WHEN ud.is_primary THEN 1 ELSE 2 END
              ) as departments
       FROM users u
       LEFT JOIN user_department ud ON u.user_id = ud.user_id
       LEFT JOIN department d ON ud.department_id = d.department_id
       WHERE u.email_id = $1
       GROUP BY u.user_id, u.email_id, u.password, u.role`,
      [email]
    );

    if (result.rows.length === 0) {
      console.log("User not found for email:", email);
      return res.status(400).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const user = result.rows[0];
    console.log("User found:", { 
      email: user.email_id, 
      role: user.role, 
      hashedPassword: user.password.substring(0, 10) + "...",
      departments: user.departments 
    });

    // In production, use bcrypt for password comparison
    // For now, direct comparison (update to bcrypt in production)
    if (user.password !== password) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ 
        success: false, 
        message: "Incorrect password" 
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log("Login successful for user:", email, "Role:", user.role);
    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword
    });

  } catch (err) {
    console.error("Server error during login:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
});

// Get all users with departments (Admin only)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.user_id,
        u.email_id,
        u.role,
        u.created_at,
        string_agg(
          CASE 
            WHEN ud.is_primary THEN d.department_name || ' (Primary)'
            ELSE d.department_name
          END, ', ' ORDER BY ud.is_primary DESC
        ) as departments,
        COUNT(d.department_id) as department_count
      FROM users u
      LEFT JOIN user_department ud ON u.user_id = ud.user_id
      LEFT JOIN department d ON ud.department_id = d.department_id
      GROUP BY u.user_id, u.email_id, u.role, u.created_at
      ORDER BY u.created_at DESC
    `);
    
    res.json({
      success: true,
      users: result.rows
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching users",
      error: err.message 
    });
  }
});

// Create new user (with General department automatically)
app.post("/users", async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'user'"
      });
    }

    // Start transaction
    await pool.query('BEGIN');

    // Insert new user
    const userResult = await pool.query(
      `INSERT INTO users (email_id, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING user_id, email_id, role, created_at`,
      [email, password, role]
    );

    const newUser = userResult.rows[0];

    // Get General department ID
    const deptResult = await pool.query(
      `SELECT department_id FROM department WHERE department_name = 'General'`
    );

    if (deptResult.rows.length === 0) {
      throw new Error("General department not found");
    }

    const generalDeptId = deptResult.rows[0].department_id;

    // Assign General department to user
    await pool.query(
      `INSERT INTO user_department (user_id, department_id, is_primary)
       VALUES ($1, $2, TRUE)`,
      [newUser.user_id, generalDeptId]
    );

    await pool.query('COMMIT');

    res.json({
      success: true,
      message: "User created successfully",
      user: newUser
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    console.error("Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message
    });
  }
});

// Add department to admin (Admin only)
app.post("/users/:userId/departments", async (req, res) => {
  const { userId } = req.params;
  const { departmentName } = req.body;

  try {
    // Check if user is admin
    const userCheck = await pool.query(
      `SELECT role FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (userCheck.rows[0].role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can have multiple departments"
      });
    }

    // Get or create department
    let deptResult = await pool.query(
      `SELECT department_id FROM department WHERE department_name = $1`,
      [departmentName]
    );

    let departmentId;
    if (deptResult.rows.length === 0) {
      const newDept = await pool.query(
        `INSERT INTO department (department_name) 
         VALUES ($1) 
         RETURNING department_id`,
        [departmentName]
      );
      departmentId = newDept.rows[0].department_id;
    } else {
      departmentId = deptResult.rows[0].department_id;
    }

    // Check if already assigned
    const existingAssignment = await pool.query(
      `SELECT * FROM user_department 
       WHERE user_id = $1 AND department_id = $2`,
      [userId, departmentId]
    );

    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already has this department"
      });
    }

    // Add department (non-primary)
    await pool.query(
      `INSERT INTO user_department (user_id, department_id, is_primary)
       VALUES ($1, $2, FALSE)`,
      [userId, departmentId]
    );

    res.json({
      success: true,
      message: "Department added successfully to admin"
    });

  } catch (err) {
    console.error("Error adding department:", err);
    res.status(500).json({
      success: false,
      message: "Error adding department",
      error: err.message
    });
  }
});

// Get departments for a specific user
app.get("/users/:userId/departments", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.department_id, d.department_name, ud.is_primary
       FROM user_department ud
       JOIN department d ON ud.department_id = d.department_id
       WHERE ud.user_id = $1
       ORDER BY ud.is_primary DESC, d.department_name`,
      [userId]
    );

    res.json({
      success: true,
      departments: result.rows
    });
  } catch (err) {
    console.error("Error fetching user departments:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
      error: err.message
    });
  }
});

// Get all departments
app.get("/departments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM department ORDER BY department_name`
    );
    
    res.json({
      success: true,
      departments: result.rows
    });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
      error: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});