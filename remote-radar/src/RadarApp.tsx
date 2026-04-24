import React from 'react';
import MapComponent from './components/MapComponent';

const RadarApp: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapComponent throttlingInterval={500} />
    </div>
  );
};

export default RadarApp;