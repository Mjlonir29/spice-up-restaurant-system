import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerTableView from './pages/CustomerTableView';
import KitchenPage from './pages/KitchenPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/table-view" element={<CustomerTableView />} />
        <Route path="/kitchen" element={<KitchenPage />} />
      </Routes>
    </Router>
  );
}

export default App;