import { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';

export default function GuestPayments() {
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API calls when guest portal backend is ready
        // const paymentsResponse = await api.get('/guest/payments');
        // const methodsResponse = await api.get('/guest/payment-methods');
        // setPayments(paymentsResponse.data || []);
        // setPaymentMethods(methodsResponse.data || []);
        
        // For now, show empty state
        setPayments([]);
        setPaymentMethods([]);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments([]);
        setPaymentMethods([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">View your payment history and manage payment methods</p>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">No payment methods saved</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Payment Method
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{method.type} •••• {method.last4}</p>
                    <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3 flex items-center justify-center text-4xl font-bold">₦</div>
            <p className="text-gray-600">No payment history</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.propertyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
