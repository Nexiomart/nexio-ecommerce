const express = require('express');
const router = express.Router();

// Bring in Models
const SupportTicket = require('../../models/supportTicket');
const User = require('../../models/user');

// Bring in Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// @route   POST /api/support-ticket
// @desc    Create a new support ticket
// @access  Private (All authenticated users except Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { type, subject, message, priority, tags } = req.body;

    // Validate required fields
    if (!type || !subject || !message) {
      return res.status(400).json({
        error: 'Type, subject, and message are required.'
      });
    }

    // Prevent Admin from creating tickets (they should respond to them)
    if (req.user.role === ROLES.Admin) {
      return res.status(403).json({
        error: 'Admins cannot create support tickets.'
      });
    }

    const supportTicket = new SupportTicket({
      user: req.user._id,
      type,
      subject,
      message,
      priority: priority || 'medium',
      tags: tags || []
    });

    const savedTicket = await supportTicket.save();
    
    // Populate user information
    await savedTicket.populate('user', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully.',
      ticket: savedTicket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   GET /api/support-ticket
// @desc    Get support tickets (Admin sees all, users see their own)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, priority } = req.query;
    
    let query = {};
    
    // If not admin, only show user's own tickets
    if (req.user.role !== ROLES.Admin) {
      query.user = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'firstName lastName email role')
      .populate('adminUser', 'firstName lastName email')
      .sort({ created: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SupportTicket.countDocuments(query);

    res.status(200).json({
      success: true,
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   GET /api/support-ticket/:id
// @desc    Get a specific support ticket
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'firstName lastName email role')
      .populate('adminUser', 'firstName lastName email');

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found.'
      });
    }

    // Check if user can access this ticket
    if (req.user.role !== ROLES.Admin && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'You are not authorized to view this ticket.'
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   PUT /api/support-ticket/:id/respond
// @desc    Admin responds to a support ticket
// @access  Private (Admin only)
router.put('/:id/respond', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { adminResponse, status } = req.body;

    if (!adminResponse) {
      return res.status(400).json({
        error: 'Admin response is required.'
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found.'
      });
    }

    ticket.adminResponse = adminResponse;
    ticket.adminUser = req.user._id;
    ticket.status = status || 'in_progress';
    ticket.isRead = true;

    const updatedTicket = await ticket.save();
    await updatedTicket.populate('user', 'firstName lastName email role');
    await updatedTicket.populate('adminUser', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Response added successfully.',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Error responding to support ticket:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   PUT /api/support-ticket/:id/status
// @desc    Update support ticket status
// @access  Private (Admin only)
router.put('/:id/status', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Status is required.'
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found.'
      });
    }

    ticket.status = status;
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = Date.now();
    }

    const updatedTicket = await ticket.save();
    await updatedTicket.populate('user', 'firstName lastName email role');
    await updatedTicket.populate('adminUser', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully.',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   DELETE /api/support-ticket/:id
// @desc    Delete a support ticket
// @access  Private (Admin only)
router.delete('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found.'
      });
    }

    await SupportTicket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Support ticket deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @route   GET /api/support-ticket/stats/dashboard
// @desc    Get support ticket statistics for admin dashboard
// @access  Private (Admin only)
router.get('/stats/dashboard', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    const inProgressTickets = await SupportTicket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await SupportTicket.countDocuments({ status: 'resolved' });
    const unreadTickets = await SupportTicket.countDocuments({ isRead: false });

    // Get tickets by type
    const ticketsByType = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent tickets
    const recentTickets = await SupportTicket.find()
      .populate('user', 'firstName lastName email role')
      .sort({ created: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        unread: unreadTickets,
        byType: ticketsByType,
        recent: recentTickets
      }
    });
  } catch (error) {
    console.error('Error fetching support ticket stats:', error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
