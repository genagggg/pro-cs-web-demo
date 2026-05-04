import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Константы привилегий
export const PRIVILEGES = {
  RADAR: 'radar',
  OFFERS: 'offers',
  ROUTES: 'routes'
} as const;

export type Privilege = typeof PRIVILEGES[keyof typeof PRIVILEGES];

// Роли и их привилегии
export const ROLES = {
  ADMIN: 'admin',
  LOGIST: 'logist'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Привилегии для каждой роли
const ROLE_PRIVILEGES: Record<Role, Privilege[]> = {
  [ROLES.ADMIN]: [PRIVILEGES.RADAR, PRIVILEGES.OFFERS, PRIVILEGES.ROUTES],
  [ROLES.LOGIST]: [PRIVILEGES.RADAR]
};

interface PrivilegesContextType {
  role: Role;
  privileges: Privilege[];
  setRole: (role: Role) => void;
  hasPrivilege: (privilege: Privilege) => boolean;
}

const PrivilegesContext = createContext<PrivilegesContextType | undefined>(undefined);

// Хук для работы с localStorage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

interface PrivilegesProviderProps {
  children: ReactNode;
}

export const PrivilegesProvider: React.FC<PrivilegesProviderProps> = ({ children }) => {
  const [role, setRoleState] = useLocalStorage<Role>('user_role', ROLES.ADMIN);
  const [privileges, setPrivileges] = useState<Privilege[]>(ROLE_PRIVILEGES[role]);

  // Обновляем привилегии при смене роли
  useEffect(() => {
    setPrivileges(ROLE_PRIVILEGES[role]);
  }, [role]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const hasPrivilege = (privilege: Privilege): boolean => {
    return privileges.includes(privilege);
  };

  const value = {
    role,
    privileges,
    setRole,
    hasPrivilege
  };

  return (
    <PrivilegesContext.Provider value={value}>
      {children}
    </PrivilegesContext.Provider>
  );
};

// Хук для использования контекста
export const usePrivileges = (): PrivilegesContextType => {
  const context = useContext(PrivilegesContext);
  if (context === undefined) {
    throw new Error('usePrivileges must be used within a PrivilegesProvider');
  }
  return context;
};

// Компонент для защиты контента по привилегиям
interface ProtectedContentProps {
  privilege: Privilege;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  privilege, 
  children, 
  fallback = null 
}) => {
  const { hasPrivilege } = usePrivileges();
  
  if (!hasPrivilege(privilege)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};