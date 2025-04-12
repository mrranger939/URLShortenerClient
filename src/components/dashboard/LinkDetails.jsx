import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const LinkDetails = ({ link, onClose }) => {
  if (!link) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-auto flex justify-center items-start py-10">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Link Analytics</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Link Details</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="mb-2">
                  <span className="font-medium">Original URL: </span>
                  <a 
                    href={link.link.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 break-all"
                  >
                    {link.link.originalUrl}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="font-medium">Short URL: </span>
                  <a 
                    href={link.link.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 break-all"
                  >
                    {link.link.shortUrl}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="font-medium">Created: </span>
                  {new Date(link.link.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Expires: </span>
                  {link.link.expiresAt 
                    ? new Date(link.link.expiresAt).toLocaleString()
                    : 'Never'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">QR Code</h3>
              <div className="bg-gray-50 p-4 rounded flex justify-center">
                <div className="bg-white p-2">
                  <QRCodeCanvas value={link.link.shortUrl} size={150} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Clicks Over Time</h3>
            <div className="bg-gray-50 p-4 rounded" style={{ height: '250px' }}>
              {link.analytics.clicksByDate.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={link.analytics.clicksByDate}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No click data available yet
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Device Breakdown</h3>
              <div className="bg-gray-50 p-4 rounded" style={{ height: '250px' }}>
                {link.analytics.devices.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={link.analytics.devices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="device"
                        label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {link.analytics.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No device data available yet
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Browser Breakdown</h3>
              <div className="bg-gray-50 p-4 rounded" style={{ height: '250px' }}>
                {link.analytics.browsers.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={link.analytics.browsers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="browser"
                        label={({ browser, percent }) => `${browser}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {link.analytics.browsers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No browser data available yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkDetails;