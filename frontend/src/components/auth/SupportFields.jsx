import React from 'react';
import PropTypes from 'prop-types';

const departments = [
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Pest-control', label: 'Pest Control' },
  { value: 'Housekeeping', label: 'Housekeeping' },
  { value: 'IT', label: 'IT' }
];

const SupportFields = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-2">
      <select
        name="D_Name"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        value={formData.D_Name}
        onChange={handleChange}
      >
        <option value="">Select Department</option>
        {departments.map(dept => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))}
      </select>
      <input
        name="staff_capacity"
        type="number"
        required
        min="1"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Staff Capacity"
        value={formData.staff_capacity}
        onChange={handleChange}
      />
      <input
        name="warden_id"
        type="text"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Warden ID (Optional)"
        value={formData.warden_id}
        onChange={handleChange}
      />
    </div>
  );
};

SupportFields.propTypes = {
  formData: PropTypes.shape({
    D_Name: PropTypes.string.isRequired,
    staff_capacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    warden_id: PropTypes.string
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};

export default SupportFields;