import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ErrorMessage } from './ErrorMessage';
import { Modal } from './Modal';
import { AddClientForm } from './AddClientForm';
import { Client } from '../types';
import { Users, UserPlus } from 'lucide-react';

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8888/CLIENT-SERVICE/clients');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError('Unable to connect to the client service. Please ensure the service is running at http://localhost:8888');
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: { name: string; age: number }) => {
    const response = await fetch('http://localhost:8888/CLIENT-SERVICE/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error('Failed to add client');
    }

    fetchClients();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-purple-700" />
          <h2 className="text-3xl font-bold text-purple-800">Client Management</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-3 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all shadow-md"
        >
          <UserPlus className="h-6 w-6" />
          Add Client
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search clients..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="mt-8">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <div
                key={client.id}
                className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">Age: {client.age}</p>
                </div>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No clients found</p>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
      >
        <AddClientForm
          onSubmit={handleAddClient}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
