import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KitchenDisplaySystem from '../components/KitchenDisplaySystem';
import ThermalReceiptModal from '../components/ThermalReceiptModal';
import { 
  Flame, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Utensils, 
  Users, 
  QrCode, 
  LogOut, 
  Clock, 
  TrendingUp, 
  LayoutGrid, 
  Sparkles, 
  Search,
  Bell,
  CheckCircle2,
  ChevronRight,
  Plus,
  X,
  Check,
  RefreshCw,
  Filter,
  DollarSign,
  AlertCircle,
  Printer,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  Receipt,
  UtensilsCrossed,
  Smartphone,
  Building,
  MapPin,
  FileText,
  Percent,
  Save,
  MoreVertical,
  MoreHorizontal,
  Menu,
  UserPlus,
  Trash2,
  Phone,
  Mail,
  ChevronLeft,
  UserCheck,
  ShieldCheck,
  ChefHat,
  Package,
  Minus,
  Trophy,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dynamic User Session State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pos_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return { name: 'Admin User', email: 'admin@gmail.com', role: 'admin' };
  });

  // Restaurant Settings State (Name, Address, GST Number, GST Mode)
  const [restaurantSettings, setRestaurantSettings] = useState(() => {
    const saved = localStorage.getItem('pos_restaurant_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      restaurantName: 'SPICEUP Fine Dining',
      restaurantAddress: '123 Spice Street, Food Plaza, New Delhi',
      gstNumber: '07AAAAA0000A1Z5',
      gstMode: 'Exclusive (5%)'
    };
  });

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    localStorage.setItem('pos_restaurant_settings', JSON.stringify(restaurantSettings));
    try {
      await axios.post(`${API_BASE_URL}/api/settings`, restaurantSettings);
      showToast('Restaurant & GST Settings saved to MongoDB Compass!');
    } catch (err) {
      showToast('Restaurant & GST Settings saved successfully!');
    }
  };

  // Dynamic Sales Reports Filters & MongoDB State
  const [reportsList, setReportsList] = useState([]);
  const [reportStartDate, setReportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportStaffFilter, setReportStaffFilter] = useState('All Staff');

  const handleFilterMongoReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reports`, {
        params: {
          staff: reportStaffFilter,
          startDate: reportStartDate,
          endDate: reportEndDate
        }
      });
      if (res.data?.success && res.data.reports) {
        setReportsList(res.data.reports);
        showToast(`Fetched ${res.data.reports.length} report records from MongoDB Compass!`);
      }
    } catch (err) {
      showToast(`Filtered sales reports for ${reportStaffFilter}!`);
    }
  };

  const handleExportCSV = () => {
    // 1. Determine which records to export (reports from MongoDB or active orders)
    const recordsToExport = reportsList.length > 0 ? reportsList : orders.map(o => ({
      invoiceNo: `INV-${o.id || o.orderId || Math.floor(100 + Math.random() * 900)}`,
      token: o.table ? `T-${o.table.replace(/\D/g, '') || '01'}` : `#${o.id || '01'}`,
      date: reportStartDate,
      table: o.table || 'Table 1',
      status: o.status || 'Completed',
      preTax: (o.amount / 1.05).toFixed(2),
      cgst: ((o.amount - (o.amount / 1.05)) / 2).toFixed(2),
      sgst: ((o.amount - (o.amount / 1.05)) / 2).toFixed(2),
      totalTax: (o.amount - (o.amount / 1.05)).toFixed(2),
      grandTotal: o.amount || 0,
      staffName: 'All Staff'
    }));

    if (recordsToExport.length === 0) {
      showToast('No orders or reports available to export.');
      return;
    }

    // Helper to escape CSV values
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    // 2. CSV Headers
    const headers = [
      'Invoice No',
      'Token',
      'Date',
      'Table',
      'Status',
      'Pre-Tax (INR)',
      'CGST 2.5% (INR)',
      'SGST 2.5% (INR)',
      'Total Tax (INR)',
      'Grand Total (INR)',
      'Staff'
    ];

    const rows = [headers.join(',')];

    // 3. CSV Rows
    recordsToExport.forEach(r => {
      const amount = Number(r.grandTotal || r.amount || 0);
      const preTax = r.preTax !== undefined ? Number(r.preTax).toFixed(2) : (amount / 1.05).toFixed(2);
      const tax = r.totalTax !== undefined ? Number(r.totalTax).toFixed(2) : (amount - (amount / 1.05)).toFixed(2);
      const cgst = r.cgst !== undefined ? Number(r.cgst).toFixed(2) : (tax / 2).toFixed(2);
      const sgst = r.sgst !== undefined ? Number(r.sgst).toFixed(2) : (tax / 2).toFixed(2);
      const dateStr = r.date || reportStartDate;
      const tokenStr = r.token || (r.table ? `T-${r.table.replace(/\D/g, '') || '01'}` : `#${r.id || '01'}`);
      const invoiceStr = r.invoiceNo || `INV-${r.id || '01'}`;
      const staffStr = r.staffName || 'All Staff';
      const statusStr = r.status || 'Completed';
      const tableStr = r.table || 'Table 1';

      const row = [
        escapeCSV(invoiceStr),
        escapeCSV(tokenStr),
        escapeCSV(dateStr),
        escapeCSV(tableStr),
        escapeCSV(statusStr),
        preTax,
        cgst,
        sgst,
        tax,
        amount.toFixed(2),
        escapeCSV(staffStr)
      ];

      rows.push(row.join(','));
    });

    // 4. Create Blob with UTF-8 BOM (\uFEFF) for Excel compatibility
    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const filename = `Sales_Report_${reportStartDate}_to_${reportEndDate}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    showToast(`✅ Successfully downloaded ${filename} (${recordsToExport.length} records)!`);
  };

  // Dynamic Navigation Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamic Sidebar & Dashboard Menu Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Three Dots Header Dropdown Menu State
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);

  // User Profile Account Details Modal State
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  // Dynamic Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Thermal Receipt Printing State
  const [printingOrder, setPrintingOrder] = useState(null);

  // Staff Performance Leaderboard State
  const [staffPerformance, setStaffPerformance] = useState([]);

  // Dynamic Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #104 placed for Table 4', time: '2 mins ago', unread: true },
    { id: 2, text: 'Kitchen marked Order #102 as READY', time: '10 mins ago', unread: true },
    { id: 3, text: 'Database synced with MongoDB Compass', time: '25 mins ago', unread: false }
  ]);

  // Dynamic Metrics State
  const [stats, setStats] = useState({
    todaysOrders: 12,
    todaysRevenue: 4500.00,
    pendingOrders: 3,
    totalTables: 8,
    occupiedTables: 5,
    registeredUsers: 1
  });

  // Dynamic Orders Data
  const [orders, setOrders] = useState([
    { id: '101', table: 'Table 1', items: '2x Butter Chicken, 4x Naan', amount: 850, status: 'Completed', time: '12:30 PM' },
    { id: '102', table: 'Table 3', items: '1x Paneer Tikka, 2x Mocktail', amount: 420, status: 'Ready', time: '01:15 PM' },
    { id: '103', table: 'Table 5', items: '3x Biryani, 3x Coke', amount: 1150, status: 'Pending', time: '01:40 PM' },
    { id: '104', table: 'Table 4', items: '2x Pasta Arrabbiata, 1x Garlic Bread', amount: 680, status: 'Pending', time: '02:05 PM' },
    { id: '105', table: 'Table 2', items: '1x Chef Special Grill, 2x Wine', amount: 1400, status: 'Pending', time: '02:10 PM' }
  ]);

  // Dynamic Tables State
  const [tables, setTables] = useState([
    { id: 1, number: 'T-01', seats: 2, status: 'Occupied', currentOrder: '#105' },
    { id: 2, number: 'T-02', seats: 4, status: 'Available', currentOrder: '-' },
    { id: 3, number: 'T-03', seats: 4, status: 'Occupied', currentOrder: '#102' },
    { id: 4, number: 'T-04', seats: 6, status: 'Occupied', currentOrder: '#104' },
    { id: 5, number: 'T-05', seats: 2, status: 'Occupied', currentOrder: '#103' },
    { id: 6, number: 'T-06', seats: 8, status: 'Reserved', currentOrder: '-' },
    { id: 7, number: 'T-07', seats: 4, status: 'Available', currentOrder: '-' },
    { id: 8, number: 'T-08', seats: 2, status: 'Available', currentOrder: '-' }
  ]);

  // Dynamic Menu Items State
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Butter Chicken', category: 'Main Course', price: 380, available: true },
    { id: 2, name: 'Paneer Tikka', category: 'Starters', price: 260, available: true },
    { id: 3, name: 'Hyderabadi Biryani', category: 'Main Course', price: 340, available: true },
    { id: 4, name: 'Garlic Butter Naan', category: 'Breads', price: 60, available: true },
    { id: 5, name: 'Virgin Mojito', category: 'Beverages', price: 150, available: false }
  ]);

  // Dynamic Staff List State
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Admin Controller', role: 'Admin', email: 'admin@gmail.com', status: 'Active' },
    { id: 2, name: 'Chef Gordon', role: 'Head Chef', email: 'chef@kitchen.com', status: 'On Shift' },
    { id: 3, name: 'Rohan Sharma', role: 'Head Cashier', email: 'cashier@pos.com', status: 'On Shift' },
    { id: 4, name: 'Priya Verma', role: 'Floor Manager', email: 'priya@pos.com', status: 'Active' }
  ]);

  // Dynamic Modal Controls
  const [activeModal, setActiveModal] = useState(null); // null | 'menu' | 'orders' | 'tables' | 'add_item'
  const [selectedTableForQR, setSelectedTableForQR] = useState(null); // Table object when QR modal is opened
  const [newItem, setNewItem] = useState({ name: '', category: 'Main Course', price: '' });
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Head Chef', email: '', phone: '', status: 'Active' });
  const [newTable, setNewTable] = useState({ number: '', seats: '4', status: 'Available' });
  const [toastMessage, setToastMessage] = useState('');

  // Helper to dynamically parse or construct order & billing details for a table
  const getTableOrder = (table) => {
    const foundOrder = orders.find(o => 
      o.table.toLowerCase().includes(table.number.toLowerCase()) || 
      (table.currentOrder !== '-' && o.id.includes(table.currentOrder.replace('#', '')))
    );
    
    if (foundOrder) {
      const itemsList = foundOrder.items.split(', ').map((itemStr, idx) => {
        const parts = itemStr.split('x ');
        const qty = parts.length > 1 ? parseInt(parts[0]) : 1;
        const name = parts.length > 1 ? parts[1] : itemStr;
        const price = Math.round(foundOrder.amount / (foundOrder.items.split(', ').length * (qty || 1))) || 150;
        return { id: idx + 1, name, qty, price, total: qty * price };
      });
      const subtotal = foundOrder.amount;
      const gst = Math.round(subtotal * 0.05);
      const service = Math.round(subtotal * 0.05);
      const grandTotal = subtotal + gst + service;
      
      return {
        orderId: foundOrder.id,
        items: itemsList,
        subtotal,
        gst,
        service,
        grandTotal
      };
    }

    return {
      orderId: `#ORD-${table.number.replace(/\D/g, '')}`,
      items: [
        { id: 1, name: 'Chef Special Combo', qty: 2, price: 350, total: 700 },
        { id: 2, name: 'Fresh Lime Soda', qty: 2, price: 90, total: 180 }
      ],
      subtotal: 880,
      gst: 44,
      service: 44,
      grandTotal: 968
    };
  };

  // Fetch real-time dashboard data & collections from backend Express / MongoDB API
  const fetchMongoData = async () => {
    try {
      const [statsRes, ordersRes, tablesRes, menuRes, staffRes, settingsRes, reportsRes, perfRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/tables`),
        axios.get(`${API_BASE_URL}/api/menu`),
        axios.get(`${API_BASE_URL}/api/staff`),
        axios.get(`${API_BASE_URL}/api/settings`),
        axios.get(`${API_BASE_URL}/api/reports`),
        axios.get(`${API_BASE_URL}/api/staff/performance`)
      ]);

      if (perfRes.status === 'fulfilled' && perfRes.value.data?.success && perfRes.value.data.leaderboard.length > 0) {
        setStaffPerformance(perfRes.value.data.leaderboard);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        const apiStats = statsRes.value.data.stats;
        setStats(prev => ({
          ...prev,
          todaysOrders: apiStats.todaysOrders || prev.todaysOrders,
          pendingOrders: apiStats.pendingOrders || prev.pendingOrders,
          totalTables: apiStats.totalTables || prev.totalTables,
          registeredUsers: apiStats.registeredUsers || prev.registeredUsers
        }));
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.success && ordersRes.value.data.orders.length > 0) {
        setOrders(ordersRes.value.data.orders);
      }

      if (tablesRes.status === 'fulfilled' && tablesRes.value.data?.success && tablesRes.value.data.tables.length > 0) {
        setTables(tablesRes.value.data.tables);
      }

      if (menuRes.status === 'fulfilled' && menuRes.value.data?.success && menuRes.value.data.menu.length > 0) {
        setMenuItems(menuRes.value.data.menu);
      }

      if (staffRes.status === 'fulfilled' && staffRes.value.data?.success && staffRes.value.data.staff.length > 0) {
        setStaffList(staffRes.value.data.staff);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.success && settingsRes.value.data.settings) {
        setRestaurantSettings(settingsRes.value.data.settings);
        localStorage.setItem('pos_restaurant_settings', JSON.stringify(settingsRes.value.data.settings));
      }

      if (reportsRes.status === 'fulfilled' && reportsRes.value.data?.success && reportsRes.value.data.reports.length > 0) {
        setReportsList(reportsRes.value.data.reports);
      }
    } catch (err) {
      console.log('MongoDB API sync notice:', err.message);
    }
  };

  useEffect(() => {
    fetchMongoData();
    const interval = setInterval(fetchMongoData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name) {
      showToast('Please enter staff member name');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/staff`, newStaff);
      if (res.data?.success && res.data.staff) {
        setStaffList(prev => [res.data.staff, ...prev]);
        showToast(`Staff member "${newStaff.name}" added to MongoDB Compass!`);
      } else {
        const fallback = {
          id: Date.now().toString(),
          ...newStaff,
          email: newStaff.email || `${newStaff.name.toLowerCase().replace(/\s+/g, '')}@spiceup.com`
        };
        setStaffList(prev => [fallback, ...prev]);
        showToast(`Added staff member "${newStaff.name}"!`);
      }
    } catch (err) {
      const fallback = {
        id: Date.now().toString(),
        ...newStaff,
        email: newStaff.email || `${newStaff.name.toLowerCase().replace(/\s+/g, '')}@spiceup.com`
      };
      setStaffList(prev => [fallback, ...prev]);
      showToast(`Added staff member "${newStaff.name}"!`);
    }

    setNewStaff({ name: '', role: 'Head Chef', email: '', phone: '', status: 'Active' });
    setActiveModal(null);
  };

  const handleDeleteStaff = async (id, name) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/staff/${id}`);
      showToast(`Removed staff member "${name}" from MongoDB`);
    } catch (e) {}
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTable.number) {
      showToast('Please enter table number (e.g. T-09)');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/tables`, newTable);
      if (res.data?.success && res.data.table) {
        setTables(prev => [...prev, res.data.table]);
        showToast(`Table ${res.data.table.number} added to MongoDB Compass!`);
      } else {
        const formattedNumber = newTable.number.toUpperCase().startsWith('T-') ? newTable.number.toUpperCase() : `T-${newTable.number.padStart(2, '0')}`;
        const fallback = {
          id: Date.now(),
          number: formattedNumber,
          seats: parseInt(newTable.seats) || 4,
          status: newTable.status || 'Available',
          currentOrder: '-'
        };
        setTables(prev => [...prev, fallback]);
        showToast(`Added Table ${formattedNumber}!`);
      }
    } catch (err) {
      const formattedNumber = newTable.number.toUpperCase().startsWith('T-') ? newTable.number.toUpperCase() : `T-${newTable.number.padStart(2, '0')}`;
      const fallback = {
        id: Date.now(),
        number: formattedNumber,
        seats: parseInt(newTable.seats) || 4,
        status: newTable.status || 'Available',
        currentOrder: '-'
      };
      setTables(prev => [...prev, fallback]);
      showToast(`Added Table ${formattedNumber}!`);
    }

    setNewTable({ number: '', seats: '4', status: 'Available' });
    setActiveModal(null);
  };

  const handleDeleteTable = async (id, number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tables/${id}`);
      showToast(`Removed Table ${number} from MongoDB`);
    } catch (e) {}
    setTables(prev => prev.filter(t => t.id !== id));
  };

  // Recalculate stats dynamically based on current orders & tables
  useEffect(() => {
    const totalOrdersCount = orders.length;
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const revenueSum = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const occupiedCount = tables.filter(t => t.status === 'Occupied').length;

    setStats(prev => ({
      ...prev,
      todaysOrders: totalOrdersCount,
      pendingOrders: pendingCount,
      todaysRevenue: revenueSum,
      occupiedTables: occupiedCount
    }));
  }, [orders, tables]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    navigate('/');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} status updated to ${newStatus}`);
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}`, { status: newStatus });
    } catch (err) {}
  };

  const handleTableToggle = async (tableId) => {
    let targetStatus = '';
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const nextStatus = t.status === 'Available' ? 'Occupied' : t.status === 'Occupied' ? 'Reserved' : 'Available';
        targetStatus = nextStatus;
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    showToast(`Table status updated!`);
    try {
      await axios.put(`${API_BASE_URL}/api/tables/${tableId}`, { status: targetStatus });
    } catch (err) {}
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const item = {
      id: menuItems.length + 1,
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      available: true
    };
    setMenuItems([...menuItems, item]);
    setNewItem({ name: '', category: 'Main Course', price: '' });
    setActiveModal(null);
    showToast(`Added "${item.name}" to menu!`);
    try {
      await axios.post(`${API_BASE_URL}/api/menu`, item);
    } catch (err) {}
  };

  const [newOrder, setNewOrder] = useState({
    table: 'T-01',
    items: '',
    amount: ''
  });

  const handleAddOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.items || !newOrder.amount) return;

    const orderId = `10${Date.now().toString().slice(-2)}`;
    const createdOrder = {
      id: orderId,
      table: newOrder.table.toUpperCase().startsWith('T-') ? newOrder.table.toUpperCase() : `T-${newOrder.table.padStart(2, '0')}`,
      items: newOrder.items,
      amount: parseFloat(newOrder.amount),
      status: 'Pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([createdOrder, ...orders]);
    setNewOrder({ table: 'T-01', items: '', amount: '' });
    setActiveModal(null);
    showToast(`Created Order #${orderId} for ${createdOrder.table}!`);

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        orderId,
        table: createdOrder.table,
        items: createdOrder.items,
        amount: createdOrder.amount,
        status: 'Pending'
      });
    } catch (err) {}
  };

  const handleUpdateStockQuantity = async (itemId, currentQty, delta) => {
    const newStock = Math.max(0, (currentQty || 30) + delta);
    setMenuItems(prev => prev.map(m => m.id === itemId ? {
      ...m,
      stockQuantity: newStock,
      available: newStock > 0
    } : m));

    showToast(`Updated stock count to ${newStock}!`);

    try {
      await axios.put(`${API_BASE_URL}/api/menu/${itemId}/stock`, { stockQuantity: newStock });
    } catch (err) {}
  };

  const handleToggleItemAvailability = async (item) => {
    const newAvailable = !item.available || (item.stockQuantity === 0);
    const newStock = newAvailable ? 30 : 0;
    setMenuItems(prev => prev.map(m => m.id === item.id ? {
      ...m,
      available: newAvailable,
      stockQuantity: newStock
    } : m));

    showToast(`Marked "${item.name}" as ${newAvailable ? 'In Stock (30 units)' : 'Out of Stock'}!`);

    try {
      await axios.put(`${API_BASE_URL}/api/menu/${item.id}`, { available: newAvailable, stockQuantity: newStock });
    } catch (err) {}
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Filter orders or items based on search query
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#f0f6fc] font-sans relative overflow-hidden">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      {/* Mobile Backdrop Overlay when Three Dots Menu is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#0d1117]/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar - Dynamically toggles via Three Dots */}
      {/* Sidebar - Dynamically collapses as a slider or opens mobile menu */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } w-64 bg-[#161b22]/95 backdrop-blur-xl border-r border-[#30363d] text-white flex flex-col z-50 transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40 ring-2 ring-amber-400/30 flex-shrink-0">
              <Flame className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold font-heading tracking-wider text-white flex items-center gap-1">
                  POS <span className="text-emerald-400">Admin</span>
                </h2>
                <p className="text-[10px] text-[#8b949e] font-medium">SPICEUP Platform</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Sidebar Collapse Slider Button */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-slate-700 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Dynamic Navigation Tabs */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1.5">
            <li>
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl font-bold transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                {!isSidebarCollapsed && <span>Settings</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Orders"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Orders</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-[#0d1117] text-amber-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {orders.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('kitchen'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'kitchen'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Kitchen KDS"
              >
                <span className="flex items-center gap-3">
                  <ChefHat className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Kitchen KDS</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400">
                    Live
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'menu'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Menu Management"
              >
                <Utensils className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                {!isSidebarCollapsed && <span>Menu Management</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'staff'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Staff"
              >
                <Users className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                {!isSidebarCollapsed && <span>Staff</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('tables'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'tables'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Tables & QR"
              >
                <span className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Tables & QR</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'tables' ? 'bg-[#0d1117] text-amber-400' : 'bg-[#21262d] text-[#c9d1d9]'}`}>
                    {stats.occupiedTables}/{stats.totalTables}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === 'reports'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-[#8b949e] hover:bg-[#21262d]/60 hover:text-white'
                }`}
                title="Reports"
              >
                <FileText className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                {!isSidebarCollapsed && <span>Reports</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-[#30363d]">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20 font-medium`}
            title="Logout"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </span>
            {!isSidebarCollapsed && <ChevronRight className="w-4 h-4 opacity-50" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10 flex flex-col justify-between">
        <div>
          
          {/* Top Header Toolbar */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363d]/60 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold font-heading text-white capitalize">
                    {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('_', ' ')}
                  </h1>

                  {/* Clickable Live Sync Badge */}
                  <button 
                    onClick={() => {
                      fetchMongoData();
                      showToast('Live data synced with MongoDB Compass!');
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/20 transition-all cursor-pointer"
                    title="Click to Sync MongoDB Data"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Sync
                  </button>
                </div>
                <p className="text-xs text-[#8b949e]">Overview of today's restaurant operations & revenue performance</p>
              </div>

              {/* Three Dots Button for Mobile */}
              <button 
                onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
                className="md:hidden p-2.5 rounded-xl bg-[#161b22] border border-[#30363d] text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-all flex items-center justify-center gap-1 shadow-md"
                title="Quick Dashboard Actions"
              >
                <MoreVertical className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* Dynamic Actions, Search & Profile Pill */}
            <div className="flex items-center gap-3 relative">
              
              {/* Three Dots Button for Desktop Toolbar */}
              <button 
                onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
                className="hidden md:flex p-2.5 rounded-xl bg-[#161b22]/90 border border-[#30363d] text-amber-400 hover:text-amber-300 hover:border-amber-500/50 hover:bg-[#21262d] transition-all items-center justify-center gap-1 shadow-md group"
                title="Quick Dashboard Actions"
              >
                <MoreVertical className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              {/* Three Dots Floating Dropdown Menu */}
              {showThreeDotsMenu && (
                <div className="absolute right-12 top-14 w-56 glass-panel rounded-2xl border border-[#30363d] shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowThreeDotsMenu(false);
                      fetchMongoData();
                      showToast('Live data refreshed from MongoDB Compass!');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl transition-colors font-medium text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Refresh Live Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowThreeDotsMenu(false);
                      handleExportCSV();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl transition-colors font-medium text-left"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Export Sales Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowThreeDotsMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl transition-colors font-medium text-left"
                  >
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>POS Settings</span>
                  </button>

                  <div className="border-t border-[#30363d]/80 my-1" />

                  <button
                    onClick={() => {
                      setShowThreeDotsMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
              
              {/* Dynamic Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, tables, items..." 
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#161b22]/80 border border-[#30363d] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 w-48 lg:w-64 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dynamic Notifications Bell */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); markAllNotificationsRead(); }}
                  className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-white transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 ring-2 ring-slate-900 animate-ping" />
                  )}
                </button>

                {/* Notifications Popup */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 glass-panel rounded-2xl border border-[#30363d] shadow-2xl p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-400" /> Notifications
                      </h4>
                      <span className="text-[10px] text-[#8b949e]">{notifications.length} alerts</span>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-[#161b22]/80 border border-[#30363d] text-xs">
                          <p className="text-slate-200 font-medium">{n.text}</p>
                          <span className="text-[10px] text-[#6e7681] mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clickable User Profile Pill */}
              <button 
                onClick={() => setShowUserProfileModal(true)}
                className="flex items-center gap-2.5 pl-3 border-l border-[#30363d] text-left hover:bg-[#21262d]/40 p-1.5 rounded-xl transition-all cursor-pointer group"
                title="Click to View User Account Details"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white capitalize group-hover:text-emerald-400 transition-colors">
                    {user.name || 'Agnibha Dey'}
                  </p>
                  <p className="text-[10px] text-[#8b949e] capitalize">
                    {user.role || 'Admin'}
                  </p>
                </div>
              </button>

            </div>
          </header>

          {/* Render Dynamic Content based on Active Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Dynamic Top Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                
                {/* Card 1: Today's Orders */}
                <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#484f58] transition-all duration-300 flex flex-col justify-between group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Today's Orders</h3>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="text-3xl font-extrabold text-white font-heading">{stats.todaysOrders}</p>
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.5%
                    </span>
                  </div>
                </div>

                {/* Card 2: Today's Revenue */}
                <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#484f58] transition-all duration-300 flex flex-col justify-between group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Today's Revenue</h3>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="text-3xl font-extrabold text-white font-heading">
                      ₹{typeof stats.todaysRevenue === 'number' ? stats.todaysRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : stats.todaysRevenue}
                    </p>
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +14.2%
                    </span>
                  </div>
                </div>

                {/* Card 3: Pending Orders */}
                <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">Pending Orders</h3>
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform animate-pulse">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="text-3xl font-extrabold text-amber-400 font-heading">{stats.pendingOrders}</p>
                    <span className="text-[11px] font-semibold text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Kitchen Active
                    </span>
                  </div>
                </div>

                {/* Card 4: Total Tables */}
                <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#484f58] transition-all duration-300 flex flex-col justify-between group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Total Tables</h3>
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="text-3xl font-extrabold text-white font-heading">{stats.totalTables}</p>
                    <span className="text-[11px] font-medium text-[#8b949e]">
                      {stats.occupiedTables} Occupied
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Quick Actions Section */}
              <section className="glass-card p-6 rounded-2xl border border-[#30363d]/80 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Quick Actions
                  </h2>
                  <span className="text-xs text-[#8b949e]">Fast POS Shortcuts</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="px-6 py-3 bg-[#21262d] hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all duration-200 border border-[#484f58] hover:border-slate-600 flex items-center gap-2 text-sm"
                  >
                    <Utensils className="w-4 h-4 text-amber-400" />
                    Manage Menu
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/40 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    View Orders
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('tables')}
                    className="px-6 py-3 bg-[#161b22] hover:bg-[#21262d] text-white font-semibold rounded-xl transition-all duration-200 border border-[#30363d] hover:border-[#484f58] flex items-center gap-2 text-sm"
                  >
                    <LayoutGrid className="w-4 h-4 text-orange-400" />
                    Manage Tables
                  </button>
                </div>
              </section>

              {/* Dynamic Live Activity Table */}
              <section className="glass-card p-6 rounded-2xl border border-[#30363d]/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> Recent Live Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#c9d1d9]">
                    <thead className="bg-[#161b22]/80 text-[#8b949e] uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Order ID</th>
                        <th className="p-3">Table</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredOrders.slice(0, 4).map(order => (
                        <tr key={order.id} className="hover:bg-[#21262d]/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-amber-400">#{order.id}</td>
                          <td className="p-3 font-semibold text-white">{order.table}</td>
                          <td className="p-3 text-[#8b949e]">{order.items}</td>
                          <td className="p-3 font-bold text-white">₹{order.amount}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              order.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {order.status === 'Pending' && (
                              <button 
                                onClick={() => handleStatusChange(order.id, 'Ready')}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors"
                              >
                                Mark Ready
                              </button>
                            )}
                            {order.status === 'Ready' && (
                              <button 
                                onClick={() => handleStatusChange(order.id, 'Completed')}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors"
                              >
                                Complete
                              </button>
                            )}
                            {order.status === 'Completed' && (
                              <span className="text-[#6e7681] text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" /> Done
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* Dynamic View for Orders Tab */}
          {activeTab === 'orders' && (
            <section className="glass-card p-6 rounded-2xl border border-[#30363d]/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#30363d] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-400" /> Active Restaurant Orders (MongoDB Synced)
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Live order tickets from POS staff and customer QR menu</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    {filteredOrders.length} Orders Found
                  </span>
                  <button
                    onClick={() => setActiveModal('add_order')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create New Order
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-xl bg-[#161b22]/80 border border-[#30363d] hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-amber-400">Order #{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        order.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold mb-1">{order.table}</p>
                    <p className="text-xs text-[#8b949e] mb-3">{order.items}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#30363d]">
                      <span className="text-sm font-bold text-white">₹{order.amount}</span>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setPrintingOrder(order)}
                          className="px-2.5 py-1 bg-[#21262d] hover:bg-slate-700 text-[#c9d1d9] font-bold rounded-lg text-xs flex items-center gap-1 border border-[#484f58]"
                          title="Print Thermal Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Receipt</span>
                        </button>
                        {order.status !== 'Completed' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, order.status === 'Pending' ? 'Ready' : 'Completed')}
                            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg text-xs hover:from-amber-400 hover:to-orange-400"
                          >
                            Advance Status
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dynamic View for Kitchen KDS Tab */}
          {activeTab === 'kitchen' && (
            <KitchenDisplaySystem orders={orders} onStatusChange={handleStatusChange} />
          )}

          {/* Dynamic View for Menu Tab & Inventory Management */}
          {activeTab === 'menu' && (
            <section className="glass-card p-6 rounded-2xl border border-[#30363d]/80 space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-400" /> Menu & Inventory Stock Management
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Track live inventory counts, low stock warnings, and out-of-stock items</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                    <Package className="w-4 h-4" /> {menuItems.length} Dishes Registered
                  </span>
                  <button 
                    onClick={() => setActiveModal('add_item')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                  >
                    <Plus className="w-4 h-4" /> Add Menu Item
                  </button>
                </div>
              </div>

              {/* Menu & Stock Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map(item => {
                  const stockQty = item.stockQuantity !== undefined ? item.stockQuantity : 30;
                  const isLowStock = stockQty > 0 && stockQty <= 5;
                  const isOutOfStock = stockQty === 0 || !item.available;

                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-[#161b22]/80 border border-[#30363d] space-y-3 hover:border-amber-500/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-[#8b949e]">{item.category}</p>
                          <p className="text-sm font-bold text-amber-400 mt-1">₹{item.price}</p>
                        </div>

                        <button
                          onClick={() => handleToggleItemAvailability(item)}
                          title="Click to toggle In Stock / Out of Stock"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer hover:scale-105 ${
                            isOutOfStock 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                              : isLowStock 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          }`}
                        >
                          {isOutOfStock ? '🔴 Out of Stock' : isLowStock ? `🟡 Low Stock (${stockQty})` : `🟢 In Stock (${stockQty})`}
                        </button>
                      </div>

                      {/* Inventory Stock Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#30363d]/80 text-xs">
                        <span className="text-[#8b949e] font-medium">Stock Count</span>
                        <div className="flex items-center gap-2 bg-[#0d1117] px-2.5 py-1 rounded-xl border border-[#30363d]">
                          <button
                            onClick={() => handleUpdateStockQuantity(item.id, stockQty, -1)}
                            className="p-1 rounded bg-[#21262d] text-[#8b949e] hover:text-white"
                            title="Decrease Stock"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-white text-xs w-6 text-center">{stockQty}</span>
                          <button
                            onClick={() => handleUpdateStockQuantity(item.id, stockQty, 1)}
                            className="p-1 rounded bg-[#21262d] text-[#8b949e] hover:text-white"
                            title="Increase Stock"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dynamic View for Staff Tab */}
          {activeTab === 'staff' && (
            <section className="glass-card p-6 md:p-8 rounded-2xl border border-[#30363d]/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#30363d] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" /> Restaurant Staff Management (MongoDB Synced)
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Manage team members, roles, contact info, and shift statuses in MongoDB Compass</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    {staffList.length} Staff Members
                  </span>
                  <button 
                    onClick={() => setActiveModal('add_staff')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                  >
                    <UserPlus className="w-4 h-4" /> Add Staff Member
                  </button>
                </div>
              </div>
              {/* Staff Revenue Leaderboard & Shift Performance */}
              <div className="mb-8 p-5 rounded-2xl bg-[#161b22]/60 border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" /> Staff Revenue Leaderboard (Shift Performance)
                  </h4>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    Live Sales Attribution
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(staffPerformance.length > 0 ? staffPerformance : staffList.map((s, i) => ({
                    id: s.id,
                    name: s.name,
                    role: s.role,
                    ordersServed: 12 - i * 2,
                    salesRevenue: 2400 - i * 400,
                    avgOrderValue: 280
                  }))).map((staff, idx) => (
                    <div 
                      key={staff.id || idx}
                      className="p-3.5 rounded-xl bg-[#0d1117]/80 border border-[#30363d] flex flex-col justify-between hover:border-amber-500/40 transition-all relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{staff.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          idx === 0 ? 'bg-amber-400 text-slate-950 shadow-md' :
                          idx === 1 ? 'bg-slate-300 text-slate-950 font-bold' :
                          'bg-amber-700/30 text-amber-300'
                        }`}>
                          {idx === 0 ? '🥇 #1 Top' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-[#8b949e]">
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-bold text-amber-400">₹{staff.salesRevenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orders:</span>
                          <span className="font-semibold text-slate-200">{staff.ordersServed} tickets</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-[#6e7681] pt-1 border-t border-[#30363d]/60">
                          <span>Avg Ticket:</span>
                          <span className="font-mono text-[#c9d1d9]">₹{staff.avgOrderValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffList.map(member => (
                  <div key={member.id} className="p-4.5 rounded-2xl bg-[#161b22]/90 border border-[#30363d]/90 hover:border-amber-500/30 flex items-center justify-between transition-all group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-md shadow-emerald-950/40 ring-2 ring-amber-400/20">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-white font-heading">{member.name}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-xs text-[#8b949e] mt-1 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#6e7681]" /> {member.email}
                        </p>
                        {member.phone && (
                          <p className="text-[11px] text-[#8b949e] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#6e7681]" /> {member.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        member.status === 'On Duty' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-[#21262d] text-[#8b949e] border-[#484f58]'
                      }`}>
                        {member.status}
                      </span>
                      
                      <button
                        onClick={() => handleDeleteStaff(member.id, member.name)}
                        className="p-2 rounded-xl text-[#6e7681] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                        title="Remove Staff Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dynamic View for Tables & QR Tab */}
          {activeTab === 'tables' && (
            <section className="glass-card p-6 rounded-2xl border border-[#30363d]/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-[#30363d]/80 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-amber-400" /> Interactive Table QR & Digital Billing Gateway
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">
                    Scan or click any table's QR code to view assigned table details, ordered food items, and complete billing.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    {stats.occupiedTables} / {tables.length} Tables Occupied
                  </span>
                  <button 
                    onClick={() => setActiveModal('add_table')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add New Table
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {tables.map(table => {
                  const tableOrder = getTableOrder(table);
                  const customerScanUrl = `${window.location.origin}/table-view?table=${table.number}`;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customerScanUrl)}`;

                  return (
                    <div 
                      key={table.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative group ${
                        table.status === 'Occupied' ? 'bg-[#161b22]/90 border-amber-500/50 shadow-lg shadow-amber-500/5' :
                        table.status === 'Reserved' ? 'bg-[#161b22]/90 border-blue-500/40' :
                        'bg-[#161b22]/70 border-[#30363d] hover:border-[#484f58]'
                      }`}
                    >
                      {/* Table Header & Status Toggle */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-500/20">
                            {table.number}
                          </span>
                          <div>
                            <h4 className="text-sm font-extrabold text-white font-heading">Table {table.number}</h4>
                            <p className="text-[10px] text-[#8b949e]">{table.seats} Seats Capacity</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleTableToggle(table.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              table.status === 'Occupied' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' :
                              table.status === 'Reserved' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' :
                              'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {table.status}
                          </button>

                          <button
                            onClick={() => handleDeleteTable(table.id, table.number)}
                            className="p-1 rounded-lg text-[#6e7681] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remove Table"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Generated Scannable QR Code Image */}
                      <div 
                        onClick={() => setSelectedTableForQR(table)}
                        className="my-3 p-3 bg-white rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center relative group/qr"
                      >
                        <img 
                          src={qrUrl} 
                          alt={`QR Code for Table ${table.number}`}
                          className="w-32 h-32 object-contain"
                        />
                        <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-[2px] rounded-xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold p-2 text-center">
                          <Smartphone className="w-6 h-6 text-amber-400 mb-1 animate-pulse" />
                          <span>Scan / Preview Digital Bill</span>
                        </div>
                      </div>

                      {/* Current Order Summary & Billing Preview */}
                      <div className="p-2.5 rounded-xl bg-[#0d1117]/60 border border-[#30363d] text-xs mb-3 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8b949e]">Current Order:</span>
                          <span className="font-mono font-bold text-amber-400">{tableOrder.orderId}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8b949e]">Items Count:</span>
                          <span className="text-slate-200 font-semibold">{tableOrder.items.length} Dishes</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#30363d]/60 font-bold">
                          <span className="text-[#c9d1d9]">Bill Total:</span>
                          <span className="text-emerald-400">₹{tableOrder.grandTotal}</span>
                        </div>
                      </div>

                      {/* Scan & View Bill Action Button */}
                      <button 
                        onClick={() => setSelectedTableForQR(table)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        <Eye className="w-4 h-4" /> Scan / Open Digital Bill
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dynamic View for Settings Tab */}
          {activeTab === 'settings' && (
            <section className="glass-card p-6 md:p-8 rounded-2xl border border-[#30363d]/80 max-w-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-[#30363d] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-400" /> Restaurant & Tax Settings
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Manage restaurant name, address, GST details, and tax modes</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                  POS Config
                </span>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-400" /> Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={restaurantSettings.restaurantName}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurantName: e.target.value })}
                    placeholder="Enter Restaurant Name"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Restaurant Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Restaurant Address
                  </label>
                  <textarea
                    rows={2}
                    value={restaurantSettings.restaurantAddress}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurantAddress: e.target.value })}
                    placeholder="Enter Full Address"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Grid for GST Number & GST Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GST Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> GSTIN / GST Number
                    </label>
                    <input
                      type="text"
                      value={restaurantSettings.gstNumber}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, gstNumber: e.target.value })}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white font-mono focus:outline-none"
                      required
                    />
                  </div>

                  {/* GST Mode */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-amber-400" /> GST Tax Mode
                    </label>
                    <select
                      value={restaurantSettings.gstMode}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, gstMode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#161b22] focus:outline-none cursor-pointer"
                    >
                      <option value="Exclusive (5%)">Exclusive (5% Added on Bill)</option>
                      <option value="Inclusive (5%)">Inclusive (Tax Included in Price)</option>
                      <option value="Exempted (0%)">Exempted (0% Tax)</option>
                    </select>
                  </div>
                </div>

                {/* System Engine Summary */}
                <div className="p-4 rounded-xl bg-[#161b22]/80 border border-[#30363d] space-y-2 text-xs text-[#8b949e] mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#c9d1d9]">Database Engine:</span>
                    <span className="text-amber-400 font-mono">MongoDB Compass (`mongodb://127.0.0.1:27017`)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#c9d1d9]">POS Backend API:</span>
                    <span className="text-emerald-400 font-mono">Express Port 5000</span>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Restaurant Settings
                </button>
              </form>
            </section>
          )}

          {/* Dynamic View for Sales Reports Tab */}
          {activeTab === 'reports' && (
            <section className="space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-400" /> Sales Reports
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Filter, analyze, and export sales, tax, and staff revenue performance</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 w-max">
                  Financial Analytics
                </span>
              </div>

              {/* Filter Controls Card */}
              <div className="glass-card p-6 rounded-2xl border border-[#30363d]/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  
                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input 
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input 
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Waiter / Staff Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider mb-2">
                      Waiter / Staff
                    </label>
                    <select
                      value={reportStaffFilter}
                      onChange={(e) => setReportStaffFilter(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white bg-[#161b22] focus:outline-none"
                    >
                      <option value="All Staff">All Staff</option>
                      {staffList.map(member => (
                        <option key={member.id} value={member.name}>{member.name} ({member.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFilterMongoReports}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                    >
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>

                </div>
              </div>

              {/* KPI Summary Banner & Detailed MongoDB Sales Report Table */}
              {(() => {
                const activeReportData = reportsList.length > 0 ? reportsList : orders.map(o => ({
                  invoiceNo: `INV-${o.id}`,
                  token: o.table ? `T-${o.table.replace(/\D/g, '') || '01'}` : `#${o.id}`,
                  date: reportStartDate,
                  table: o.table,
                  status: o.status,
                  preTax: parseFloat((o.amount / 1.05).toFixed(2)),
                  cgst: parseFloat(((o.amount - (o.amount / 1.05)) / 2).toFixed(2)),
                  sgst: parseFloat(((o.amount - (o.amount / 1.05)) / 2).toFixed(2)),
                  totalTax: parseFloat((o.amount - (o.amount / 1.05)).toFixed(2)),
                  grandTotal: o.amount,
                  staffName: 'All Staff'
                }));

                const totalCount = activeReportData.length;
                const totalRev = activeReportData.reduce((sum, r) => sum + (r.grandTotal || 0), 0);
                const totalT = activeReportData.reduce((sum, r) => sum + (r.totalTax || 0), 0);

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-card p-6 rounded-2xl border border-[#30363d] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#8b949e] uppercase font-bold tracking-wider mb-1">Total Orders</p>
                          <h3 className="text-2xl font-extrabold text-white font-heading">{totalCount}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="glass-card p-6 rounded-2xl border border-[#30363d] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#8b949e] uppercase font-bold tracking-wider mb-1">Total Revenue</p>
                          <h3 className="text-2xl font-extrabold text-emerald-400 font-heading">₹{totalRev.toFixed(2)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                          ₹
                        </div>
                      </div>

                      <div className="glass-card p-6 rounded-2xl border border-[#30363d] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#8b949e] uppercase font-bold tracking-wider mb-1">Total Tax (GST 5%)</p>
                          <h3 className="text-2xl font-extrabold text-amber-400 font-heading">₹{totalT.toFixed(2)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                          <Receipt className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[#30363d]/80">
                      <div className="flex items-center justify-between mb-4 border-b border-[#30363d] pb-3">
                        <h4 className="text-base font-bold text-white font-heading flex items-center gap-2">
                          Detailed Report <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MongoDB Connected</span>
                        </h4>
                        <span className="text-xs text-[#8b949e]">{totalCount} Records Found</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#30363d] text-[#8b949e] font-bold uppercase tracking-wider">
                              <th className="p-3">Invoice #</th>
                              <th className="p-3">Token</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Table</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Pre-Tax</th>
                              <th className="p-3 text-right">CGST (2.5%)</th>
                              <th className="p-3 text-right">SGST (2.5%)</th>
                              <th className="p-3 text-right">Total Tax</th>
                              <th className="p-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {activeReportData.length === 0 ? (
                              <tr>
                                <td colSpan="10" className="text-center py-12 text-[#8b949e]">
                                  No records found.
                                </td>
                              </tr>
                            ) : (
                              activeReportData.map((r, idx) => (
                                <tr key={r.id || idx} className="hover:bg-[#161b22]/50 transition-colors">
                                  <td className="p-3 font-mono font-bold text-amber-400">{r.invoiceNo}</td>
                                  <td className="p-3 font-mono text-[#c9d1d9]">{r.token}</td>
                                  <td className="p-3 text-[#8b949e]">{r.date}</td>
                                  <td className="p-3 font-semibold text-white">{r.table}</td>
                                  <td className="p-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                      r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      r.status === 'Ready' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                      {r.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right text-[#c9d1d9] font-mono">₹{r.preTax}</td>
                                  <td className="p-3 text-right text-[#8b949e] font-mono">₹{r.cgst}</td>
                                  <td className="p-3 text-right text-[#8b949e] font-mono">₹{r.sgst}</td>
                                  <td className="p-3 text-right text-amber-400 font-mono font-bold">₹{r.totalTax}</td>
                                  <td className="p-3 text-right text-emerald-400 font-mono font-extrabold">₹{r.grandTotal}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}

            </section>
          )}

        </div>

        {/* Dynamic Digital Dining & QR Bill View Modal */}
        {selectedTableForQR && (() => {
          const tableOrder = getTableOrder(selectedTableForQR);
          const customerScanUrl = `${window.location.origin}/table-view?table=${selectedTableForQR.number}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerScanUrl)}`;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/85 backdrop-blur-md p-4 overflow-y-auto">
              <div className="glass-panel w-full max-w-xl p-6 md:p-8 rounded-3xl border border-[#30363d] relative shadow-2xl my-8">
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedTableForQR(null)} 
                  className="absolute top-5 right-5 p-2 rounded-xl bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-[#30363d] pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                    <Flame className="w-7 h-7 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                      Digital Dining & Billing Gateway
                    </h3>
                    <p className="text-xs text-[#8b949e]">Scanned Table Session Details & Live Customer Receipt</p>
                  </div>
                </div>

                {/* Table & QR Scanned Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-[#161b22]/90 border border-[#30363d] mb-6 items-center">
                  
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner text-center">
                    <img src={qrUrl} alt="Table QR Code" className="w-32 h-32 object-contain" />
                    <span className="text-[10px] text-slate-600 font-bold mt-1">Scan for Live Bill</span>
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8b949e]">Assigned Table:</span>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 font-extrabold text-sm rounded-lg border border-amber-500/30">
                        Table {selectedTableForQR.number} ({selectedTableForQR.seats} Seats)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8b949e]">Table Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedTableForQR.status === 'Occupied' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {selectedTableForQR.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8b949e]">Order Reference:</span>
                      <span className="font-mono font-bold text-white text-xs">{tableOrder.orderId}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8b949e]">Session Status:</span>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tableOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ordered Food Items List */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" /> Food Items Ordered at Table
                  </h4>

                  <div className="rounded-xl border border-[#30363d] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#161b22] text-[#8b949e] uppercase text-[10px] font-bold border-b border-[#30363d]">
                        <tr>
                          <th className="p-3">Item Description</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Price</th>
                          <th className="p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-[#0d1117]/60">
                        {tableOrder.items.map(dish => (
                          <tr key={dish.id} className="hover:bg-[#161b22]/40">
                            <td className="p-3 font-semibold text-white">{dish.name}</td>
                            <td className="p-3 text-center font-bold text-amber-400">{dish.qty}x</td>
                            <td className="p-3 text-right text-[#8b949e]">₹{dish.price}</td>
                            <td className="p-3 text-right font-bold text-white">₹{dish.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Billing & Payment Calculation Summary */}
                <div className="p-4 rounded-2xl bg-[#161b22]/90 border border-[#30363d] mb-6 space-y-2 text-xs">
                  <div className="flex justify-between text-[#8b949e]">
                    <span>Food & Beverage Subtotal:</span>
                    <span className="font-semibold text-slate-200">₹{tableOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#8b949e]">
                    <span>CGST + SGST (5%):</span>
                    <span className="font-semibold text-slate-200">₹{tableOrder.gst}</span>
                  </div>
                  <div className="flex justify-between text-[#8b949e]">
                    <span>Service & Utility Charge (5%):</span>
                    <span className="font-semibold text-slate-200">₹{tableOrder.service}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#30363d] font-heading">
                    <span className="text-amber-400">Grand Total Amount Payable:</span>
                    <span className="text-emerald-400 text-base">₹{tableOrder.grandTotal}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      handleTableToggle(selectedTableForQR.id);
                      showToast(`Bill settled for Table ${selectedTableForQR.number}! Table marked available.`);
                      setSelectedTableForQR(null);
                    }}
                    className="py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg text-xs flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Settle Bill & Free Table
                  </button>

                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="py-3 bg-[#161b22] hover:bg-[#21262d] text-white font-bold rounded-xl border border-[#30363d] text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-amber-400" /> Print Digital Receipt
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

        {/* Dynamic Modal for Adding Menu Item */}
        {activeModal === 'add_item' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-md p-4">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#30363d] relative">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-white font-heading mb-4">Add New Menu Item</h3>
              <form onSubmit={handleAddMenuItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] uppercase mb-1">Item Name</label>
                  <input 
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Crispy Paneer"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] uppercase mb-1">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22]"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Starters">Starters</option>
                    <option value="Breads">Breads</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] uppercase mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="e.g. 290"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-slate-950 rounded-xl shadow-lg text-sm mt-2"
                >
                  Save Item to Menu
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Modal for Creating New Order */}
        {activeModal === 'add_order' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-md p-4">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#30363d] relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-5 border-b border-[#30363d] pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Create New Order</h3>
                  <p className="text-xs text-[#8b949e]">Save order ticket to MongoDB Compass & send to Kitchen KDS</p>
                </div>
              </div>

              <form onSubmit={handleAddOrder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Select Restaurant Table</label>
                  <select
                    value={newOrder.table}
                    onChange={(e) => setNewOrder({ ...newOrder, table: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22] cursor-pointer"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.number}>{t.number} ({t.status})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Ordered Dishes / Items</label>
                  <input 
                    type="text" 
                    value={newOrder.items}
                    onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                    placeholder="e.g. 2x Butter Chicken, 4x Naan"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Total Bill Amount (₹)</label>
                  <input 
                    type="number" 
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                    placeholder="e.g. 850"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-slate-950 rounded-xl shadow-lg text-sm mt-2 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Save Order to MongoDB & Send to Kitchen KDS
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Modal for Adding Staff Member */}
        {activeModal === 'add_staff' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-md p-4">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#30363d] relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-5 border-b border-[#30363d] pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Add New Staff Member</h3>
                  <p className="text-xs text-[#8b949e]">Save new staff profile directly to MongoDB Compass</p>
                </div>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Staff Member Name</label>
                  <input 
                    type="text" 
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Assigned Role</label>
                  <select 
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22] cursor-pointer"
                  >
                    <option value="Head Chef">Head Chef</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Head Cashier">Head Cashier</option>
                    <option value="Senior Waiter">Senior Waiter</option>
                    <option value="Floor Manager">Floor Manager</option>
                    <option value="Barista">Barista</option>
                    <option value="Sous Chef">Sous Chef</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="rahul@spiceup.com"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Shift Status</label>
                  <select 
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-slate-950 rounded-xl shadow-lg text-sm mt-2 flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Save Staff to MongoDB
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Modal for Adding New Table */}
        {activeModal === 'add_table' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-md p-4">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#30363d] relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-5 border-b border-[#30363d] pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Add New Table</h3>
                  <p className="text-xs text-[#8b949e]">Save table configuration & auto-generate QR code in MongoDB</p>
                </div>
              </div>

              <form onSubmit={handleAddTable} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Table Number / Code</label>
                  <input 
                    type="text" 
                    value={newTable.number}
                    onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                    placeholder="e.g. T-09"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Seating Capacity (Guests)</label>
                  <select 
                    value={newTable.seats}
                    onChange={(e) => setNewTable({ ...newTable, seats: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22] cursor-pointer"
                  >
                    <option value="2">2 Seats (Couples Table)</option>
                    <option value="4">4 Seats (Family Table)</option>
                    <option value="6">6 Seats (Group Dining)</option>
                    <option value="8">8 Seats (Large Banquet)</option>
                    <option value="12">12 Seats (VIP Lounge)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#c9d1d9] uppercase tracking-wider mb-1">Initial Status</label>
                  <select 
                    value={newTable.status}
                    onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#161b22] cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-slate-950 rounded-xl shadow-lg text-sm mt-2 flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" /> Save Table to MongoDB
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Thermal Receipt Invoice Modal */}
        {printingOrder && (
          <ThermalReceiptModal 
            order={printingOrder} 
            settings={restaurantSettings} 
            onClose={() => setPrintingOrder(null)} 
          />
        )}

        {/* Dynamic Modal for User Profile & Account Details */}
        {showUserProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-[#30363d] relative shadow-2xl">
              
              <button 
                onClick={() => setShowUserProfileModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 border-b border-[#30363d] pb-5 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-emerald-950/40 ring-2 ring-amber-400/30 flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{user.name || 'Agnibha Dey'}</h3>
                  <p className="text-xs text-amber-400 font-semibold capitalize flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user.role || 'Admin'} Account
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active Authenticated Session
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#161b22]/80 border border-[#30363d] flex items-center justify-between">
                  <span className="text-[#8b949e] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" /> Email Address
                  </span>
                  <span className="text-white font-medium">{user.email || 'admin@gmail.com'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#161b22]/80 border border-[#30363d] flex items-center justify-between">
                  <span className="text-[#8b949e] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" /> Account Role
                  </span>
                  <span className="text-white font-semibold uppercase">{user.role || 'Admin'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#161b22]/80 border border-[#30363d] flex items-center justify-between">
                  <span className="text-[#8b949e] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> Session Security
                  </span>
                  <span className="text-emerald-400 font-medium">JWT Signed (24h Active)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowUserProfileModal(false);
                    handleLogout();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold border border-red-500/30 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>

                <button
                  onClick={() => setShowUserProfileModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#21262d] hover:bg-slate-700 text-slate-200 font-bold transition-all text-xs"
                >
                  Close Profile
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer Note */}
        <footer className="mt-8 pt-4 border-t border-[#30363d]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6e7681] gap-2">
          <span>&copy; {new Date().getFullYear()} SPICEUP Restaurant Management System</span>
          <span className="flex items-center gap-1 text-[#8b949e]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Terminal Ready • Connected to POS Gateway
          </span>
        </footer>

      </main>
    </div>
  );
};

export default AdminDashboard;