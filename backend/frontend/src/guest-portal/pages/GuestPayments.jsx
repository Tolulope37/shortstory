import { useState, useEffect } from 'react';
import { CreditCard, PlusCircle, Download, Filter, ChevronDown, ChevronUp, Eye, Trash2 } from 'lucide-react';

export default function GuestPayments() {
  const [activeTab, setActiveTab] = useState('paymentMethods');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Mock data fetch
  useEffect(() => {
    setTimeout(() => {
      setPaymentMethods([
        {
          id: 1,
          type: 'visa',
          last4: '4242',
          expiry: '05/26',
          cardHolder: 'Adeola Johnson',
          isDefault: true
        },
        {
          id: 2,
          type: 'mastercard',
          last4: '8901',
          expiry: '11/25',
          cardHolder: 'Adeola Johnson',
          isDefault: false
        }
      ]);
      
      setTransactions([
        {
          id: 1,
          date: '2025-01-10T14:30:00',
          amount: '₦260,000',
          description: 'Booking: Lekki Paradise Villa',
          status: 'Completed',
          paymentMethod: 'Visa ending in 4242',
          receipt: '#INV-2025-001'
        },
        {
          id: 2,
          date: '2024-12-15T09:45:00',
          amount: '₦75,000',
          description: 'Booking: Abuja Executive Home',
          status: 'Completed',
          paymentMethod: 'Mastercard ending in 8901',
          receipt: '#INV-2024-089'
        },
        {
          id: 3,
          date: '2024-11-28T16:20:00',
          amount: '₦45,000',
          description: 'Booking: Ikeja GRA Apartment',
          status: 'Completed',
          paymentMethod: 'Visa ending in 4242',
          receipt: '#INV-2024-076'
        },
        {
          id: 4,
          date: '2024-10-05T11:10:00',
          amount: '₦105,000',
          description: 'Booking: Victoria Island Luxury Suite',
          status: 'Refunded',
          paymentMethod: 'Mastercard ending in 8901',
          receipt: '#INV-2024-054'
        }
      ]);
      
      setIsLoading(false);
    }, 800);
  }, []);

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSubmitCard = (e) => {
    e.preventDefault();
    // In a real app, you'd validate and process the card here
    
    // Add the new card to the list
    const newCard = {
      id: paymentMethods.length + 1,
      type: cardForm.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardForm.cardNumber.slice(-4),
      expiry: cardForm.expiryDate,
      cardHolder: cardForm.cardHolder,
      isDefault: paymentMethods.length === 0 // Make default if it's the first card
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    setShowAddCard(false);
    setCardForm({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortField === 'amount') {
      const aAmount = parseInt(a.amount.replace(/\D/g, ''));
      const bAmount = parseInt(b.amount.replace(/\D/g, ''));
      return sortDirection === 'asc' 
        ? aAmount - bAmount
        : bAmount - aAmount;
    }
    return 0;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500">Manage your payment methods and view transaction history.</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'paymentMethods' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('paymentMethods')}
          >
            Payment Methods
          </button>
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'transactions' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction History
          </button>
        </div>
      </div>
      
      {/* Payment Methods */}
      {activeTab === 'paymentMethods' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Your Payment Methods</h2>
              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusCircle size={16} className="mr-1" />
                <span>Add Payment Method</span>
              </button>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No payment methods</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any payment methods added yet.
                </p>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 mr-4">
                          {method.type === 'visa' ? (
                            <div className="bg-blue-600 h-full w-full rounded text-white flex items-center justify-center text-sm font-bold">VISA</div>
                          ) : (
                            <div className="bg-orange-500 h-full w-full rounded text-white flex items-center justify-center text-sm font-bold">MC</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                            {method.isDefault && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <button 
                            onClick={() => setDefaultPaymentMethod(method.id)}
                            className="text-sm text-gray-600 hover:text-blue-600"
                          >
                            Set as default
                          </button>
                        )}
                        <button 
                          onClick={() => removePaymentMethod(method.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add card form */}
            {showAddCard && (
              <div className="mt-6 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Card</h3>
                <form onSubmit={handleSubmitCard}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardForm.cardHolder}
                        onChange={(e) => setCardForm({...cardForm, cardHolder: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={cardForm.expiryDate}
                          onChange={(e) => setCardForm({...cardForm, expiryDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Transaction History */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
              <div className="flex space-x-2">
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <Filter size={16} className="mr-1" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <Download size={16} className="mr-1" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Download size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No transactions yet</h3>
                <p className="text-gray-500">
                  Your transaction history will appear here once you've made a booking.
                </p>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th 
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            <span>Date</span>
                            {sortField === 'date' && (
                              sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th 
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center">
                            <span>Amount</span>
                            {sortField === 'amount' && (
                              sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            <div>
                              <p>{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {transaction.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 