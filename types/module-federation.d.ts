declare module 'radar/RadarApp' {
  import React from 'react';
  const RadarApp: React.ComponentType;
  export default RadarApp;
}

declare module 'radar/FPSDisplay' {
  import React from 'react';
  const FPSDisplay: React.ComponentType;
  export default FPSDisplay;
}

declare module 'radar/useFPS' {
  const useFPS: () => number;
  export default useFPS;
}

declare module 'offers/OffersApp' {
  import React from 'react';
  const OffersApp: React.ComponentType;
  export default OffersApp;
}

declare module '*/RadarApp' {
  import React from 'react';
  const RadarApp: React.ComponentType;
  export default RadarApp;
}

declare module '*/OffersApp' {
  import React from 'react';
  const OffersApp: React.ComponentType;
  export default OffersApp;
}