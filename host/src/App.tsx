import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

import RoutesTable from './components/RoutesTable';
import {
  PrivilegesProvider,
  usePrivileges,
  PRIVILEGES,
  ROLES,
  ProtectedContent,
} from './contexts/PrivilegesContext';
import './styles.css';

const RadarApp = lazy(() => import('radar/RadarApp'));
const OffersApp = lazy(() => import('offers/OffersApp'));

const useLocalFPS = (): number => {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = (now: number) => {
      framesRef.current++;
      const delta = now - lastTimeRef.current;
      if (delta >= 1000) {
        const currentFps = Math.round((framesRef.current * 1000) / delta);
        setFps(currentFps);
        framesRef.current = 0;
        lastTimeRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return fps;
};

const LocalFPSDisplay: React.FC = () => {
  const fps = useLocalFPS();
  const getColor = () => {
    if (fps >= 50) return '#4caf50';
    if (fps >= 30) return '#ff9800';
    return '#f44336';
  };
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: 6,
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 1.4,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ color: getColor(), fontWeight: 700 }}>{fps}</span> FPS
    </div>
  );
};

// Компонент переключателя ролей
const RoleSwitcher: React.FC = () => {
  const { role, setRole } = usePrivileges();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#fff',
        padding: '8px 12px',
        borderRadius: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Роль:</span>
      <div style={{ display: 'flex', gap: '5px' }}>
        {Object.values(ROLES).map((roleOption) => (
          <button
            key={roleOption}
            onClick={() => setRole(roleOption)}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '15px',
              backgroundColor: role === roleOption ? '#4c6ef5' : '#f0f0f0',
              color: role === roleOption ? 'white' : '#666',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {roleOption === 'admin' ? 'Админ' : 'Логист'}
          </button>
        ))}
      </div>
    </div>
  );
};

// Компонент вкладок
const NavigationTabs: React.FC = () => {
  const { hasPrivilege } = usePrivileges();
  const [activeTab, setActiveTab] = useState('radar');

  const tabs = [
    { id: 'radar', label: 'Радар', privilege: PRIVILEGES.RADAR },
    { id: 'offers', label: 'Заявки', privilege: PRIVILEGES.OFFERS },
    { id: 'routes', label: 'Маршруты', privilege: PRIVILEGES.ROUTES },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '20px',
        }}
      >
        {tabs.map((tab) => {
          if (!hasPrivilege(tab.privilege)) return null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#4c6ef5' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderRadius: '8px 8px 0 0',
                marginRight: '5px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Контент вкладок */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'radar' && (
          <div style={{ marginBottom: '30px' }}>
            <ProtectedContent privilege={PRIVILEGES.RADAR}>
              <Suspense
                fallback={
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    Загрузка радара...
                  </div>
                }
              >
                <RadarApp />
              </Suspense>
            </ProtectedContent>
          </div>
        )}

        {activeTab === 'offers' && (
          <div style={{ marginBottom: '30px' }}>
            <ProtectedContent privilege={PRIVILEGES.OFFERS}>
              <Suspense
                fallback={
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    Загрузка модуля заявок...
                  </div>
                }
              >
                <OffersApp />
              </Suspense>
            </ProtectedContent>
          </div>
        )}

        {activeTab === 'routes' && (
          <ProtectedContent privilege={PRIVILEGES.ROUTES}>
            <RoutesTable />
          </ProtectedContent>
        )}
      </div>
    </>
  );
};

// Основное приложение
const AppContent: React.FC = () => {
  const { role, privileges } = usePrivileges();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                color: '#333',
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              Enterprise Logistics System
            </h1>
            <p
              style={{
                color: '#666',
                margin: '5px 0 0 0',
                fontSize: '14px',
              }}
            >
              Управление логистикой и мониторинг грузов
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px',
                }}
              >
                Текущая роль: <strong>{role === 'admin' ? 'Администратор' : 'Логист'}</strong>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#888',
                  backgroundColor: '#f0f0f0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                Доступные привилегии: {privileges.length}
              </div>
            </div>
            <RoleSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
            marginBottom: '30px',
            overflow: 'visible',
          }}
        >
          <h2
            style={{
              color: '#333',
              marginBottom: '25px',
              fontSize: '20px',
              fontWeight: '600',
              borderBottom: '3px solid #4c6ef5',
              paddingBottom: '10px',
            }}
          >
            Панель управления
          </h2>

          <NavigationTabs />
        </div>

        {/* Информационная панель */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3
            style={{
              color: '#555',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Информация о системе
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            <div
              style={{
                backgroundColor: '#e8f5e9',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '5px' }}>
                Модуль &laquo;Радар&raquo;
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
                Активные грузы: 20
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#e3f2fd',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#1565c0', marginBottom: '5px' }}>
                Модуль &laquo;Заявки&raquo;
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
                Заявок в работе: 12
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f3e5f5',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#7b1fa2', marginBottom: '5px' }}>
                Модуль &laquo;Маршруты&raquo;
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
                Активных маршрутов: 5
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '20px',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          <p style={{ margin: 0 }}>© 2024 Enterprise Logistics System. Все права защищены.</p>
          <p style={{ margin: '10px 0 0 0', color: '#aaa', fontSize: '12px' }}>
            Версия 1.0.0 | Микро-frontend архитектура | Webpack Module Federation
          </p>
        </div>
      </footer>
    </div>
  );
};

// Обёртка с провайдером привилегий
const App: React.FC = () => {
  return (
    <PrivilegesProvider>
      <AppContent />
      <LocalFPSDisplay />
    </PrivilegesProvider>
  );
};

export default App;
