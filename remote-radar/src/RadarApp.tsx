import React from 'react';

import MapComponent from './components/MapComponent';

const RadarApp: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      <MapComponent throttlingInterval={500} />
    </div>
  );
};

export default RadarApp;
