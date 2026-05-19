import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Plus, Trash2, Bus, Edit, Ticket, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buses'); // 'buses' or 'bookings'
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/buses/getallbuses');
      setBuses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/getallbookings');
      setBookings(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'buses') fetchBuses();
    else fetchBookings();
  }, [activeTab]);

  const handleDeleteBus = async (id) => {
    if (window.confirm('Delete this bus?')) {
      try {
        await api.delete(`/buses/delete/${id}`);
        fetchBuses();
      } catch (err) {
        alert('Failed to delete bus');
      }
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        await api.put(`/bookings/cancel/${id}`);
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Delete this booking record?')) {
      try {
        await api.delete(`/bookings/delete/${id}`);
        fetchBookings();
      } catch (err) {
        alert('Failed to delete booking');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">Manage fleet, schedules, and reservations</p>
        </div>
        {activeTab === 'buses' && (
          <button className="btn btn-primary" onClick={() => navigate('/add-bus')}>
            <Plus size={18} /> Add New Bus
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--surface-border)' }}>
        <button 
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'buses' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'buses' ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('buses')}
        >
          Manage Buses
        </button>
        <button 
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'bookings' ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading data...</div>
      ) : activeTab === 'buses' ? (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '16px' }}>Bus Number</th>
                  <th style={{ padding: '16px' }}>Operator</th>
                  <th style={{ padding: '16px' }}>Route</th>
                  <th style={{ padding: '16px' }}>Date/Time</th>
                  <th style={{ padding: '16px' }}>Seats</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(bus => (
                  <tr key={bus._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-2">
                        <Bus size={16} className="text-primary" />
                        {bus.busNumber}
                        <span className={`badge ${bus.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{fontSize:'0.65rem'}}>{bus.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{bus.operator}</td>
                    <td style={{ padding: '16px' }}>{bus.from} &rarr; {bus.to}</td>
                    <td style={{ padding: '16px' }}>
                      {new Date(bus.travelDate).toLocaleDateString()} <br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bus.departureTime}</span>
                    </td>
                    <td style={{ padding: '16px' }}>{bus.availableSeats} / {bus.totalSeats}</td>
                    <td style={{ padding: '16px' }}>
                      <div className="flex justify-center gap-2">
                        <button className="btn-icon" style={{ background: 'rgba(255, 255, 255, 0.1)' }} onClick={() => navigate(`/edit-bus/${bus._id}`)} title="Edit Bus">
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} onClick={() => handleDeleteBus(bus._id)} title="Delete Bus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {buses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center" style={{ padding: '32px' }}>No buses found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '16px' }}>Booking ID</th>
                  <th style={{ padding: '16px' }}>Passenger Info</th>
                  <th style={{ padding: '16px' }}>Bus Details</th>
                  <th style={{ padding: '16px' }}>Seat</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                      <Ticket size={14} className="text-primary inline mr-1" /> 
                      {booking._id.substring(booking._id.length - 6).toUpperCase()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <strong>{booking.passengerName}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{booking.passengerEmail}</span><br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{booking.passengerPhone}</span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                      {booking.busId ? (
                        <>
                          <strong>{booking.busId.busNumber}</strong><br/>
                          {booking.busId.from} to {booking.busId.to}<br/>
                          <span style={{ color: 'var(--text-secondary)' }}>{new Date(booking.busId.travelDate).toLocaleDateString()}</span>
                        </>
                      ) : <span className="text-secondary">N/A</span>}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{booking.seatNumber}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div className="flex justify-center gap-2">
                        {booking.status === 'confirmed' && (
                          <button className="btn-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }} onClick={() => handleCancelBooking(booking._id)} title="Cancel Booking">
                            <XCircle size={16} />
                          </button>
                        )}
                        <button className="btn-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} onClick={() => handleDeleteBooking(booking._id)} title="Delete Record">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center" style={{ padding: '32px' }}>No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
