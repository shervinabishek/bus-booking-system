import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Search, Ticket, Calendar, MapPin, XCircle, Trash2, ArrowLeft } from 'lucide-react';

const MyBookings = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async (searchEmail) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/bookings/passenger/${searchEmail}`);
      setBookings(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBookings([]);
        setError('No bookings found for this email.');
      } else {
        setError('Failed to fetch bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (emailInput) {
      fetchBookings(emailInput);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/cancel/${id}`);
        // Refresh bookings
        fetchBookings(emailInput);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking record?')) {
      try {
        await api.delete(`/bookings/delete/${id}`);
        fetchBookings(emailInput);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      <div className="page-header text-center">
        <h2 className="page-title">My Bookings</h2>
        <p className="page-subtitle">View and manage your ticket reservations</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your booking email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>
            <Search size={18} /> Find Bookings
          </button>
        </form>
      </div>

      {loading && <div className="text-center">Loading your bookings...</div>}
      
      {error && !loading && <div className="alert alert-warning text-center" style={{maxWidth: '600px', margin: '0 auto'}}>{error}</div>}

      {!loading && bookings.length > 0 && (
        <div className="grid">
          {bookings.map(booking => (
            <div key={booking._id} className="glass-panel flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={20} color="var(--primary)"/>
                  <h3 style={{ margin: 0 }}>Ticket #{booking._id.substring(booking._id.length - 6).toUpperCase()}</h3>
                  <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                    {booking.status}
                  </span>
                </div>
                
                {booking.busId ? (
                  <div className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16}/> {booking.busId.from} to {booking.busId.to}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16}/> {new Date(booking.busId.travelDate).toLocaleDateString()} at {booking.busId.departureTime}
                    </div>
                    <div>
                      <strong>Bus:</strong> {booking.busId.operator} ({booking.busId.busNumber}) | <strong>Seat:</strong> {booking.seatNumber}
                    </div>
                    <div className="mt-2 text-white">
                      <strong>Fare Paid:</strong> Rs. {booking.fare}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-secondary">Bus details unavailable.</div>
                )}
              </div>
              
              <div className="flex" style={{ flexDirection: 'column', gap: '10px' }}>
                {booking.status === 'confirmed' && (
                  <button className="btn btn-secondary" onClick={() => handleCancel(booking._id)}>
                    <XCircle size={16} /> Cancel
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(booking._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
