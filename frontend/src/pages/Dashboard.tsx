import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PageHeader from '../components/layout/PageHeader';
import Card, { CardBody } from '../components/ui/Card';
import { ShoppingBag, Calendar, Heart, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={`Welcome, ${user?.name}!`}
        subtitle="Here's an overview of your activity"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cart Items</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Orders Placed</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Favorites</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Points Earned</p>
              <p className="text-2xl font-bold text-gray-800">350</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-serif text-xl font-semibold text-gray-800">Recent Orders</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">#12345</td>
                    <td className="px-4 py-3 text-sm text-gray-500">June 1, 2023</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$42.50</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">#12344</td>
                    <td className="px-4 py-3 text-sm text-gray-500">May 26, 2023</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$24.99</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">#12343</td>
                    <td className="px-4 py-3 text-sm text-gray-500">May 20, 2023</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$36.75</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        
        {/* Quick Links */}
        <Card>
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-serif text-xl font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/products" 
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag size={20} className="text-primary-600" />
                    <span className="font-medium">Shop Products</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag size={20} className="text-primary-600" />
                    <span className="font-medium">View Cart</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link 
                  to="/ai-recipe" 
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-primary-600" />
                    <span className="font-medium">AI Recipe Generator</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;