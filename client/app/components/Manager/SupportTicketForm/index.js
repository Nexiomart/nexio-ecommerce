import React, { useState } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const SupportTicketForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    type: 'help',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  const ticketTypes = [
    { value: 'contact', label: 'General Contact' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'review', label: 'Review/Rating Issue' },
    { value: 'help', label: 'Need Help' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'feature_request', label: 'Feature Request' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        type: 'help',
        subject: '',
        message: '',
        priority: 'medium'
      });
    }
  };

  return (
    <div className="support-ticket-form">
      <div className="form-header">
        <div className="form-icon">
          <i className="fa fa-ticket"></i>
        </div>
        <div className="form-title-section">
          <h4 className="form-title">Create Support Ticket</h4>
          <p className="form-subtitle">Tell us how we can help you today</p>
        </div>
      </div>

      <div className="form-content">
        <Form onSubmit={handleSubmit}>
          <div className="form-section">
            <h6 className="section-title">
              <i className="fa fa-info-circle mr-2"></i>
              Request Details
            </h6>
            <Row>
              <Col md={6}>
                <FormGroup className="custom-form-group">
                  <Label for="type" className="custom-label">
                    <i className="fa fa-tag mr-2"></i>
                    Type of Request
                  </Label>
                  <div className="custom-select-wrapper">
                    <Input
                      type="select"
                      name="type"
                      id="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="custom-select"
                      required
                    >
                      {ticketTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Input>
                    <i className="fa fa-chevron-down select-arrow"></i>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="custom-form-group">
                  <Label for="priority" className="custom-label">
                    <i className="fa fa-flag mr-2"></i>
                    Priority Level
                  </Label>
                  <div className="custom-select-wrapper">
                    <Input
                      type="select"
                      name="priority"
                      id="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="custom-select"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </Input>
                    <i className="fa fa-chevron-down select-arrow"></i>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="fa fa-edit mr-2"></i>
              Ticket Information
            </h6>

            <FormGroup className="custom-form-group">
              <Label for="subject" className="custom-label">
                <i className="fa fa-header mr-2"></i>
                Subject
              </Label>
              <Input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your issue or request"
                maxLength={200}
                invalid={!!errors.subject}
                className="custom-input"
                required
              />
              {errors.subject && (
                <Alert color="danger" className="custom-alert">
                  <i className="fa fa-exclamation-circle mr-2"></i>
                  {errors.subject}
                </Alert>
              )}
              <div className="input-footer">
                <small className="character-count">
                  {formData.subject.length}/200 characters
                </small>
              </div>
            </FormGroup>

            <FormGroup className="custom-form-group">
              <Label for="message" className="custom-label">
                <i className="fa fa-comment mr-2"></i>
                Detailed Message
              </Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide detailed information about your request. Include any relevant details that will help us assist you better..."
                rows={6}
                maxLength={2000}
                invalid={!!errors.message}
                className="custom-textarea"
                required
              />
              {errors.message && (
                <Alert color="danger" className="custom-alert">
                  <i className="fa fa-exclamation-circle mr-2"></i>
                  {errors.message}
                </Alert>
              )}
              <div className="input-footer">
                <small className="character-count">
                  {formData.message.length}/2000 characters
                </small>
              </div>
            </FormGroup>
          </div>

          <div className="form-footer">
            <div className="footer-info">
              <div className="info-item">
                <i className="fa fa-clock mr-2"></i>
                <small>Response within 24 hours</small>
              </div>
              <div className="info-item">
                <i className="fa fa-shield mr-2"></i>
                <small>Your information is secure</small>
              </div>
            </div>
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fa fa-paper-plane mr-2"></i>
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SupportTicketForm;
