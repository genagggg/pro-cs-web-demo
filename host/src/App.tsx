import React, { Suspense, lazy } from 'react';

// Lazy load remote modules
const RadarApp = lazy(() => import('radar/RadarApp'));
const OffersApp = lazy(() => import('offers/OffersApp'));

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h1>Pro CS Web Demo - Enterprise Logistics System</h1>
        <nav style={{ marginTop: '10px' }}>
          <a href="#radar" style={{ marginRight: '15px', textDecoration: 'none', color: '#007acc' }}>Radar</a>
          <a href="#offers" style={{ textDecoration: 'none', color: '#007acc' }}>Offers</a>
        </nav>
      </header>
      
      <main>
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h2>Host Application Content</h2>
          <p>This is the main host application running on port 3000.</p>
          <p>It dynamically loads micro-frontends from remote modules.</p>
        </div>
        
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #4caf50', borderRadius: '5px' }}>
          <h3>Radar Micro-frontend (port 3001)</h3>
          <Suspense fallback={<div>Loading Radar...</div>}>
            <RadarApp />
          </Suspense>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ff9800', borderRadius: '5px' }}>
          <h3>Offers Micro-frontend (port 3002)</h3>
          <Suspense fallback={<div>Loading Offers...</div>}>
            <OffersApp />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;