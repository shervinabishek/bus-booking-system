import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Bus, Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

const EditBus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    busNumber: '', operator: '', from: '', to: '',
    departureTime: '', arrivalTime: '', travelDate: '',
    totalSeats: '', fare: '', busType: 'AC', status: 'active'
  });

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await api.get(`/buses/getbus/${id}`);
        // Format date for the input field (YYYY-MM-DD)
        const dateObj = new Date(res.data.travelDate);
        const formattedDate = dateObj.toISOString().split('T')[0];
        
        setFormData({
          busNumber: res.data.busNumber,
          operator: res.data.operator,
          from: res.data.from,
          to: res.data.to,
          departureTime: res.data.departureTime,
          arrivalTime: res.data.arrivalTime,
          travelDate: formattedDate,
          totalSeats: res.data.totalSeats,
          fare: res.data.fare,
          busType: res.data.busType,
          status: res.data.status || 'active'
        });
      } catch (err) {
        setError('Failed to fetch bus details.');
      } finally {
        setFetching(false);
      }
    };
    fetchBus();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put(`/buses/update/${id}`, {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        fare: parseInt(formData.fare)
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bus.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-4">Loading bus details...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header text-center">
        <h2 className="page-title">Edit Bus</h2>
        <p className="page-subtitle">Update schedule or details for {formData.busNumber}</p>
      </div>

      <div className="glass-panel interactive">
        {success && (
          <div className="alert alert-success" style={{ justifyContent: 'center' }}>
            <CheckCircle size={20} /> Bus updated successfully! Redirecting...
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
            <input type="text" className="form-control" required value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Operator Name</label>
            <input type="text" className="form-control" required value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} />
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
            <input type="text" className="form-control" required value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Arrival Time</label>
            <input type="text" className="form-control" required value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Total Seats</label>
            <input type="number" min="1" className="form-control" required value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Fare (Rs)</label>
            <input type="number" min="1" className="form-control" required value={formData.fare} onChange={e => setFormData({...formData, fare: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div style={{ gridColumn: 'span 2', marginTop: '24px', display: 'flex', gap: '16px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '14px', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '14px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBus;
