import React from 'react';

const RadarApp: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#e8f5e9',
      borderRadius: '8px',
      border: '2px solid #4caf50'
    }}>
      <h2 style={{ color: '#2e7d32', marginTop: '0' }}>Radar Module</h2>
      <p style={{ fontSize: '16px', marginBottom: '15px' }}>
        This is the radar micro-frontend running on port 3001.
      </p>
      <div style={{
        height: '200px',
        backgroundColor: '#f1f8e9',
        border: '1px dashed #4caf50',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#388e3c',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        🗺️ Radar Map Works! (Interactive map component would go here)
      </div>
      <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
        <li>Real-time vehicle tracking</li>
        <li>Route optimization</li>
        <li>Geofencing alerts</li>
        <li>Traffic analysis</li>
      </ul>
    </div>
  );
};

export default RadarApp;