import React, { useState } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Badge, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Alert,
  Row,
  Col 
} from 'reactstrap';
import moment from 'moment';

const SupportTicketModal = ({ 
  isOpen, 
  toggle, 
  ticket, 
  isAdmin, 
  onRespond, 
  onStatusChange, 
  isSubmitting 
}) => {
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('in_progress');
  const [showResponseForm, setShowResponseForm] = useState(false);

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

  const handleRespond = (e) => {
    e.preventDefault();
    if (adminResponse.trim()) {
      onRespond(ticket._id, adminResponse, newStatus);
      setAdminResponse('');
      setShowResponseForm(false);
    }
  };

  if (!ticket) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Support Ticket Details
      </ModalHeader>
      <ModalBody>
        <div className="ticket-header mb-4">
          <Row>
            <Col md={8}>
              <h5 className="mb-2">{ticket.subject}</h5>
              <div className="ticket-badges mb-3">
                <Badge color={getStatusColor(ticket.status)} className="mr-2">
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge color={getPriorityColor(ticket.priority)} className="mr-2">
                  {ticket.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge color="info">
                  {getTypeLabel(ticket.type)}
                </Badge>
              </div>
            </Col>
            <Col md={4} className="text-right">
              <small className="text-muted">
                <div>Created: {moment(ticket.created).format('MMM DD, YYYY HH:mm')}</div>
                {ticket.resolvedAt && (
                  <div>Resolved: {moment(ticket.resolvedAt).format('MMM DD, YYYY HH:mm')}</div>
                )}
              </small>
            </Col>
          </Row>
        </div>

        {isAdmin && ticket.user && (
          <div className="user-info mb-4 p-3 bg-light rounded">
            <h6 className="mb-2">
              <i className="fa fa-user mr-2"></i>
              User Information
            </h6>
            <Row>
              <Col md={6}>
                <strong>Name:</strong> {ticket.user.firstName} {ticket.user.lastName}
              </Col>
              <Col md={6}>
                <strong>Email:</strong> {ticket.user.email}
              </Col>
              <Col md={6}>
                <strong>Role:</strong> {ticket.user.role}
              </Col>
            </Row>
          </div>
        )}

        <div className="ticket-message mb-4">
          <h6>
            <i className="fa fa-comment mr-2"></i>
            Original Message
          </h6>
          <div className="p-3 border rounded bg-white">
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.message}
            </p>
          </div>
        </div>

        {ticket.adminResponse && (
          <div className="admin-response mb-4">
            <h6 className="text-success">
              <i className="fa fa-reply mr-2"></i>
              Admin Response
            </h6>
            <div className="p-3 border rounded bg-light">
              <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                {ticket.adminResponse}
              </p>
              {ticket.adminUser && (
                <small className="text-muted">
                  - {ticket.adminUser.firstName} {ticket.adminUser.lastName}
                </small>
              )}
            </div>
          </div>
        )}

        {isAdmin && !showResponseForm && (
          <div className="admin-actions mb-3">
            <Button
              color="primary"
              onClick={() => setShowResponseForm(true)}
              className="mr-2"
            >
              <i className="fa fa-reply mr-1"></i>
              {ticket.adminResponse ? 'Add Another Response' : 'Respond to Ticket'}
            </Button>
            
            {ticket.status !== 'closed' && (
              <Button
                color="secondary"
                onClick={() => onStatusChange(ticket._id, 'closed')}
              >
                <i className="fa fa-times mr-1"></i>
                Close Ticket
              </Button>
            )}
          </div>
        )}

        {isAdmin && showResponseForm && (
          <div className="response-form">
            <h6>
              <i className="fa fa-reply mr-2"></i>
              Admin Response
            </h6>
            <Form onSubmit={handleRespond}>
              <FormGroup>
                <Label for="adminResponse">Your Response</Label>
                <Input
                  type="textarea"
                  id="adminResponse"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type your response to the user..."
                  rows={4}
                  maxLength={2000}
                  required
                />
                <small className="text-muted">
                  {adminResponse.length}/2000 characters
                </small>
              </FormGroup>
              
              <FormGroup>
                <Label for="newStatus">Update Status</Label>
                <Input
                  type="select"
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Input>
              </FormGroup>
              
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => {
                    setShowResponseForm(false);
                    setAdminResponse('');
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting || !adminResponse.trim()}
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SupportTicketModal;
