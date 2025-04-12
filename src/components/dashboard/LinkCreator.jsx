import { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';

const LinkCreator = ({ onLinkCreated }) => {
  const [linkData, setLinkData] = useState({
    originalUrl: '',
    customAlias: '',
    expirationDays: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newLink, setNewLink] = useState(null);
  
  const handleChange = (e) => {
    setLinkData({ ...linkData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/links', linkData);
      setNewLink(response.data);
      setLinkData({ originalUrl: '', customAlias: '', expirationDays: '' });
      onLinkCreated();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create link');
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Create Short Link</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="originalUrl">
            Original URL*
          </label>
          <input
            id="originalUrl"
            type="url"
            name="originalUrl"
            className="w-full p-2 border rounded"
            value={linkData.originalUrl}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="customAlias">
            Custom Alias (optional)
          </label>
          <input
            id="customAlias"
            type="text"
            name="customAlias"
            className="w-full p-2 border rounded"
            value={linkData.customAlias}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="expirationDays">
            Expires in (days, optional)
          </label>
          <input
            id="expirationDays"
            type="number"
            name="expirationDays"
            min="1"
            className="w-full p-2 border rounded"
            value={linkData.expirationDays}
            onChange={handleChange}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
      </form>
      
      {newLink && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <h3 className="font-semibold text-green-800 mb-2">Link Created!</h3>
          <p className="mb-2">
            <span className="font-medium">Short URL: </span>
            <a 
              href={newLink.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 break-all"
            >
              {newLink.shortUrl}
            </a>
          </p>
          
          <div className="mt-4">
            <p className="font-medium mb-2">QR Code:</p>
            <div className="bg-white p-2 inline-block">
                <QRCodeCanvas value={newLink.shortUrl} size={128} />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkCreator;