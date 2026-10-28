export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  monthlyBudget: number;
  currency: string;
  accountTier: string;
  memberSince: string;
}

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  month: string; // e.g. "2026-10" or "Oct 2026"
  note?: string;
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  type: 'expense' | 'income';
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  timestamp: string;
  read: boolean;
}

export type ReportTimeframe = 'daily' | 'weekly' | 'monthly';

export interface ValidationErrors {
  [key: string]: string;
}
