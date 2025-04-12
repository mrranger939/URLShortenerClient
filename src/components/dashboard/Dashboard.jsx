import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LinkCreator from './LinkCreator';
import LinkList from './LinkList';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const linksPerPage = 5;

  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;


  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/links');
      setLinks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load links');
      setLoading(false);
    }
  };

  // search

  const filteredLinks = links.filter(link => 
    link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  pagination

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  // chart data

  const chartData = links.slice(0, 8).map(link => ({
    name: link.shortCode,
    clicks: link.totalClicks
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Link Analytics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Link Performance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Total Links</p>
              <p className="text-xl font-bold">{links.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-xl font-bold">
                {links.reduce((sum, link) => sum + link.totalClicks, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-gray-600">Active Links</p>
              <p className="text-xl font-bold">
                {links.filter(link => !link.isExpired).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-gray-600">Expired Links</p>
              <p className="text-xl font-bold">
                {links.filter(link => link.isExpired).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded shadow">
          <LinkCreator onLinkCreated={fetchLinks} />
        </div>
        
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Links</h2>
            <input
              type="text"
              placeholder="Search links..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <LinkList links={currentLinks} onLinkUpdated={fetchLinks} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  
                  <span className="px-3 py-1 mx-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;