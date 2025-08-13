/*
 *
 * Support
 *
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';

import { API_URL, ROLES } from '../../constants';
import actions from '../../actions';

import SupportTicketForm from '../../components/Manager/SupportTicketForm';
import SupportTicketList from '../../components/Manager/SupportTicketList';
import SupportTicketModal from '../../components/Manager/SupportTicketModal';
import { default as SupportChat } from '../../components/Manager/Support';

class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.user.role === ROLES.Admin ? 'tickets' : 'create',
      tickets: [],
      selectedTicket: null,
      showTicketModal: false,
      isLoading: false,
      isSubmitting: false,
      message: '',
      messageType: 'success'
    };
  }

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(`${API_URL}/support-ticket`);
      this.setState({
        tickets: response.data.tickets || [],
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      this.setState({
        isLoading: false,
        message: 'Failed to load support tickets.',
        messageType: 'danger'
      });
    }
  };

  createTicket = async (ticketData) => {
    try {
      this.setState({ isSubmitting: true });
      const response = await axios.post(`${API_URL}/support-ticket`, ticketData);

      this.setState({
        message: 'Support ticket created successfully! We will respond within 24 hours.',
        messageType: 'success',
        isSubmitting: false
      });

      // Refresh tickets list
      this.fetchTickets();

      // Switch to tickets tab to show the new ticket
      this.setState({ activeTab: 'tickets' });

    } catch (error) {
      console.error('Error creating ticket:', error);
      this.setState({
        message: error.response?.data?.error || 'Failed to create support ticket.',
        messageType: 'danger',
        isSubmitting: false
      });
    }
  };

  respondToTicket = async (ticketId, adminResponse, status) => {
    try {
      this.setState({ isSubmitting: true });
      await axios.put(`${API_URL}/support-ticket/${ticketId}/respond`, {
        adminResponse,
        status
      });

      this.setState({
        message: 'Response sent successfully!',
        messageType: 'success',
        isSubmitting: false,
        showTicketModal: false
      });

      this.fetchTickets();
    } catch (error) {
      console.error('Error responding to ticket:', error);
      this.setState({
        message: error.response?.data?.error || 'Failed to send response.',
        messageType: 'danger',
        isSubmitting: false
      });
    }
  };

  updateTicketStatus = async (ticketId, status) => {
    try {
      await axios.put(`${API_URL}/support-ticket/${ticketId}/status`, { status });

      this.setState({
        message: 'Ticket status updated successfully!',
        messageType: 'success'
      });

      this.fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      this.setState({
        message: error.response?.data?.error || 'Failed to update ticket status.',
        messageType: 'danger'
      });
    }
  };

  handleTicketClick = (ticket) => {
    this.setState({
      selectedTicket: ticket,
      showTicketModal: true
    });
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    const { user } = this.props;
    const {
      activeTab,
      tickets,
      selectedTicket,
      showTicketModal,
      isLoading,
      isSubmitting,
      message,
      messageType
    } = this.state;

    const isAdmin = user.role === ROLES.Admin;

    return (
      <div className='support'>
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="mb-1">
                <i className="fa fa-headphones mr-3"></i>
                Support Center
              </h3>
              <p className="support-subtitle text-muted">
                {isAdmin
                  ? 'Manage and respond to user support requests'
                  : 'Get help, send feedback, or contact our support team'
                }
              </p>
            </div>
            {isAdmin && (
              <div className="text-right">
                <span className="badge badge-danger mr-2">Open: {tickets.filter(t => t.status === 'open').length}</span>
                <span className="badge badge-info">Unread: {tickets.filter(t => !t.isRead).length}</span>
              </div>
            )}
          </div>
        </div>

        {message && (
          <Alert
            color={messageType}
            toggle={() => this.setState({ message: '' })}
            className="support-alert"
          >
            <i className={`fa ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
            {message}
          </Alert>
        )}

        <div className="mb-3">
          <Nav tabs className="support-nav">
            {!isAdmin && (
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'create' })}
                  onClick={() => this.toggleTab('create')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-plus mr-2"></i>
                  Create Ticket
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <NavLink
                className={classnames('support-nav-link', { active: activeTab === 'tickets' })}
                onClick={() => this.toggleTab('tickets')}
              >
                <div className="nav-link-content">
                  <i className="fa fa-list nav-icon"></i>
                  <span className="nav-text">{isAdmin ? 'All Tickets' : 'My Tickets'}</span>
                  <span className="nav-description">
                    {isAdmin ? 'Manage all requests' : 'View your requests'}
                  </span>
                  {tickets.length > 0 && (
                    <span className="nav-badge">{tickets.length}</span>
                  )}
                </div>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames('support-nav-link', { active: activeTab === 'chat' })}
                onClick={() => this.toggleTab('chat')}
              >
                <div className="nav-link-content">
                  <i className="fa fa-comments nav-icon"></i>
                  <span className="nav-text">Live Chat</span>
                  <span className="nav-description">Real-time support</span>
                </div>
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        <div className="support-content">
          <TabContent activeTab={activeTab}>
            {!isAdmin && (
              <TabPane tabId="create" className="support-tab-pane">
                <div className="tab-content-wrapper">
                  <SupportTicketForm
                    onSubmit={this.createTicket}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </TabPane>
            )}

            <TabPane tabId="tickets" className="support-tab-pane">
              <div className="tab-content-wrapper">
                <SupportTicketList
                  tickets={tickets}
                  onTicketClick={this.handleTicketClick}
                  onStatusChange={this.updateTicketStatus}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                />
              </div>
            </TabPane>

            <TabPane tabId="chat" className="support-tab-pane">
              <div className="tab-content-wrapper">
                <div className="chat-container">
                  <SupportChat user={user} />
                </div>
              </div>
            </TabPane>
          </TabContent>
        </div>

        <SupportTicketModal
          isOpen={showTicketModal}
          toggle={() => this.setState({ showTicketModal: false })}
          ticket={selectedTicket}
          isAdmin={isAdmin}
          onRespond={this.respondToTicket}
          onStatusChange={this.updateTicketStatus}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(Support);
