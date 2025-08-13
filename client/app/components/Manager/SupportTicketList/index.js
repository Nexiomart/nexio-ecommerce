import React from 'react';
import { Card, CardBody, Badge, Button, Row, Col } from 'reactstrap';
import moment from 'moment';

const SupportTicketList = ({ tickets, onTicketClick, onStatusChange, isAdmin, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'info';
      case 'medium': return 'primary';
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'primary';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'contact': 'General Contact',
      'feedback': 'Feedback',
      'review': 'Review Issue',
      'help': 'Need Help',
      'bug_report': 'Bug Report',
      'feature_request': 'Feature Request'
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <i className="fa fa-spinner fa-spin"></i>
          </div>
          <p className="loading-text">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fa fa-ticket"></i>
        </div>
        <h4 className="empty-title">No Support Tickets</h4>
        <p className="empty-description">
          {isAdmin
            ? "No tickets have been submitted yet. When users create support tickets, they will appear here."
            : "You haven't submitted any support tickets yet. Create your first ticket to get help from our support team."
          }
        </p>
        {!isAdmin && (
          <Button color="primary" className="empty-action-btn">
            <i className="fa fa-plus mr-2"></i>
            Create Your First Ticket
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="support-ticket-list">
      <div className="tickets-header">
        <h5 className="tickets-title">
          <i className="fa fa-list mr-2"></i>
          {isAdmin ? 'All Support Tickets' : 'Your Support Tickets'}
        </h5>
        <div className="tickets-count">
          <span className="count-number">{tickets.length}</span>
          <span className="count-label">ticket{tickets.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="tickets-container">
        {tickets.map(ticket => (
          <div key={ticket._id} className={`ticket-card ${ticket.status} ${!ticket.isRead && isAdmin ? 'unread' : ''}`}>
            <div className="ticket-header">
              <div className="ticket-title-section">
                <h6 className="ticket-subject" onClick={() => onTicketClick(ticket)}>
                  {ticket.subject}
                </h6>
                <div className="ticket-badges">
                  <span className={`status-badge status-${ticket.status}`}>
                    <i className={`fa ${ticket.status === 'open' ? 'fa-circle' : ticket.status === 'in_progress' ? 'fa-clock' : ticket.status === 'resolved' ? 'fa-check' : 'fa-times'}`}></i>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`priority-badge priority-${ticket.priority}`}>
                    <i className="fa fa-flag"></i>
                    {ticket.priority.toUpperCase()}
                  </span>
                  {!ticket.isRead && isAdmin && (
                    <span className="new-badge">
                      <i className="fa fa-star"></i>
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <div className="ticket-type">
                <span className="type-label">
                  <i className="fa fa-tag"></i>
                  {getTypeLabel(ticket.type)}
                </span>
              </div>
            </div>

            <div className="ticket-content">
              <div className="ticket-meta">
                {isAdmin && ticket.user && (
                  <div className="user-info">
                    <i className="fa fa-user"></i>
                    <span className="user-name">{ticket.user.firstName} {ticket.user.lastName}</span>
                    <span className="user-role">({ticket.user.role})</span>
                  </div>
                )}
                <div className="time-info">
                  <i className="fa fa-clock"></i>
                  <span className="created-time">{moment(ticket.created).fromNow()}</span>
                  {ticket.resolvedAt && (
                    <span className="resolved-time">
                      • Resolved {moment(ticket.resolvedAt).fromNow()}
                    </span>
                  )}
                </div>
              </div>

              <div className="ticket-message">
                <p>
                  {ticket.message.length > 150
                    ? `${ticket.message.substring(0, 150)}...`
                    : ticket.message
                  }
                </p>
              </div>

              {ticket.adminResponse && (
                <div className="admin-response">
                  <div className="response-header">
                    <i className="fa fa-reply"></i>
                    <span className="response-label">Admin Response</span>
                  </div>
                  <div className="response-content">
                    {ticket.adminResponse.length > 100
                      ? `${ticket.adminResponse.substring(0, 100)}...`
                      : ticket.adminResponse
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="ticket-actions">
              <Button
                color="primary"
                size="sm"
                onClick={() => onTicketClick(ticket)}
                className="view-details-btn"
              >
                <i className="fa fa-eye"></i>
                View Details
              </Button>

              {isAdmin && (
                <div className="admin-actions">
                  {ticket.status === 'open' && (
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => onStatusChange(ticket._id, 'in_progress')}
                      className="action-btn start-btn"
                    >
                      <i className="fa fa-play"></i>
                      Start Working
                    </Button>
                  )}
                  {ticket.status === 'in_progress' && (
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => onStatusChange(ticket._id, 'resolved')}
                      className="action-btn resolve-btn"
                    >
                      <i className="fa fa-check"></i>
                      Mark Resolved
                    </Button>
                  )}
                  {(ticket.status === 'resolved' || ticket.status === 'open') && (
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => onStatusChange(ticket._id, 'closed')}
                      className="action-btn close-btn"
                    >
                      <i className="fa fa-times"></i>
                      Close
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketList;
