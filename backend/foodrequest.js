import express from 'express';
import { body, validationResult } from 'express-validator';
import db from './db.js';
import verifyToken from './middleware/verifyToken.js';
import verifyWardenToken from './middleware/verifyWardenToken.js';


const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Food request routes working' });
});

// Create food request
router.post('/foodrequest', verifyToken, [
    body('food_id')
        .matches(/^\d{4}$/)
        .withMessage('Food ID must be exactly 4 digits'),
    body('type')
        .isIn(['Breakfast', 'Lunch', 'Dinner'])
        .withMessage('Type must be Breakfast, Lunch or Dinner'),
    body('date')
        .isDate()
        .withMessage('Invalid date format')
        .custom(value => {
            const requestDate = new Date(value);
            const today = new Date();
            return requestDate >= today;
        })
        .withMessage('Cannot request for past dates')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { food_id, type, date } = req.body;
        const roll_no = req.roll_no;

        // Get student's hostel_id
        const [student] = await db.execute(
            'SELECT hostel_id FROM student WHERE roll_no = ?',
            [roll_no]
        );

        if (!student[0]?.hostel_id) {
            return res.status(400).json({ message: 'Student not assigned to any hostel' });
        }

        // Create the food request
        await db.execute(
            `INSERT INTO food_request (food_id, roll_no, hostel_id, type, date, status)
             VALUES (?, ?, ?, ?, ?, 'Pending')`,
            [food_id, roll_no, student[0].hostel_id, type, date]
        );

        res.status(201).json({
            message: 'Food request created successfully',
            request: {
                food_id,
                type,
                date,
                status: 'Pending'
            }
        });
    } catch (error) {
        console.error('Error creating food request:', error);
        res.status(500).json({ message: 'Failed to create food request' });
    }
});

// Get pending food requests for warden
router.get('/pending-requests/:hostel_id',verifyWardenToken, async (req, res) => {
    try {
        const hostel_id = req.params.hostel_id;

        // Verify warden is assigned to this hostel
        const [hostel] = await db.execute(
            'SELECT warden_id FROM hostel WHERE hostel_id = ?',
            [hostel_id]
        );

        if (!hostel[0] || hostel[0].warden_id !== req.warden_id) {
            return res.status(403).json({ message: 'Not authorized for this hostel' });
        }

        // Get pending requests
        const [requests] = await db.execute(
            `SELECT fr.*, s.s_name, s.room_no 
             FROM food_request fr
             JOIN student s ON fr.roll_no = s.roll_no
             WHERE fr.hostel_id = ? AND fr.status = 'Pending'
             ORDER BY fr.date ASC`,
            [hostel_id]
        );

        res.json(requests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Failed to fetch pending requests' });
    }
});
// Update food request status (Approve/Reject)
router.patch('/update-status/:food_id', verifyWardenToken, [
    body('status')
        .isIn(['Approved', 'Rejected'])
        .withMessage('Status must be either Approved or Rejected'),
    body('remarks')
        .optional()
        .isString()
        .withMessage('Remarks must be text')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { food_id } = req.params;
        const { status, remarks } = req.body;

        // Verify request exists and warden has authority
        const [request] = await db.execute(
            `SELECT fr.*, h.warden_id 
             FROM food_request fr
             JOIN hostel h ON fr.hostel_id = h.hostel_id
             WHERE fr.food_id = ?`,
            [food_id]
        );

        if (request.length === 0) {
            return res.status(404).json({ message: 'Food request not found' });
        }

        if (request[0].warden_id !== req.warden_id) {
            return res.status(403).json({ message: 'Not authorized to update this request' });
        }

        // Update request status
        await db.execute(
            'UPDATE food_request SET status = ?, remarks = ? WHERE food_id = ?',
            [status, remarks || null, food_id]
        );

        res.json({ 
            message: `Food request ${status.toLowerCase()}`,
            request: {
                food_id,
                status,
                remarks
            }
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: 'Failed to update request status' });
    }
});

export default router;