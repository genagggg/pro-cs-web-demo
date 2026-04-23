import React from 'react';

const OffersApp: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff3e0',
      borderRadius: '8px',

      border: '2px solid #ff9800'
    }}>
      <h2 style={{ color: '#ef6c00', marginTop: '0' }}>Offers Module</h2>
      <p style={{ fontSize: '16px', marginBottom: '15px' }}>
        This is the offers micro-frontend running on port 3002.
      </p>
      <div style={{
        backgroundColor: '#fff8e1',
        border: '1px dashed #ff9800',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px'
      }}>
        <h3 style={{ marginTop: '0', color: '#f57c00' }}>Create New Offer</h3>
        <form>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Client Name:</label>
            <input 
              type="text" 
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter client name"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Type:</label>
            <select 
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            >
              <option value="express">Express Delivery</option>
              <option value="standard">Standard Delivery</option>
              <option value="bulk">Bulk Transport</option>
              <option value="refrigerated">Refrigerated Transport</option>
            </select>
          </div>
          <button 
            type="button" 
            style={{
              backgroundColor: '#ff9800',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Create Offer
          </button>
        </form>
      </div>
      <div>
        <h3 style={{ color: '#f57c00' }}>Features:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Dynamic pricing calculation</li>
          <li>Contract management</li>
          <li>Client portal integration</li>
          <li>Automated quote generation</li>
        </ul>
      </div>
    </div>
  );
};

export default OffersApp;