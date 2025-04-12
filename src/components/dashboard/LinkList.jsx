import { useState } from 'react';
import axios from 'axios';
import LinkDetails from './LinkDetails';
import React from 'react';

const LinkList = ({ links, onLinkUpdated }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const openLinkDetails = async (linkId) => {
    try {
      const response = await axios.get(`/api/links/${linkId}/analytics`);
      setSelectedLink(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to fetch link details', err);
    }
  };
  
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedLink(null);
  };
  
  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div>
      {links.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No links created yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id}>
                  <td className="px-4 py-3 text-sm">
                    <div className="truncate max-w-xs" title={link.originalUrl}>
                      {link.originalUrl}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <a 
                        href={link.shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 mr-2"
                      >
                        {link.shortCode}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {link.totalClicks}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {link.isExpired ? (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Expired</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openLinkDetails(link.id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Analytics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Link Details Modal */}
      
      {showDetailsModal && selectedLink && (
        <LinkDetails link={selectedLink} onClose={closeModal} />
      )}
    </div>
  );
};

export default LinkList;