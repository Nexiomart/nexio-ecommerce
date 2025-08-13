const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Support Ticket Schema
const SupportTicketSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['contact', 'feedback', 'review', 'help', 'bug_report', 'feature_request'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  adminUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updated' field before saving
SupportTicketSchema.pre('save', function(next) {
  this.updated = Date.now();
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  next();
});

// Index for better query performance
SupportTicketSchema.index({ user: 1, created: -1 });
SupportTicketSchema.index({ status: 1, created: -1 });
SupportTicketSchema.index({ type: 1, created: -1 });
SupportTicketSchema.index({ isRead: 1, created: -1 });

module.exports = Mongoose.model('SupportTicket', SupportTicketSchema);
