import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import db from './db.js'; 
import complaintRoutes from './complaints.js'; 
const jwtSecret = "zxcvasdfgtrewqyhbvcxzfdsahfs";

const app = express();
app.use(cors());
app.use(express.json()); 

await db.execute(`CREATE TABLE IF NOT EXISTS WARDEN (
    Warden_id VARCHAR(10) PRIMARY KEY,
    w_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_no VARCHAR(15) UNIQUE NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS HOSTEL (
    hostel_id VARCHAR(10) PRIMARY KEY,
    h_name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    warden_id VARCHAR(10), 
    FOREIGN KEY (warden_id) REFERENCES WARDEN(Warden_id) ON DELETE SET NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS STUDENT (
    roll_no VARCHAR(10) PRIMARY KEY,
    s_name VARCHAR(255) NOT NULL,
    dept VARCHAR(255) NOT NULL,
    batch INT NOT NULL,
    contact_no VARCHAR(15) UNIQUE NOT NULL,
    snu_email_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    room_no VARCHAR(10) NOT NULL,
    hostel_id VARCHAR(10) DEFAULT NULL, 
    parent_contact VARCHAR(15) NOT NULL,
    FOREIGN KEY (hostel_id) REFERENCES HOSTEL(hostel_id) ON DELETE SET NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS SUPPORT_DEPT (
    D_Name ENUM('Maintenance', 'Pest-control', 'Housekeeping', 'IT') PRIMARY KEY,
    warden_id VARCHAR(10),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    staff_capacity int NOT NULL,
    foreign key (warden_id) references WARDEN(Warden_id) on delete set null
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS Complaint(
    complaint_id VARCHAR(36) PRIMARY KEY,
    roll_no VARCHAR(255) DEFAULT NULL,  
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no) ON DELETE SET NULL,
    hostel_id VARCHAR(10) DEFAULT NULL, 
    FOREIGN KEY (hostel_id) REFERENCES HOSTEL(hostel_id) ON DELETE SET NULL,
    d_name VARCHAR(20) NOT NULL,
    status VARCHAR(10) NOT NULL,
    complaint_date DATE NOT NULL,
    description VARCHAR(300) NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS LostAndFound(
    item_id VARCHAR(10) PRIMARY KEY,
    roll_no VARCHAR(255) DEFAULT NULL,  
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    found_location VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS food_request (
    food_id VARCHAR(10) PRIMARY KEY,
    roll_no VARCHAR(10) DEFAULT NULL,  
    hostel_id VARCHAR(10) DEFAULT NULL, 
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (roll_no) REFERENCES STUDENT(roll_no) ON DELETE SET NULL,
    FOREIGN KEY (hostel_id) REFERENCES HOSTEL(hostel_id) ON DELETE SET NULL
)`);

// API Route to Create Warden
app.post('/createWarden', [
    body('warden_id').notEmpty().withMessage('ID is required'),
    body('w_name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact_no').notEmpty().withMessage('Contact number is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  

    try {
        const { warden_id, w_name, email, password, contact_no } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute(`INSERT INTO WARDEN (Warden_id, w_name, email, password, contact_no) VALUES (?, ?, ?, ?, ?)`,
            [warden_id, w_name, email, hashedPassword, contact_no]);

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error inserting user:", error.message, error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// API Route to Create Student
app.post('/createStudent', [
    body('roll_no').notEmpty().withMessage('Roll number is required'),
    body('s_name').notEmpty().withMessage('Name is required'),
    body('dept').notEmpty().withMessage('Department is required'),
    body('batch').isInt().withMessage('Batch must be a valid number'),
    body('contact_no').notEmpty().withMessage('Contact number is required'),
    body('snu_email_id').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('room_no').notEmpty().withMessage('Room number is required'),
    body('hostel_id').notEmpty().withMessage('Hostel ID is required'),
    body('parent_contact').notEmpty().withMessage('Parent contact is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { roll_no, s_name, dept, batch, contact_no, snu_email_id, password, room_no, hostel_id, parent_contact } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute(`INSERT INTO STUDENT (roll_no, s_name, dept, batch, contact_no, snu_email_id, password, room_no, hostel_id, parent_contact) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [roll_no, s_name, dept, batch, contact_no, snu_email_id, hashedPassword, room_no, hostel_id, parent_contact]);

        res.status(200).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error("Error inserting student:", error.message, error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// API  to Create support Admin
app.post('/createSupportAdmin', [
    body('D_Name')
        .isIn(['Maintenance', 'Pest-control', 'Housekeeping', 'IT'])
        .withMessage('Department Name must be one of: Maintenance, Pest-control, Housekeeping, IT'),
    body('warden_id').optional(),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('staff_capacity').isInt({ min: 1 }).withMessage('Staff capacity must be a positive number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { D_Name, warden_id, email, password, staff_capacity } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute(`INSERT INTO SUPPORT_DEPT (D_Name, warden_id, email, password, staff_capacity) VALUES (?, ?, ?, ?, ?)`,
            [D_Name, warden_id || null, email, hashedPassword, staff_capacity]);

        res.status(201).json({ message: 'Support Admin created successfully' });
    } catch (error) {
        console.error("Error inserting Support Admin:", error.message, error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/loginWarden', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM WARDEN WHERE email = ?', [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Try logging in with correct credentials' });
        }

        const userData = rows[0]; 
        const pwdCompare = await bcrypt.compare(password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ message: 'Invalid credentials' });
        } 
        
    const authToken = jwt.sign({ roll_no: userData.roll_no }, jwtSecret, { expiresIn: '1h' });
        res.json({ success: true, authToken });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.post('/loginStudent', async (req, res) => {
    const { snu_email_id, password } = req.body;

    // Validate required fields
    if (!snu_email_id || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT * FROM STUDENT WHERE snu_email_id = ?', 
            [snu_email_id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userData = rows[0];
        const pwdCompare = await bcrypt.compare(password, userData.password);
        
        if (!pwdCompare) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { roll_no: userData.roll_no },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({ 
            success: true, 
            token,
            userData: {
                roll_no: userData.roll_no,
                name: userData.s_name
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/loginSupportAdmin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT D_Name, password FROM SUPPORT_DEPT WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const admin = rows[0];

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { d_name: admin.D_Name },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error("Support login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use(complaintRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
