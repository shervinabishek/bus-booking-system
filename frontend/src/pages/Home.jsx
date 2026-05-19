import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    travelDate: ''
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchParams.from && searchParams.to && searchParams.travelDate) {
      navigate(`/search?from=${searchParams.from}&to=${searchParams.to}&travelDate=${searchParams.travelDate}`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ fontSize: '3.5rem' }}>Where to next?</h1>
        <p className="page-subtitle">Book your bus tickets with NexusRide and travel safely.</p>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '32px' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Leaving From</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Colombo"
              value={searchParams.from}
              onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Going To</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Kandy"
              value={searchParams.to}
              onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Calendar size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Date of Journey</label>
            <input 
              type="date" 
              className="form-control" 
              value={searchParams.travelDate}
              onChange={(e) => setSearchParams({...searchParams, travelDate: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', height: '45px' }}>
            <Search size={18} /> Search Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
