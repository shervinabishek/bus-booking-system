import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Bus, Clock, Calendar as CalIcon, MapPin, CreditCard, X } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking modal state
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookingData, setBookingData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    seatNumber: ''
  });
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const travelDate = searchParams.get('travelDate');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/buses/search?from=${from}&to=${to}&travelDate=${travelDate}`);
        setBuses(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No buses found for this route and date.');
        } else {
          setError('Failed to fetch buses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (from && to && travelDate) {
      fetchBuses();
    }
  }, [from, to, travelDate]);

  const handleBookClick = (bus) => {
    setSelectedBus(bus);
    setBookingStatus(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings/create', {
        ...bookingData,
        busId: selectedBus._id,
        seatNumber: parseInt(bookingData.seatNumber)
      });
      setBookingStatus('success');
      // Update local bus state to decrement seat
      setBuses(buses.map(b => b._id === selectedBus._id ? { ...b, availableSeats: b.availableSeats - 1 } : b));
      setTimeout(() => {
        setSelectedBus(null);
        setBookingData({ passengerName: '', passengerEmail: '', passengerPhone: '', seatNumber: '' });
      }, 2000);
    } catch (err) {
      setBookingStatus(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading available buses...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Search Results</h2>
        <p className="page-subtitle">
          Buses from <strong>{from}</strong> to <strong>{to}</strong> on {travelDate}
        </p>
      </div>

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="grid">
          {buses.map(bus => (
            <div key={bus._id} className="glass-panel interactive flex justify-between items-center" style={{ padding: '24px' }}>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{bus.operator}</h3>
                  <span className="badge badge-success">{bus.busType}</span>
                </div>
                
                <div className="flex gap-4" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> <span>{bus.departureTime} - {bus.arrivalTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus size={16} /> <span>{bus.busNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{bus.availableSeats} / {bus.totalSeats} seats available</span>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                  Rs. {bus.fare}
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookClick(bus)}
                  disabled={bus.availableSeats <= 0}
                >
                  {bus.availableSeats > 0 ? 'Book Seat' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedBus && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Book Seat - {selectedBus.operator}</h3>
              <button className="btn-icon" onClick={() => setSelectedBus(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {bookingStatus === 'success' ? (
                <div className="alert alert-success">Booking confirmed successfully!</div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {bookingStatus && <div className="alert alert-error">{bookingStatus}</div>}
                  
                  <div className="form-group">
                    <label>Passenger Name</label>
                    <input 
                      type="text" className="form-control" required
                      value={bookingData.passengerName}
                      onChange={e => setBookingData({...bookingData, passengerName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" className="form-control" required
                      value={bookingData.passengerEmail}
                      onChange={e => setBookingData({...bookingData, passengerEmail: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" className="form-control" required
                      value={bookingData.passengerPhone}
                      onChange={e => setBookingData({...bookingData, passengerPhone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Seat Number (1 - {selectedBus.totalSeats})</label>
                    <input 
                      type="number" className="form-control" min="1" max={selectedBus.totalSeats} required
                      value={bookingData.seatNumber}
                      onChange={e => setBookingData({...bookingData, seatNumber: e.target.value})}
                    />
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Confirm Booking - Rs. {selectedBus.fare}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
