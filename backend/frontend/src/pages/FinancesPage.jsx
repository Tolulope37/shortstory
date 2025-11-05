import { useState, useEffect } from 'react';
import { 
  Coins, Calendar, TrendingUp, TrendingDown, PieChart, 
  BarChart, Filter, Home, ArrowUpRight, Download, ChevronDown, 
  LineChart, BanknoteIcon, Receipt, Clock, X
} from 'lucide-react';
import { bookingService, propertyService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import '../styles/FinancesPage.css';

export default function FinancesPage() {
  // State for data management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financeSummary, setFinanceSummary] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    totalExpenses: 0,
    netProfit: 0,
    occupancyRate: 0,
    averageDailyRate: 0
  });

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // State for filtering
  const [dateRange, setDateRange] = useState('month'); // Options: month, quarter, year, custom
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // State for view controls
  const [activeTab, setActiveTab] = useState('overview'); // overview, revenue, expenses, reports
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);

  // Add new state for transactions modal
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);
  
  // Transactions from API
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    fetchFinancialData();
  }, [dateRange, startDate, endDate]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBookings(),
        fetchProperties(),
        fetchExpenses(),
        fetchPayments()
      ]);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch financial data. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(data || []);
      calculateFinancialSummary(data || [], expenses);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Don't show error - just show empty state for new users
      setBookings([]);
      setError(null);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getAll();
      setProperties(response.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]); // NO MOCK DATA
    }
  };

  const fetchExpenses = async () => {
    try {
      setExpenses([]);
      calculateFinancialSummary(bookings, []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      setPayments([]);
    } catch (err) {
      console.error('Error fetching payments:', err);
      // Don't show error - just show empty state for new users
      setError(null);
    }
  };

  const calculateFinancialSummary = (bookingsData, expensesData) => {
    if (!bookingsData.length) return;
    
    // Calculate total revenue (only from confirmed and not refunded bookings)
    const validBookings = bookingsData.filter(
      b => b.status === "Confirmed" && b.paymentStatus !== "Refunded"
    );
    
    const totalRevenue = validBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0), 0
    );
    
    // Calculate pending payments
    const pendingPayments = bookingsData
      .filter(b => b.paymentStatus === "Unpaid" || b.paymentStatus === "Partial")
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Calculate total expenses
    const totalExpenses = expensesData.reduce(
      (sum, expense) => sum + (expense.amount || 0), 0
    );
    
    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;
    
    // Calculate occupancy rate (simplified)
    const occupancyRate = validBookings.length > 0 && properties.length > 0
      ? (validBookings.length / (properties.length * 30)) * 100 
      : 0;
    
    // Calculate average daily rate
    const totalDays = validBookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    
    const averageDailyRate = totalDays > 0 
      ? totalRevenue / totalDays 
      : 0;
    
    setFinanceSummary({
      totalRevenue,
      pendingPayments,
      totalExpenses,
      netProfit,
      occupancyRate,
      averageDailyRate
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading financial data...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finances</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                  const today = new Date();
                  setDateRange('month');
                  setStartDate(firstDay.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                  // Trigger data fetch after updating state
                  setTimeout(fetchFinancialData, 0);
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${dateRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                This Month
              </button>
              <button 
                onClick={() => {
                  const now = new Date();
                  const quarter = Math.floor(now.getMonth() / 3);
                  const firstDayOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
                  setDateRange('quarter');
                  setStartDate(firstDayOfQuarter.toISOString().split('T')[0]);
                  setEndDate(now.toISOString().split('T')[0]);
                  // Trigger data fetch after updating state
                  setTimeout(fetchFinancialData, 0);
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${dateRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                This Quarter
              </button>
              <button 
                onClick={() => {
                  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
                  const today = new Date();
                  setDateRange('year');
                  setStartDate(firstDayOfYear.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                  // Trigger data fetch after updating state
                  setTimeout(fetchFinancialData, 0);
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${dateRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                This Year
              </button>
              <button 
                onClick={() => {
                  setDateRange('custom');
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${dateRange === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Custom
              </button>
            </div>
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
              <button 
                onClick={() => {
                  fetchFinancialData();
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
          
          <button 
            onClick={() => {
              alert('This would generate and download a financial report in the real app');
            }}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 flex items-center gap-1 hover:bg-gray-50 transition-colors"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(financeSummary.totalRevenue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                {formatCurrency(financeSummary.pendingPayments)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock size={18} className="text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500">
              From {bookings.filter(b => b.paymentStatus === "Unpaid" || b.paymentStatus === "Partial").length} bookings
            </span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(financeSummary.totalExpenses)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown size={18} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(financeSummary.netProfit)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">₦</span>
            </div>
          </div>
        </div>

        {/* Occupancy Rate Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {!isNaN(financeSummary.occupancyRate) && isFinite(financeSummary.occupancyRate) 
                  ? financeSummary.occupancyRate.toFixed(1) + '%'
                  : '0%'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <PieChart size={18} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Average Daily Rate Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Daily Rate</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                {formatCurrency(financeSummary.averageDailyRate)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <BarChart size={18} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button 
          onClick={() => {
            setActiveTab('payments');
            // Show a modal or form to record a payment
            alert('This would open a payment recording form in the real app');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <BanknoteIcon size={16} className="mr-2" />
          Record Payment
        </button>
        <button 
          onClick={() => {
            setActiveTab('expenses');
            // Show a modal or form to record an expense
            alert('This would open an expense recording form in the real app');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="16" x2="16" y2="16" />
          </svg>
          Record Expense
        </button>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'revenue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'properties'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Property Performance
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reports
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          {/* Revenue vs Expenses Chart Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Revenue vs Expenses</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">Monthly</button>
                <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">Quarterly</button>
                <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">Yearly</button>
              </div>
            </div>
            
            {/* Placeholder for chart - in a real app would use recharts or other charting library */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Revenue vs Expenses Chart</p>
                <p className="text-xs text-gray-400 mt-1">This would be an actual chart in production</p>
              </div>
            </div>
          </div>
          
          {/* Two Column Layout for Additional Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
                <button 
                  onClick={() => setShowRevenueBreakdown(!showRevenueBreakdown)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  {showRevenueBreakdown ? 'Hide Details' : 'Show Details'}
                  <ChevronDown size={16} className={`ml-1 transform ${showRevenueBreakdown ? 'rotate-180' : ''} transition-transform`} />
                </button>
              </div>
              
              {/* Placeholder for pie chart */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <PieChart size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Revenue Sources</p>
                </div>
              </div>
              
              {showRevenueBreakdown && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-500">No revenue breakdown available</p>
                </div>
              )}
            </div>
            
            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Expense Breakdown</h3>
                <button 
                  onClick={() => setShowExpenseBreakdown(!showExpenseBreakdown)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  {showExpenseBreakdown ? 'Hide Details' : 'Show Details'}
                  <ChevronDown size={16} className={`ml-1 transform ${showExpenseBreakdown ? 'rotate-180' : ''} transition-transform`} />
                </button>
              </div>
              
              {/* Placeholder for pie chart */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <PieChart size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Expense Categories</p>
                </div>
              </div>
              
              {showExpenseBreakdown && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-500">No expense breakdown available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Most Profitable Properties */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Most Profitable Properties</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupancy
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties
                    .sort((a, b) => b.profit - a.profit)
                    .map(property => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                              <Home size={18} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{property.name}</div>
                              <div className="text-xs text-gray-500">{property.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(property.totalRevenue)}</div>
                          <div className="text-xs text-gray-500">{property.totalBookings} bookings</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(property.expenses)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">{formatCurrency(property.profit)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{Math.round((property.profit / property.totalRevenue) * 100)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${property.occupancyRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{property.occupancyRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Monthly Booking Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Booking Trends</h3>
            
            {/* Placeholder for bar chart */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Monthly Booking Trends</p>
                <p className="text-xs text-gray-400 mt-1">This would show bookings by month</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <button 
                onClick={() => setShowAllTransactionsModal(true)} 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Show first 3 transactions */}
              {transactions.slice(0, 3).map(transaction => (
                <div key={transaction.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full ${transaction.isIncome ? 'bg-blue-100' : 'bg-red-100'} flex items-center justify-center mr-4`}>
                    {transaction.isIncome ? (
                      <Coins size={18} className="text-blue-600" />
                    ) : (
                      <Coins size={18} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.details}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.isIncome ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab Content */}
      {activeTab === 'revenue' && (
        <div className="revenue-tab">
          {/* Revenue Recording Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Record New Revenue</h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Source</option>
                  <option value="Direct">Direct Booking</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Expedia">Expedia</option>
                  <option value="VRBO">VRBO</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                <input type="number" placeholder="0.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                <input type="text" placeholder="Enter guest name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Platform Payment">Platform Payment</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows="2" placeholder="Enter revenue details..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Receipt/Invoice</label>
                <div className="flex items-center space-x-2">
                  <input type="file" className="hidden" id="revenueReceiptUpload" />
                  <label htmlFor="revenueReceiptUpload" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Upload Receipt
                  </label>
                  <span className="text-xs text-gray-500">No file selected</span>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Record Revenue
                </button>
              </div>
            </form>
          </div>
          
          {/* Revenue Analytics */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue by Source Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue by Source</h4>
                {/* Placeholder for pie chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-gray-400 mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      <path d="M12 2v20"></path>
                    </svg>
                    <p className="text-xs text-gray-400">Revenue sources breakdown chart</p>
                  </div>
                </div>
                
                {/* Top Sources */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">No revenue data available</p>
                </div>
              </div>
              
              {/* Monthly Revenue Trend */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Revenue Trend</h4>
                {/* Placeholder for line chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-gray-400 mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18"></path>
                      <path d="M3 12h18"></path>
                      <path d="M3 6h18"></path>
                      <path d="M3 18h18"></path>
                      <path d="M16 3l-4 4"></path>
                      <path d="M14 7h6v-6"></path>
                    </svg>
                    <p className="text-xs text-gray-400">Monthly revenue trend line chart</p>
                  </div>
                </div>
                
                {/* Monthly Summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">No revenue data available</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Records Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Revenue Records</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search revenue..."
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option value="">All Sources</option>
                  <option value="Direct">Direct Booking</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Other">Other</option>
                </select>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.property}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.guest}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.platformSource}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">{formatCurrency(booking.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab Content */}
      {activeTab === 'expenses' && (
        <div className="expenses-tab">
          {/* Expenses Recording Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Record New Expense</h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Staff">Staff</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Taxes">Taxes</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                <input type="number" placeholder="0.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vendor/Payee</label>
                <input type="text" placeholder="Enter vendor name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows="2" placeholder="Enter expense details..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Receipt</label>
                <div className="flex items-center space-x-2">
                  <input type="file" className="hidden" id="expenseReceiptUpload" />
                  <label htmlFor="expenseReceiptUpload" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Upload Receipt
                  </label>
                  <span className="text-xs text-gray-500">No file selected</span>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Record Expense
                </button>
              </div>
            </form>
          </div>
          
          {/* Expense Records Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Expense Records</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option value="">All Categories</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expense.property}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expense.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 font-medium">{formatCurrency(expense.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab Content */}
      {activeTab === 'payments' && (
        <div className="payments-tab">
          {/* Payment Recording Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Record New Payment</h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Booking</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Booking</option>
                  {bookings.map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guestName} - {booking.propertyName} ({new Date(booking.checkIn).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Type</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Balance">Balance</option>
                  <option value="Extra Services">Extra Services</option>
                  <option value="Late Checkout">Late Checkout</option>
                  <option value="Damage Fee">Damage Fee</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date Received</label>
                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                <input type="number" placeholder="0.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Booking Platform">Booking Platform</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea rows="2" placeholder="Enter payment details..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Receipt</label>
                <div className="flex items-center space-x-2">
                  <input type="file" className="hidden" id="paymentReceiptUpload" />
                  <label htmlFor="paymentReceiptUpload" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Upload Receipt
                  </label>
                  <span className="text-xs text-gray-500">No file selected</span>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
          
          {/* Payment Records Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Records</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option value="">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No payment records found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.guest}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.property}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">{formatCurrency(payment.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.method}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Property Performance Tab Content */}
      {activeTab === 'properties' && (
        <div className="properties-tab">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Property Financial Performance</h3>
              <div className="flex space-x-2">
                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option value="">All Properties</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </select>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Export Report
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
                <h4 className="text-2xl font-bold text-blue-800">{formatCurrency(financeSummary.totalRevenue)}</h4>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Average Daily Rate</p>
                <h4 className="text-2xl font-bold text-green-800">{formatCurrency(financeSummary.averageDailyRate)}</h4>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Occupancy Rate</p>
                <h4 className="text-2xl font-bold text-purple-800">
                  {!isNaN(financeSummary.occupancyRate) && isFinite(financeSummary.occupancyRate) 
                    ? financeSummary.occupancyRate.toFixed(1) + '%'
                    : '0%'}
                </h4>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 mb-1">Net Profit Margin</p>
                <h4 className="text-2xl font-bold text-orange-800">
                  {financeSummary.totalRevenue > 0 
                    ? ((financeSummary.netProfit / financeSummary.totalRevenue) * 100).toFixed(1) + '%'
                    : '0%'}
                </h4>
              </div>
            </div>

            {/* Revenue by Property Chart */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Revenue by Property</h4>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Revenue by Property Chart</p>
                  <p className="text-xs text-gray-400 mt-1">This would be an actual chart in production</p>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Properties Breakdown</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Occupancy
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expenses
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map(property => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">{property.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{property.totalBookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{property.occupancyRate}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${property.occupancyRate}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(property.totalRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(property.expenses)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600">{formatCurrency(property.profit)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{Math.round((property.profit / property.expenses) * 100)}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab Content */}
      {activeTab === 'reports' && (
        <div className="reports-tab">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Financial Reports</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center">
                  <Download size={14} className="mr-1" />
                  Export All Reports
                </button>
              </div>
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Income Statement Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Income Statement</h4>
                    <p className="text-xs text-gray-500 mt-1">Revenue, expenses, and profit analysis</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <LineChart size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: Yesterday</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>

              {/* Cash Flow Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Cash Flow</h4>
                    <p className="text-xs text-gray-500 mt-1">Cash inflows and outflows over time</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: 2 days ago</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>

              {/* Property ROI Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Property ROI</h4>
                    <p className="text-xs text-gray-500 mt-1">Return on investment per property</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Home size={20} className="text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: 1 week ago</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>

              {/* Booking Revenue Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Booking Revenue</h4>
                    <p className="text-xs text-gray-500 mt-1">Revenue breakdown by booking source</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <PieChart size={20} className="text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: 3 days ago</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>

              {/* Expense Analysis Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Expense Analysis</h4>
                    <p className="text-xs text-gray-500 mt-1">Detailed breakdown of all expenses</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <BarChart size={20} className="text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: 5 days ago</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>

              {/* Tax Summary Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-800">Tax Summary</h4>
                    <p className="text-xs text-gray-500 mt-1">Tax obligations and summary</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Receipt size={20} className="text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last generated: 2 weeks ago</span>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Report Builder */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Custom Report Builder</h4>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Report Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select Report Type</option>
                    <option value="income">Income Statement</option>
                    <option value="cashflow">Cash Flow</option>
                    <option value="property-performance">Property Performance</option>
                    <option value="booking-analysis">Booking Analysis</option>
                    <option value="expense-breakdown">Expense Breakdown</option>
                    <option value="tax-summary">Tax Summary</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date Range</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="this-quarter">This Quarter</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="this-year">This Year</option>
                    <option value="last-year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Format</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                
                <div className="md:col-span-3 flex justify-end">
                  <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Generate Custom Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* All Transactions Modal */}
      {showAllTransactionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
              <button 
                onClick={() => setShowAllTransactionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-12 h-12 rounded-full ${transaction.isIncome ? 'bg-blue-100' : 'bg-red-100'} flex items-center justify-center mr-4`}>
                      {transaction.isIncome ? (
                        <Coins size={20} className="text-blue-600" />
                      ) : (
                        <Coins size={20} className="text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.details}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-medium ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.isIncome ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowAllTransactionsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 