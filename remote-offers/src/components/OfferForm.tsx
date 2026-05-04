import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

// Схема валидации с Zod
const offerSchema = z.object({
  cargoType: z.string().min(1, 'Выберите тип груза'),
  weight: z.number()
    .positive('Вес должен быть больше 0')
    .min(0.1, 'Минимальный вес 0.1 кг'),
  deliveryDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selectedDate >= tomorrow;
    }, 'Дата должна быть не раньше завтрашнего дня'),
  address: z.string().min(5, 'Адрес должен содержать минимум 5 символов'),
  counterparty: z.string().min(2, 'Введите имя контрагента'),
  requiresSpecialEquipment: z.boolean().optional()
});

type OfferFormData = z.infer<typeof offerSchema>;

const cargoTypes = [
  { value: 'general', label: 'Генеральный груз' },
  { value: 'perishable', label: 'Скоропортящийся груз' },
  { value: 'dangerous', label: 'Опасный груз' },
  { value: 'oversized', label: 'Крупногабаритный груз' },
  { value: 'refrigerated', label: 'Рефрижераторный груз' }
];

const OfferForm: React.FC = () => {
  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      cargoType: '',
      weight: 0,
      deliveryDate: '',
      address: '',
      counterparty: '',
      requiresSpecialEquipment: false
    }
  });

  const weight = watch('weight');
  const showSpecialEquipment = weight > 100;

  const onSubmit = async (data: OfferFormData) => {
    // Имитация задержки отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Заявка успешно создана!\n\nДанные заявки:\n
Тип груза: ${cargoTypes.find(t => t.value === data.cargoType)?.label}
Вес: ${data.weight} кг
Дата доставки: ${new Date(data.deliveryDate).toLocaleDateString('ru-RU')}
Адрес: ${data.address}
Контрагент: ${data.counterparty}
${data.requiresSpecialEquipment ? 'Требуется спецтехника: Да' : ''}`);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        color: '#333', 
        marginBottom: '24px',
        borderBottom: '2px solid #4c6ef5',
        paddingBottom: '10px'
      }}>
        Создание новой заявки
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Тип груза */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="cargoType" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#555'
          }}>
            Тип груза *
          </label>
          <Controller
            name="cargoType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.cargoType ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f9f9f9',
                  transition: 'border-color 0.3s'
                }}
              >
                <option value="">Выберите тип груза</option>
                {cargoTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.cargoType && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.cargoType.message}
            </p>
          )}
        </div>

        {/* Вес */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="weight" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#555'
          }}>
            Вес (кг) *
          </label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                step="0.1"
                min="0.1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.weight ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f9f9f9',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Введите вес груза"
              />
            )}
          />
          {errors.weight && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.weight.message}
            </p>
          )}
        </div>

        {/* Дата доставки */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="deliveryDate" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#555'
          }}>
            Дата доставки *
          </label>
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.deliveryDate ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f9f9f9',
                  transition: 'border-color 0.3s'
                }}
              />
            )}
          />
          {errors.deliveryDate && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.deliveryDate.message}
            </p>
          )}
        </div>

        {/* Адрес */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="address" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#555'
          }}>
            Адрес доставки *
          </label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.address ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f9f9f9',
                  transition: 'border-color 0.3s',
                  resize: 'vertical'
                }}
                placeholder="Введите полный адрес доставки"
              />
            )}
          />
          {errors.address && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Контрагент */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="counterparty" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#555'
          }}>
            Контрагент *
          </label>
          <Controller
            name="counterparty"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.counterparty ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f9f9f9',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Введите имя контрагента"
              />
            )}
          />
          {errors.counterparty && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.counterparty.message}
            </p>
          )}
        </div>

        {/* Условное поле: Спецтехника */}
        {showSpecialEquipment && (
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff8e1',
            border: '1px solid #ffc107',
            borderRadius: '4px'
          }}>
            <Controller
              name="requiresSpecialEquipment"
              control={control}
              render={({ field }) => (
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    style={{ 
                      marginRight: '10px',
                      width: '18px',
                      height: '18px'
                    }}
                  />
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Требуется спецтехника (груз более 100 кг)
                  </span>
                </label>
              )}
            />
          </div>
        )}

        {/* Кнопка отправки */}
        <div style={{ marginTop: '30px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isSubmitting ? '#6c757d' : '#4c6ef5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isSubmitting ? 'Отправка...' : 'Создать заявку'}
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Примечание:</strong> Поля отмеченные * обязательны для заполнения.
      </div>
    </div>
  );
};

export default OfferForm;