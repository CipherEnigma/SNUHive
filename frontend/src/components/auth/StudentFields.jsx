import React from 'react';
import PropTypes from 'prop-types';

const departments = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'Mechanical', label: 'Mechanical Engineering' },
  { value: 'Chemical', label: 'Chemical Engineering' },
  { value: 'Economics', label: 'Economics' }
];

const hostels = [
  { value: '1A', label: '1A' },
  { value: '1B', label: '1B' },
  { value: '2A', label: '2A' },
  { value: '2B', label: '2B' }
];

const StudentFields = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-2">
      <input
        name="roll_no"
        type="text"
        required
        pattern="[0-9]+"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Roll Number"
        value={formData.roll_no}
        onChange={handleChange}
      />
      <input
        name="s_name"
        type="text"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Full Name"
        value={formData.s_name}
        onChange={handleChange}
      />
      <select
        name="dept"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        value={formData.dept}
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
        name="batch"
        type="number"
        required
        min="2020"
        max="2030"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Batch Year (e.g., 2023)"
        value={formData.batch}
        onChange={handleChange}
      />
      <input
        name="contact_no"
        type="tel"
        required
        pattern="[0-9]{10}"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Contact Number (10 digits)"
        value={formData.contact_no}
        onChange={handleChange}
      />
      <input
        name="snu_email_id"
        type="email"
        required
        pattern=".+@snu\.edu\.in"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="SNU Email ID (@snu.edu.in)"
        value={formData.snu_email_id}
        onChange={handleChange}
      />
      <select
        name="hostel_id"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        value={formData.hostel_id}
        onChange={handleChange}
      >
        <option value="">Select Hostel</option>
        {hostels.map(hostel => (
          <option key={hostel.value} value={hostel.value}>
            {hostel.label}
          </option>
        ))}
      </select>
      <input
        name="room_no"
        type="text"
        required
        pattern="[0-9]{3}[A-Z]"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Room Number (e.g., 201B)"
        value={formData.room_no}
        onChange={handleChange}
      />
      <input
        name="parent_contact"
        type="tel"
        required
        pattern="[0-9]{10}"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Parent Contact Number (10 digits)"
        value={formData.parent_contact}
        onChange={handleChange}
      />
    </div>
  );
};

StudentFields.propTypes = {
  formData: PropTypes.shape({
    roll_no: PropTypes.string.isRequired,
    s_name: PropTypes.string.isRequired,
    dept: PropTypes.string.isRequired,
    batch: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    contact_no: PropTypes.string.isRequired,
    snu_email_id: PropTypes.string.isRequired,
    hostel_id: PropTypes.string.isRequired,
    room_no: PropTypes.string.isRequired,
    parent_contact: PropTypes.string.isRequired
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};

export default StudentFields;