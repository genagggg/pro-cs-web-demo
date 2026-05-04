import React from 'react';
import ReactDOM from 'react-dom/client';

import RadarApp from './RadarApp';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RadarApp />
  </React.StrictMode>
);
