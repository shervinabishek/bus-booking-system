import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bus, User, Settings } from 'lucide-react';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import AddBus from './pages/AddBus';
import EditBus from './pages/EditBus';
import { useLocation } from 'react-router-dom';

function App() {
  const NavLinks = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}><Bus size={18} /> Book Tickets</Link>
        <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings')}`}><User size={18} /> My Bookings</Link>
        <Link to="/admin" className={`nav-link ${isActive('/admin')}`}><Settings size={18} /> Manage Fleet</Link>
        <Link to="/add-bus" className="btn btn-primary" style={{ padding: '8px 16px', marginLeft: '12px' }}><Bus size={16}/> Add Bus</Link>
      </div>
    );
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <Bus size={28} color="#6366f1" />
            <span>NexusRide</span>
          </Link>
          <NavLinks />
        </div>
      </nav>

      <main className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/add-bus" element={<AddBus />} />
          <Route path="/edit-bus/:id" element={<EditBus />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
