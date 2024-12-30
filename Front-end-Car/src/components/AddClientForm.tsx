import React, { useState } from 'react';

interface AddClientFormProps {
  onSubmit: (client: { name: string; age: number }) => Promise<void>;
  onClose: () => void;
}

export function AddClientForm({ onSubmit, onClose }: AddClientFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !age) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await onSubmit({ name, age: parseInt(age, 10) });
      onClose();
    } catch (err) {
      setError('Failed to add client');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Form Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Add New Client
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="Enter client name"
          />
        </div>

        {/* Age Field */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="Enter client age"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
          >
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
}
