import React from 'react';

import OfferForm from './components/OfferForm';

const OffersApp: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: '10px',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Модуль заявок
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            marginBottom: '20px'
          }}>
            Создание и управление заявками на перевозку грузов
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Основная форма */}
          <div>
            <OfferForm />
          </div>

          {/* Боковая панель с информацией */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ 
              color: '#333', 
              marginTop: '0',
              marginBottom: '15px',
              fontSize: '18px',
              borderBottom: '2px solid #4c6ef5',
              paddingBottom: '10px'
            }}>
              Информация
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                color: '#555', 
                marginBottom: '10px',
                fontSize: '16px'
              }}>
                Правила оформления:
              </h4>
              <ul style={{ 
                paddingLeft: '20px', 
                margin: '0',
                fontSize: '14px',
                color: '#666'
              }}>
                <li style={{ marginBottom: '8px' }}>Минимальный вес груза: 0.1 кг</li>
                <li style={{ marginBottom: '8px' }}>Дата доставки не может быть ранее завтрашнего дня</li>
                <li style={{ marginBottom: '8px' }}>Для грузов свыше 100 кг доступна опция &laquo;Спецтехника&raquo;</li>
                <li style={{ marginBottom: '8px' }}>Все поля обязательны для заполнения</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                color: '#555', 
                marginBottom: '10px',
                fontSize: '16px'
              }}>
                Статистика:
              </h4>
              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                padding: '15px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#666' }}>Всего заявок:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>42</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#666' }}>В обработке:</span>
                  <span style={{ fontWeight: '600', color: '#ff9800' }}>12</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#666' }}>Завершено:</span>
                  <span style={{ fontWeight: '600', color: '#4caf50' }}>30</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ 
                color: '#555', 
                marginBottom: '10px',
                fontSize: '16px'
              }}>
                Контакты поддержки:
              </h4>
              <p style={{ 
                fontSize: '14px', 
                color: '#666',
                marginBottom: '5px'
              }}>
                📧 support@logistics.ru
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#666'
              }}>
                📞 +7 (495) 123-45-67
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersApp;