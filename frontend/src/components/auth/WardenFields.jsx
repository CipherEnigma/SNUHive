import React from 'react';

const WardenFields = ({ formData, setFormData }) => {
  return (
    <>
      <input
  type="text"
  required
  pattern="\d{2}"
  maxLength="2"
  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
  placeholder="Warden ID (two digits e.g., 01)"
  value={formData.warden_id}
  onChange={(e) => setFormData({ ...formData, warden_id: e.target.value })}
/>
      <input
        type="text"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Warden Name"
        value={formData.w_name}
        onChange={(e) => setFormData({ ...formData, w_name: e.target.value })}
      />
      <input
        type="tel"
        required
        pattern="[0-9]{10}"
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder="Contact Number (10 digits)"
        value={formData.contact_no}
        onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
      />
    </>
  );
};

export default WardenFields;