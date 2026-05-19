import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Bus, Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

const AddBus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '', operator: '', from: '', to: '',
    departureTime: '', arrivalTime: '', travelDate: '',
    totalSeats: '', fare: '', busType: 'AC'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/buses/create', {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: parseInt(formData.totalSeats), // Available seats initially equals total
        fare: parseInt(formData.fare)
      });
      setSuccess(true);
      setFormData({
        busNumber: '', operator: '', from: '', to: '',
        departureTime: '', arrivalTime: '', travelDate: '',
        totalSeats: '', fare: '', busType: 'AC'
      });
      // Optionally redirect after a delay
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bus to the system.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header text-center">
        <h2 className="page-title">Add New Bus</h2>
        <p className="page-subtitle">Register a new bus to the fleet schedule</p>
      </div>

      <div className="glass-panel interactive">
        {success && (
          <div className="alert alert-success" style={{ justifyContent: 'center' }}>
            <CheckCircle size={20} /> Bus added successfully! Redirecting...
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Bus size={14} style={{ display: 'inline', marginRight: '4px' }}/> Bus Number / Plate</label>
            <input type="text" className="form-control" placeholder="e.g. NB-1234" required value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Operator Name</label>
            <input type="text" className="form-control" placeholder="e.g. Lanka Express" required value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> Origin (From)</label>
            <input type="text" className="form-control" required value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> Destination (To)</label>
            <input type="text" className="form-control" required value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }}/> Travel Date</label>
            <input type="date" className="form-control" required value={formData.travelDate} onChange={e => setFormData({...formData, travelDate: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Bus Type</label>
            <select className="form-control" value={formData.busType} onChange={e => setFormData({...formData, busType: e.target.value})}>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Semi-Sleeper">Semi-Sleeper</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Departure Time</label>
            <input type="text" className="form-control" placeholder="08:00 AM" required value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Arrival Time</label>
            <input type="text" className="form-control" placeholder="12:00 PM" required value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Total Seats</label>
            <input type="number" min="1" className="form-control" placeholder="e.g. 40" required value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Fare (Rs)</label>
            <input type="number" min="1" className="form-control" placeholder="e.g. 500" required value={formData.fare} onChange={e => setFormData({...formData, fare: e.target.value})} />
          </div>
          
          <div style={{ gridColumn: 'span 2', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Adding Bus...' : 'Publish Bus Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBus;
