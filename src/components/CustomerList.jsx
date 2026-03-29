import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react'
import axios from 'axios'

const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    customerNumber: '',
    name: '',
    fatherName: '',
    dateOfBirth: '',
    address: '',
    mobileNo: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNo.includes(searchTerm)
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers')
      setCustomers(response.data)
      setFilteredCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setFormData({
      customerNumber: '',
      name: '',
      fatherName: '',
      dateOfBirth: '',
      address: '',
      mobileNo: ''
    })
    setError('')
    setSuccess('')
    setShowModal(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      customerNumber: customer.customerNumber,
      name: customer.name,
      fatherName: customer.fatherName,
      dateOfBirth: customer.dateOfBirth,
      address: customer.address,
      mobileNo: customer.mobileNo
    })
    setError('')
    setSuccess('')
    setShowModal(true)
  }

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`/api/customers/${customerId}`)
        setSuccess('Customer deleted successfully')
        fetchCustomers()
      } catch (error) {
        setError('Failed to delete customer')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingCustomer) {
        await axios.put(`/api/customers/${editingCustomer._id}`, formData)
        setSuccess('Customer updated successfully')
      } else {
        await axios.post('/api/customers', formData)
        setSuccess('Customer added successfully')
      }
      
      setShowModal(false)
      fetchCustomers()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save customer')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <div className="container">
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} style={{ marginRight: '5px' }} />
            Back to Dashboard
          </button>
          <h1>Customer Management</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button 
            className="btn btn-secondary" 
            onClick={handleLogout}
            style={{ marginLeft: '1rem' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Customers</h2>
          <button className="btn btn-primary" onClick={handleAddCustomer}>
            <UserPlus size={16} style={{ marginRight: '5px' }} />
            Add Customer
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '300px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#666'
              }} 
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {filteredCustomers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No customers found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Number</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Mobile No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.customerNumber}</td>
                    <td>{customer.name}</td>
                    <td>{customer.fatherName}</td>
                    <td>{new Date(customer.dateOfBirth).toLocaleDateString()}</td>
                    <td>{customer.address}</td>
                    <td>{customer.mobileNo}</td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleEditCustomer(customer)}
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDeleteCustomer(customer._id)}
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="customerNumber">Customer Number</label>
                <input
                  type="text"
                  id="customerNumber"
                  name="customerNumber"
                  value={formData.customerNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fatherName">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNo">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCustomer ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerList
