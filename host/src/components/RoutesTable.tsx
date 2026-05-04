/* eslint-disable jsx-a11y/no-autofocus, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState, useMemo } from 'react';

// Типы данных
export interface Route {
  id: string;
  route: string;
  date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  cargoCount: number;
  driver: string;
}

// Мок-данные
const initialRoutes: Route[] = [
  {
    id: '1',
    route: 'Москва → Санкт-Петербург',
    date: '2024-04-25',
    status: 'planned',
    cargoCount: 8,
    driver: 'Иванов И.И.',
  },
  {
    id: '2',
    route: 'Казань → Нижний Новгород',
    date: '2024-04-26',
    status: 'in_progress',
    cargoCount: 5,
    driver: 'Петров П.П.',
  },
  {
    id: '3',
    route: 'Екатеринбург → Челябинск',
    date: '2024-04-24',
    status: 'completed',
    cargoCount: 12,
    driver: 'Сидоров С.С.',
  },
  {
    id: '4',
    route: 'Ростов-на-Дону → Краснодар',
    date: '2024-04-27',
    status: 'planned',
    cargoCount: 6,
    driver: 'Кузнецов К.К.',
  },
  {
    id: '5',
    route: 'Новосибирск → Омск',
    date: '2024-04-28',
    status: 'in_progress',
    cargoCount: 9,
    driver: 'Смирнов С.С.',
  },
];

// Статусы для селекта
const statusOptions = [
  { value: 'planned', label: 'Запланирован', color: '#ff9800' },
  { value: 'in_progress', label: 'В процессе', color: '#2196f3' },
  { value: 'completed', label: 'Завершён', color: '#4caf50' },
  { value: 'cancelled', label: 'Отменён', color: '#f44336' },
];

// Компонент строки таблицы с поддержкой DnD
const SortableRow: React.FC<{ row: any }> = ({ row }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.original.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{
            padding: '12px',
            borderBottom: '1px solid #e0e0e0',
            cursor: 'move',
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Компонент таблицы
const RoutesTable: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Настройка DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Обработка окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRoutes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Обновление статуса маршрута
  const updateRouteStatus = (routeId: string, newStatus: Route['status']) => {
    setRoutes(
      routes.map((route) => (route.id === routeId ? { ...route, status: newStatus } : route))
    );
  };

  // Настройка колонок таблицы
  const columnHelper = createColumnHelper<Route>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(
    () => [
      columnHelper.accessor('route', {
        header: 'Маршрут',
        cell: (info) => <div style={{ fontWeight: '600', color: '#333' }}>{info.getValue()}</div>,
      }),
      columnHelper.accessor('date', {
        header: 'Дата',
        cell: (info) => (
          <div style={{ color: '#666' }}>
            {new Date(info.getValue()).toLocaleDateString('ru-RU')}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Статус',
        cell: (info) => {
          const status = info.getValue();
          const statusOption = statusOptions.find((opt) => opt.value === status);
          const isEditing = editingId === info.row.original.id;

          return isEditing ? (
            <select
              value={status}
              onChange={(e) =>
                updateRouteStatus(info.row.original.id, e.target.value as Route['status'])
              }
              onBlur={() => setEditingId(null)}
              autoFocus
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                cursor: 'pointer',
                minWidth: '120px',
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div
              onClick={() => setEditingId(info.row.original.id)}
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: `${statusOption?.color}20`,
                color: statusOption?.color,
                border: `1px solid ${statusOption?.color}`,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {statusOption?.label}
            </div>
          );
        },
      }),
      columnHelper.accessor('cargoCount', {
        header: 'Грузов',
        cell: (info) => (
          <div
            style={{
              textAlign: 'center',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('driver', {
        header: 'Водитель',
        cell: (info) => <div style={{ color: '#666' }}>{info.getValue()}</div>,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingId]
  );

  // Инициализация таблицы
  const table = useReactTable({
    data: routes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            color: '#333',
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
          }}
        >
          Маршруты
        </h2>
        <div
          style={{
            fontSize: '14px',
            color: '#666',
            backgroundColor: '#f5f5f5',
            padding: '8px 12px',
            borderRadius: '4px',
          }}
        >
          Всего маршрутов: {routes.length}
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0',
                        color: '#555',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <SortableContext
                items={routes.map((route) => route.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>

        <div
          style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0',
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ marginRight: '20px' }}>
              🚚 Всего грузов: {routes.reduce((sum, route) => sum + route.cargoCount, 0)}
            </span>
            <span>
              📅 Ближайшая дата:{' '}
              {new Date(
                Math.min(...routes.map((r) => new Date(r.date).getTime()))
              ).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ff9800',
              }}
            ></span>
            <span>Запланирован</span>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#2196f3',
              }}
            ></span>
            <span>В процессе</span>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#4caf50',
              }}
            ></span>
            <span>Завершён</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#2e7d32',
        }}
      >
        💡 <strong>Инструкция:</strong> Перетаскивайте строки для изменения порядка маршрутов.
        Нажмите на статус для его изменения.
      </div>
    </div>
  );
};

export default RoutesTable;
