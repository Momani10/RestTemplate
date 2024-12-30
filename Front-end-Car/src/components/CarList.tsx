import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ErrorMessage } from './ErrorMessage';
import { Modal } from './Modal';
import { AddCarForm } from './AddCarForm';
import { Car, Client } from '../types';
import { Car as CarIcon, Plus } from 'lucide-react';

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchCars(), fetchClients()]).finally(() => setLoading(false));
  }, []);

  const fetchCars = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8082/voitures');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCars(data);
    } catch (error) {
      setError('Unable to connect to the car service. Please ensure the service is running at http://localhost:8082');
      console.error('Error fetching cars:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8888/CLIENT-SERVICE/clients');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddCar = async (carData: { brand: string; model: string; matricule: string; clientId: number }) => {
    const response = await fetch('http://localhost:8082/voiture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    if (!response.ok) {
      throw new Error('Failed to add car');
    }

    fetchCars();
  };

  const filteredCars = cars.filter(car =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Owner';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CarIcon className="h-7 w-7 text-purple-700" />
          <h2 className="text-3xl font-bold text-purple-800">Car Management</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-3 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all shadow-md"
        >
          <Plus className="h-6 w-6" />
          Add Car
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search cars..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map(car => (
            <div
              key={car.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <CarIcon className="h-6 w-6 text-purple-700" />
                <h3 className="text-xl font-semibold text-gray-800">{car.brand} {car.model}</h3>
              </div>
              <p className="text-sm text-gray-600">Matricule: {car.matricule}</p>
              <p className="text-sm text-gray-600">Owner: {getClientName(car.clientId)}</p>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-md hover:from-purple-600 hover:to-purple-800 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Car"
      >
        <AddCarForm
          clients={clients}
          onSubmit={handleAddCar}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
