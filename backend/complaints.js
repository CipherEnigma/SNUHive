import express from 'express';
import db from './db.js'; 
import verifyToken from './middleware/verifyToken.js'; 
import verifyAdminToken from './middleware/verifyAdminToken.js';
const router = express.Router();

router.post('/complaint', verifyToken, async (req, res) => {
  const { description, hostel_id, d_name } = req.body;
  const roll_no = req.roll_no; 

  if (!roll_no || !description || !d_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const complaint_id = `C${Date.now()}`; 
  const complaint_date = new Date().toISOString().split('T')[0];

  try {
    await db.execute(`
      INSERT INTO Complaint 
      (complaint_id, roll_no, hostel_id, d_name, status, complaint_date, description)
      VALUES (?, ?, ?, ?, 'Pending', ?, ?)
    `, [
      complaint_id,
      roll_no,
      hostel_id ?? null, 
      d_name,
      complaint_date,
      description
    ]);

    res.status(201).json({ message: "Complaint posted successfully", complaint_id });
  } catch (err) {
    console.error("Error inserting complaint:", err);
    res.status(500).json({ message: "Failed to post complaint", error: err.message });
  }
});

router.get('/complaint/:roll_no', verifyToken, async (req, res) => {
  const roll_no = req.roll_no;

  try {
    const [rows] = await db.execute(`
      SELECT complaint_id, roll_no, hostel_id, d_name, status, complaint_date, description 
      FROM Complaint 
      WHERE roll_no = ?
    `, [roll_no]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No complaints found for this roll number" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints", error: err.message });
  }
}); 

router.get('/department-complaints', verifyAdminToken, async (req, res) => {
    const { d_name } = req.admin;
  
    try {
      const [rows] = await db.execute(`
        SELECT 
          c.*,
          s.s_name,
          s.contact_no,
          s.room_no
        FROM Complaint c
        JOIN STUDENT s ON c.roll_no = s.roll_no
        WHERE c.d_name = ?
        ORDER BY c.complaint_date DESC
      `, [d_name]);
  
      res.status(200).json(rows);
    } catch (err) {
      console.error("Error fetching department complaints:", err);
      res.status(500).json({ message: "Failed to fetch complaints", error: err.message });
    }
  });
  
router.patch('/complaint/:complaint_id/status', verifyAdminToken, async (req, res) => {
    const { complaint_id } = req.params;
    const { status } = req.body;
    const { d_name } = req.admin;
  
    const allowedStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    try {
      console.log('Checking complaint_id:', complaint_id);
  
      const [complaints] = await db.execute(
        `SELECT d_name FROM Complaint WHERE complaint_id = ?`,
        [complaint_id]
      );
  
      console.log('Complaint found in the database:', complaints);
  
      if (complaints.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }
  
      const complaint = complaints[0];
  
      if (complaint.d_name !== d_name) {
        return res.status(403).json({ message: "Not authorized to update this complaint" });
      }
  
      await db.execute(
        `UPDATE Complaint SET status = ? WHERE complaint_id = ?`,
        [status, complaint_id]
      );
  
      res.status(200).json({
        message: "Complaint status updated successfully",
        complaint_id,
        new_status: status
      });
  
    } catch (err) {
      console.error("Error updating complaint status:", err);
      res.status(500).json({ message: "Failed to update complaint status", error: err.message });
    }
  });


export default router;
