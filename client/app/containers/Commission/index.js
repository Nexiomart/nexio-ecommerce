/*
 *
 * Commission
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import axios from 'axios';

import actions from '../../actions';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import { ROLES, API_URL } from '../../constants';

import './style.scss';

class Commission extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedCommission: null,
      newStatus: '',
      notes: '',
      isPaymentModalOpen: false,
      selectedGrowthPartner: null,
      paymentAmount: 0,
      paymentMethod: 'bank_transfer',
      isProcessingPayment: false,
      showGrowthPartnerStats: false
    };
  }

  componentDidMount() {
    this.props.fetchCommissions();
  }

  // Admin functions
  openStatusModal = (commission) => {
    this.setState({
      isModalOpen: true,
      selectedCommission: commission,
      newStatus: commission.status,
      notes: commission.notes || ''
    });
  };

  closeStatusModal = () => {
    this.setState({
      isModalOpen: false,
      selectedCommission: null,
      newStatus: '',
      notes: ''
    });
  };

  updateCommissionStatus = async () => {
    const { selectedCommission, newStatus, notes } = this.state;

    try {
      const response = await axios.put(`${API_URL}/subscription/commission/${selectedCommission._id}/status`, {
        status: newStatus,
        notes
      });

      if (response.status === 200) {
        this.props.fetchCommissions(); // Refresh the list
        this.closeStatusModal();
        alert('Commission status updated successfully!');
      } else {
        alert('Failed to update commission status');
      }
    } catch (error) {
      console.error('Error updating commission:', error);
      alert('Error updating commission status');
    }
  };

  // Automated Payment Functions
  openPaymentModal = (growthPartnerId, amount) => {
    this.setState({
      isPaymentModalOpen: true,
      selectedGrowthPartner: growthPartnerId,
      paymentAmount: amount
    });
  };

  closePaymentModal = () => {
    this.setState({
      isPaymentModalOpen: false,
      selectedGrowthPartner: null,
      paymentAmount: 0,
      paymentMethod: 'bank_transfer',
      isProcessingPayment: false
    });
  };

  processAutomatedPayment = async () => {
    const { selectedGrowthPartner, paymentAmount, paymentMethod } = this.state;

    this.setState({ isProcessingPayment: true });

    try {
      const response = await axios.post(`${API_URL}/subscription/process-payment`, {
        growthPartnerId: selectedGrowthPartner,
        amount: paymentAmount,
        paymentMethod
      });

      if (response.status === 200) {
        this.props.fetchCommissions(); // Refresh the list
        this.closePaymentModal();
        alert(`Payment of ₹${paymentAmount} processed successfully! Transaction ID: ${response.data.transactionId}`);
      } else {
        alert(`Payment failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error.response?.data?.error || 'Error processing payment';
      alert(errorMessage);
    } finally {
      this.setState({ isProcessingPayment: false });
    }
  };

  processBulkPayments = async () => {
    if (!confirm('Are you sure you want to process all approved commission payments?')) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/subscription/process-bulk-payments`);

      if (response.status === 200) {
        this.props.fetchCommissions(); // Refresh the list
        alert(`Bulk payment processed! ${response.data.processedCount} payments completed. Total: ₹${response.data.totalAmount}`);
      } else {
        alert(`Bulk payment failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error processing bulk payments:', error);
      const errorMessage = error.response?.data?.error || 'Error processing bulk payments';
      alert(errorMessage);
    }
  };

  getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'Pending' },
      approved: { color: 'info', text: 'Approved' },
      paid: { color: 'success', text: 'Paid' },
      cancelled: { color: 'danger', text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  getCommissionTypeIcon = (type) => {
    const typeConfig = {
      subscription: 'fa-user-plus',
      sale: 'fa-shopping-cart',
      renewal: 'fa-refresh'
    };

    return typeConfig[type] || 'fa-money';
  };

  calculateTotalEarnings = () => {
    const { commissions } = this.props;
    return commissions
      .filter(commission => commission.status === 'paid')
      .reduce((total, commission) => total + commission.commissionAmount, 0);
  };

  calculatePendingEarnings = () => {
    const { commissions } = this.props;
    return commissions
      .filter(commission => ['pending', 'approved'].includes(commission.status))
      .reduce((total, commission) => total + commission.commissionAmount, 0);
  };

  calculateApprovedEarnings = () => {
    const { commissions } = this.props;
    return commissions
      .filter(commission => commission.status === 'approved')
      .reduce((total, commission) => total + commission.commissionAmount, 0);
  };

  getGrowthPartnerStats = () => {
    const { commissions } = this.props;
    const stats = {};

    commissions.forEach(commission => {
      // Handle both object and string growth partner IDs
      const gpId = typeof commission.growthPartner === 'object'
        ? commission.growthPartner?._id || commission.growthPartner?.id
        : commission.growthPartner;

      const gpInfo = typeof commission.growthPartner === 'object'
        ? commission.growthPartner
        : null;

      if (!gpId) return; // Skip if no valid GP ID

      if (!stats[gpId]) {
        stats[gpId] = {
          totalCommissions: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          merchantCount: 0,
          commissions: [],
          growthPartnerInfo: gpInfo
        };
      }

      stats[gpId].totalCommissions++;
      stats[gpId].totalAmount += commission.commissionAmount;
      stats[gpId].merchantCount++;
      stats[gpId].commissions.push(commission);

      if (commission.status === 'paid') {
        stats[gpId].paidAmount += commission.commissionAmount;
      } else if (['pending', 'approved'].includes(commission.status)) {
        stats[gpId].pendingAmount += commission.commissionAmount;
      }
    });

    return Object.entries(stats).map(([gpId, data]) => ({
      growthPartnerId: gpId,
      ...data
    }));
  };

  render() {
    const { commissions, isLoading, user } = this.props;
    const { isModalOpen, selectedCommission, newStatus, notes } = this.state;

    // Safety check for commissions
    const safeCommissions = Array.isArray(commissions) ? commissions.filter(c => c && c._id) : [];

    const isAdmin = user?.role === ROLES.Admin;
    const totalEarnings = this.calculateTotalEarnings();
    const pendingEarnings = this.calculatePendingEarnings();
    const approvedEarnings = this.calculateApprovedEarnings();
    const growthPartnerStats = isAdmin ? this.getGrowthPartnerStats() : [];

    return (
      <div className="commission-dashboard">
        <SubPage title="Commission Tracking">
          {isLoading ? (
            <LoadingIndicator inline />
          ) : (
            <>
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={isAdmin ? "3" : "4"}>
                  <Card className="commission-summary-card earnings">
                    <CardBody className="text-center">
                      <i className="fa fa-money fa-2x mb-2"></i>
                      <h4>₹{totalEarnings.toLocaleString()}</h4>
                      <p className="mb-0">{isAdmin ? 'Total Paid' : 'Total Earnings'}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={isAdmin ? "3" : "4"}>
                  <Card className="commission-summary-card pending">
                    <CardBody className="text-center">
                      <i className="fa fa-clock-o fa-2x mb-2"></i>
                      <h4>₹{pendingEarnings.toLocaleString()}</h4>
                      <p className="mb-0">Pending Earnings</p>
                    </CardBody>
                  </Card>
                </Col>
                {isAdmin && (
                  <Col md="3">
                    <Card className="commission-summary-card approved">
                      <CardBody className="text-center">
                        <i className="fa fa-check-circle fa-2x mb-2"></i>
                        <h4>₹{approvedEarnings.toLocaleString()}</h4>
                        <p className="mb-0">Ready to Pay</p>
                      </CardBody>
                    </Card>
                  </Col>
                )}
                <Col md={isAdmin ? "3" : "4"}>
                  <Card className="commission-summary-card total">
                    <CardBody className="text-center">
                      <i className="fa fa-users fa-2x mb-2"></i>
                      <h4>{isAdmin ? growthPartnerStats.length : safeCommissions.length}</h4>
                      <p className="mb-0">{isAdmin ? 'Growth Partners' : 'Total Referrals'}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Admin Controls */}
              {isAdmin && (
                <Row className="mb-4">
                  <Col md="12">
                    <Card className="admin-controls-card">
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Payment Controls</h5>
                          <div>
                            <Button
                              color="success"
                              className="mr-2"
                              onClick={this.processBulkPayments}
                              disabled={approvedEarnings === 0}
                            >
                              <i className="fa fa-credit-card mr-2"></i>
                              Process All Payments (₹{approvedEarnings.toLocaleString()})
                            </Button>
                            <Button
                              color="info"
                              onClick={() => this.setState({ showGrowthPartnerStats: !this.state.showGrowthPartnerStats })}
                            >
                              <i className="fa fa-chart-bar mr-2"></i>
                              {this.state.showGrowthPartnerStats ? 'Hide' : 'Show'} GP Analytics
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Growth Partner Analytics (Admin Only) */}
              {isAdmin && this.state.showGrowthPartnerStats && (
                <Row className="mb-4">
                  <Col md="12">
                    <Card>
                      <CardBody>
                        <h5 className="mb-3">Growth Partner Performance</h5>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Growth Partner ID</th>
                                <th>Merchants Added</th>
                                <th>Total Commissions</th>
                                <th>Paid Amount</th>
                                <th>Pending Amount</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {growthPartnerStats.map((stat, index) => (
                                <tr key={index}>
                                  <td>
                                    <div>
                                      <code>{String(stat.growthPartnerId).substring(0, 8)}...</code>
                                      {stat.growthPartnerInfo && (
                                        <div className="mt-1">
                                          <small className="text-muted">
                                            {stat.growthPartnerInfo.firstName} {stat.growthPartnerInfo.lastName}
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <Badge color="primary">{stat.merchantCount}</Badge>
                                  </td>
                                  <td>₹{stat.totalAmount.toLocaleString()}</td>
                                  <td>
                                    <span className="text-success">₹{stat.paidAmount.toLocaleString()}</span>
                                  </td>
                                  <td>
                                    <span className="text-warning">₹{stat.pendingAmount.toLocaleString()}</span>
                                  </td>
                                  <td>
                                    {stat.pendingAmount > 0 && (
                                      <Button
                                        size="sm"
                                        color="success"
                                        onClick={() => this.openPaymentModal(String(stat.growthPartnerId), stat.pendingAmount)}
                                      >
                                        Pay ₹{stat.pendingAmount.toLocaleString()}
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Commission List */}
              {safeCommissions.length > 0 ? (
                <div className="commission-list">
                  <h5 className="mb-3">Commission History</h5>
                  {safeCommissions.map((commission, index) => (
                    <Card key={commission._id || index} className="commission-item mb-3">
                      <CardBody>
                        <Row className="align-items-center">
                          <Col md="2" className="text-center">
                            <i className={`fa ${this.getCommissionTypeIcon(commission.commissionType)} fa-2x commission-icon`}></i>
                          </Col>
                          <Col md="4">
                            <h6 className="mb-1">
                              {commission.referredUser ?
                                `${commission.referredUser.firstName || ''} ${commission.referredUser.lastName || ''}`.trim() :
                                'Unknown User'
                              }
                            </h6>
                            <small className="text-muted">
                              {commission.referredUser?.email || 'No email available'}
                            </small>
                            <div className="mt-1">
                              <small className="text-info">
                                {commission.subscription?.subscriptionPlan?.modelName || 'Unknown'} Plan
                              </small>
                            </div>
                          </Col>
                          <Col md="2" className="text-center">
                            <h5 className="commission-amount mb-0">
                              ₹{commission.commissionAmount.toLocaleString()}
                            </h5>
                            <small className="text-muted text-capitalize">
                              {commission.commissionType}
                            </small>
                          </Col>
                          <Col md="2" className="text-center">
                            {this.getStatusBadge(commission.status)}
                            {isAdmin && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  color="primary"
                                  onClick={() => this.openStatusModal(commission)}
                                >
                                  Update Status
                                </Button>
                              </div>
                            )}
                          </Col>
                          <Col md="2" className="text-center">
                            <small className="text-muted">
                              {new Date(commission.created).toLocaleDateString()}
                            </small>
                            {commission.paidDate && (
                              <div>
                                <small className="text-success">
                                  Paid: {new Date(commission.paidDate).toLocaleDateString()}
                                </small>
                              </div>
                            )}
                            {isAdmin && commission.growthPartner && (
                              <div className="mt-1">
                                <small className="text-info">
                                  GP: {typeof commission.growthPartner === 'object'
                                    ? `${commission.growthPartner.firstName || ''} ${commission.growthPartner.lastName || ''}`.trim() || 'Unknown GP'
                                    : String(commission.growthPartner).substring(0, 8) + '...'
                                  }
                                </small>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <NotFound message="No commissions found. Start referring merchants to earn commissions!" />
              )}

              {/* Admin Status Update Modal */}
              {isAdmin && (
                <Modal isOpen={isModalOpen} toggle={this.closeStatusModal}>
                  <ModalHeader toggle={this.closeStatusModal}>
                    Update Commission Status
                  </ModalHeader>
                  <ModalBody>
                    {selectedCommission && (
                      <div>
                        <p><strong>Commission ID:</strong> {selectedCommission._id}</p>
                        <p><strong>Amount:</strong> ₹{selectedCommission.commissionAmount}</p>
                        <p><strong>Merchant:</strong> {
                          selectedCommission.referredUser ?
                            `${selectedCommission.referredUser.firstName || ''} ${selectedCommission.referredUser.lastName || ''}`.trim() :
                            'Unknown User'
                        }</p>

                        <FormGroup>
                          <Label for="status">Status</Label>
                          <Input
                            type="select"
                            name="status"
                            id="status"
                            value={newStatus}
                            onChange={(e) => this.setState({ newStatus: e.target.value })}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                          </Input>
                        </FormGroup>

                        <FormGroup>
                          <Label for="notes">Notes (Optional)</Label>
                          <Input
                            type="textarea"
                            name="notes"
                            id="notes"
                            value={notes}
                            onChange={(e) => this.setState({ notes: e.target.value })}
                            placeholder="Add any notes about this commission..."
                          />
                        </FormGroup>
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.updateCommissionStatus}>
                      Update Status
                    </Button>
                    <Button color="secondary" onClick={this.closeStatusModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              )}

              {/* Automated Payment Modal */}
              {isAdmin && (
                <Modal isOpen={this.state.isPaymentModalOpen} toggle={this.closePaymentModal}>
                  <ModalHeader toggle={this.closePaymentModal}>
                    Process Automated Payment
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      <p><strong>Growth Partner ID:</strong> {this.state.selectedGrowthPartner}</p>
                      <p><strong>Payment Amount:</strong> ₹{this.state.paymentAmount.toLocaleString()}</p>

                      <FormGroup>
                        <Label for="paymentMethod">Payment Method</Label>
                        <Input
                          type="select"
                          name="paymentMethod"
                          id="paymentMethod"
                          value={this.state.paymentMethod}
                          onChange={(e) => this.setState({ paymentMethod: e.target.value })}
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="upi">UPI Payment</option>
                          <option value="razorpay_payout">Razorpay Payout</option>
                          <option value="paypal">PayPal</option>
                        </Input>
                      </FormGroup>

                      <div className="alert alert-info">
                        <i className="fa fa-info-circle mr-2"></i>
                        This will automatically process the payment and update all approved commissions to "Paid" status.
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      onClick={this.processAutomatedPayment}
                      disabled={this.state.isProcessingPayment}
                    >
                      {this.state.isProcessingPayment ? (
                        <>
                          <i className="fa fa-spinner fa-spin mr-2"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-credit-card mr-2"></i>
                          Process Payment
                        </>
                      )}
                    </Button>
                    <Button color="secondary" onClick={this.closePaymentModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              )}
            </>
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    commissions: state.subscription.commissions,
    isLoading: state.subscription.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(Commission);
