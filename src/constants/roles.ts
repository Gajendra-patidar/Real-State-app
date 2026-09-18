export const ROLES = {
  MANAGER: 'manager',
  SALES_MANAGER: 'sales_manager',
  SALES_EXECUTIVE: 'sales_executive',
  EXECUTIVE: 'executive',
  BROKER: 'broker',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
