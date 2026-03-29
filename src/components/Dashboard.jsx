import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, UserPlus, LogOut, TrendingUp } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <div className="container">
      <div className="navbar">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button 
            className="btn btn-secondary" 
            onClick={handleLogout}
            style={{ marginLeft: '1rem' }}
          >
            <LogOut size={16} style={{ marginRight: '5px' }} />
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stats-card">
          <Users size={40} color="#667eea" />
          <h3>{stats.totalCustomers}</h3>
          <p>Total Customers</p>
        </div>

        <div className="stats-card">
          <UserPlus size={40} color="#28a745" />
          <h3>{stats.newCustomersThisMonth}</h3>
          <p>New Customers This Month</p>
        </div>

        <div className="stats-card">
          <TrendingUp size={40} color="#ffc107" />
          <h3>${stats.totalRevenue.toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/customers')}
          >
            Manage Customers
          </button>
          <button 
            className="btn btn-success"
            onClick={() => navigate('/customers?action=add')}
          >
            Add New Customer
          </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Recent Activity</h2>
        <p style={{ color: '#666', textAlign: 'center' }}>
          No recent activity to display.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
