import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole, Transaction, Category } from '../types';
import { ThemeMode, darkColors, lightColors, setThemeMode } from '../constants/theme';

interface AppContextType {
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  finishLoading: () => void;
  transactions: Transaction[];
  categories: Category[];

  // Theme Mode
  theme: ThemeMode;
  themeColors: typeof darkColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;


  // Actions
  setRole: (role: UserRole) => void;
  switchRole: () => void;
  signIn: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string, role: UserRole, monthlyBudget?: number) => { success: boolean; error?: string };
  signOut: () => void;

  // Transactions CRUD
  addTransaction: (data: Omit<Transaction, 'id' | 'month'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;

  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;

  // Profile Action
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Helpers
  getCategoryById: (id: string) => Category | undefined;
  getCategorySpent: (categoryId: string, month?: string) => number;
  getTotalIncome: (month?: string) => number;
  getTotalExpense: (month?: string) => number;
  getBalance: (month?: string) => number;
  resetToDefaults: () => void;
}

const defaultUser: UserProfile = {
  id: 'usr-101',
  name: 'Gowtham S',
  email: 'gowtham@financetracker.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  monthlyBudget: 50000,
  currency: '₹',
  accountTier: 'Verified Customer',
  memberSince: 'August 2025',
};

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'restaurant', color: '#F59E0B', budget: 12000, type: 'expense' },
  { id: 'cat-2', name: 'Shopping', icon: 'cart', color: '#EC4899', budget: 8000, type: 'expense' },
  { id: 'cat-3', name: 'Housing & Rent', icon: 'home', color: '#6366F1', budget: 18000, type: 'expense' },
  { id: 'cat-4', name: 'Transportation', icon: 'car', color: '#3B82F6', budget: 5000, type: 'expense' },
  { id: 'cat-5', name: 'Utilities & Bills', icon: 'flash', color: '#06B6D4', budget: 4500, type: 'expense' },
  { id: 'cat-6', name: 'Entertainment', icon: 'game-controller', color: '#8B5CF6', budget: 3500, type: 'expense' },
  { id: 'cat-7', name: 'Health & Fitness', icon: 'fitness', color: '#10B981', budget: 3500, type: 'expense' },
  { id: 'cat-8', name: 'Salary', icon: 'cash', color: '#10B981', budget: 65000, type: 'income' },
  { id: 'cat-9', name: 'Freelance & Bonus', icon: 'laptop', color: '#38BDF8', budget: 15000, type: 'income' },
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx-101',
    title: 'Monthly Salary Credit',
    amount: 65000,
    type: 'income',
    categoryId: 'cat-8',
    categoryName: 'Salary',
    categoryIcon: 'cash',
    categoryColor: '#10B981',
    date: '2026-10-01',
    time: '09:00',
    month: '2026-10',
    note: 'Apex Software Pvt Ltd Salary',
  },
  {
    id: 'tx-102',
    title: 'Apartment Monthly Rent',
    amount: 18000,
    type: 'expense',
    categoryId: 'cat-3',
    categoryName: 'Housing & Rent',
    categoryIcon: 'home',
    categoryColor: '#6366F1',
    date: '2026-10-02',
    time: '11:30',
    month: '2026-10',
    note: 'October Rent with parking fee',
  },
  {
    id: 'tx-103',
    title: 'Supermarket Groceries',
    amount: 5400,
    type: 'expense',
    categoryId: 'cat-1',
    categoryName: 'Food & Dining',
    categoryIcon: 'restaurant',
    categoryColor: '#F59E0B',
    date: '2026-10-05',
    time: '18:15',
    month: '2026-10',
    note: 'Weekly essentials and fresh produce',
  },
  {
    id: 'tx-104',
    title: 'Freelance Mobile App Design',
    amount: 15000,
    type: 'income',
    categoryId: 'cat-9',
    categoryName: 'Freelance & Bonus',
    categoryIcon: 'laptop',
    categoryColor: '#38BDF8',
    date: '2026-10-10',
    time: '14:00',
    month: '2026-10',
    note: 'Fintech Mobile UI Milestone',
  },
  {
    id: 'tx-105',
    title: 'Electricity & High-speed Wifi',
    amount: 2800,
    type: 'expense',
    categoryId: 'cat-5',
    categoryName: 'Utilities & Bills',
    categoryIcon: 'flash',
    categoryColor: '#06B6D4',
    date: '2026-10-12',
    time: '16:45',
    month: '2026-10',
    note: 'Monthly fiber broadband & EB bill',
  },
  {
    id: 'tx-106',
    title: 'Fuel & Metro Smart Card',
    amount: 2400,
    type: 'expense',
    categoryId: 'cat-4',
    categoryName: 'Transportation',
    categoryIcon: 'car',
    categoryColor: '#3B82F6',
    date: '2026-10-15',
    time: '08:30',
    month: '2026-10',
    note: 'Commute and petrol recharge',
  },
  {
    id: 'tx-107',
    title: 'Weekend Dinner & Café',
    amount: 1950,
    type: 'expense',
    categoryId: 'cat-1',
    categoryName: 'Food & Dining',
    categoryIcon: 'restaurant',
    categoryColor: '#F59E0B',
    date: '2026-10-18',
    time: '20:45',
    month: '2026-10',
    note: 'Family dining & dessert',
  },
  {
    id: 'tx-108',
    title: 'Festival Shopping & Apparel',
    amount: 4600,
    type: 'expense',
    categoryId: 'cat-2',
    categoryName: 'Shopping',
    categoryIcon: 'cart',
    categoryColor: '#EC4899',
    date: '2026-10-22',
    time: '15:20',
    month: '2026-10',
    note: 'Traditional wear & accessories',
  },
  {
    id: 'tx-109',
    title: 'Gym & Fitness Membership',
    amount: 2500,
    type: 'expense',
    categoryId: 'cat-7',
    categoryName: 'Health & Fitness',
    categoryIcon: 'fitness',
    categoryColor: '#10B981',
    date: '2026-10-24',
    time: '07:15',
    month: '2026-10',
    note: 'Quarterly training pass',
  },
  // Previous Month: September 2026
  {
    id: 'tx-201',
    title: 'September Salary Credit',
    amount: 65000,
    type: 'income',
    categoryId: 'cat-8',
    categoryName: 'Salary',
    categoryIcon: 'cash',
    categoryColor: '#10B981',
    date: '2026-09-01',
    time: '09:00',
    month: '2026-09',
  },
  {
    id: 'tx-202',
    title: 'September Rent Payment',
    amount: 18000,
    type: 'expense',
    categoryId: 'cat-3',
    categoryName: 'Housing & Rent',
    categoryIcon: 'home',
    categoryColor: '#6366F1',
    date: '2026-09-02',
    time: '10:00',
    month: '2026-09',
  },
  {
    id: 'tx-203',
    title: 'September Grocery Stock',
    amount: 6200,
    type: 'expense',
    categoryId: 'cat-1',
    categoryName: 'Food & Dining',
    categoryIcon: 'restaurant',
    categoryColor: '#F59E0B',
    date: '2026-09-08',
    time: '17:00',
    month: '2026-09',
  },
  {
    id: 'tx-204',
    title: 'Quarterly Project Bonus',
    amount: 12000,
    type: 'income',
    categoryId: 'cat-9',
    categoryName: 'Freelance & Bonus',
    categoryIcon: 'laptop',
    categoryColor: '#38BDF8',
    date: '2026-09-15',
    time: '12:00',
    month: '2026-09',
  },
  {
    id: 'tx-205',
    title: 'Electricity & Water Bill',
    amount: 2450,
    type: 'expense',
    categoryId: 'cat-5',
    categoryName: 'Utilities & Bills',
    categoryIcon: 'flash',
    categoryColor: '#06B6D4',
    date: '2026-09-20',
    time: '11:15',
    month: '2026-09',
  },
  {
    id: 'tx-206',
    title: 'Electronics & Gadgets',
    amount: 5800,
    type: 'expense',
    categoryId: 'cat-2',
    categoryName: 'Shopping',
    categoryIcon: 'cart',
    categoryColor: '#EC4899',
    date: '2026-09-25',
    time: '19:30',
    month: '2026-09',
  },
  // August 2026
  {
    id: 'tx-301',
    title: 'August Salary Credit',
    amount: 65000,
    type: 'income',
    categoryId: 'cat-8',
    categoryName: 'Salary',
    categoryIcon: 'cash',
    categoryColor: '#10B981',
    date: '2026-08-01',
    time: '09:00',
    month: '2026-08',
  },
  {
    id: 'tx-302',
    title: 'August Rent Payment',
    amount: 18000,
    type: 'expense',
    categoryId: 'cat-3',
    categoryName: 'Housing & Rent',
    categoryIcon: 'home',
    categoryColor: '#6366F1',
    date: '2026-08-02',
    time: '10:00',
    month: '2026-08',
  },
  {
    id: 'tx-303',
    title: 'August Groceries & Provisions',
    amount: 5900,
    type: 'expense',
    categoryId: 'cat-1',
    categoryName: 'Food & Dining',
    categoryIcon: 'restaurant',
    categoryColor: '#F59E0B',
    date: '2026-08-10',
    time: '16:00',
    month: '2026-08',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [role, setRoleState] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Theme Mode State (Figma Mint Emerald Palette)
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [themeColors, setThemeColorsState] = useState(darkColors);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    setThemeMode(mode);
    setThemeColorsState(mode === 'dark' ? darkColors : lightColors);
  };

  const toggleTheme = () => {
    const nextMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextMode);
  };

  const finishLoading = () => {
    setIsLoading(false);
  };


  // Registered Accounts Database for strict email & password authentication
  const [registeredAccounts, setRegisteredAccounts] = useState([
    {
      id: 'usr-admin-1',
      name: 'Admin Gowtham',
      email: 'admin@financetracker.com',
      password: 'admin123',
      role: 'admin' as UserRole,
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      monthlyBudget: 75000,
      accountTier: 'Master Admin',
    },
    {
      id: 'usr-customer-1',
      name: 'Gowtham S',
      email: 'customer@financetracker.com',
      password: 'customer123',
      role: 'customer' as UserRole,
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      monthlyBudget: 50000,
      accountTier: 'Customer Pro',
    },
    {
      id: 'usr-customer-2',
      name: 'Kavitha Priya',
      email: 'kavitha@financetracker.com',
      password: 'kavitha123',
      role: 'customer' as UserRole,
      phone: '+91 94444 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      monthlyBudget: 45000,
      accountTier: 'Customer Elite',
    },
  ]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser((prev) => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' ? 'Admin Gowtham' : 'Gowtham S',
    }));
  };

  const switchRole = () => {
    setRole(role === 'customer' ? 'admin' : 'customer');
  };

  // Strict Sign In: Validates that email, password and role match registered credentials
  const signIn = (
    inputEmail: string,
    inputPassword: string,
    targetRole: UserRole
  ): { success: boolean; error?: string } => {
    const cleanEmail = inputEmail.trim().toLowerCase();
    const cleanPassword = inputPassword.trim();

    // Check if account exists
    const account = registeredAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (!account) {
      return {
        success: false,
        error: `No registered account found with email "${inputEmail}". Access denied.`,
      };
    }

    // Check if role matches
    if (account.role !== targetRole) {
      return {
        success: false,
        error: `Role mismatch: This account belongs to a registered ${account.role.toUpperCase()}. Please select the ${account.role.toUpperCase()} tab.`,
      };
    }

    // Check if password matches
    if (account.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Access denied.',
      };
    }

    // Credentials verified! Allow login
    setIsAuthenticated(true);
    setRoleState(targetRole);

    if (account.email === 'customer@financetracker.com' && transactions.length === 0) {
      setTransactions(initialTransactions);
      setUser(defaultUser);
    } else {
      setUser({
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone || '+91 90000 00000',
        role: account.role,
        avatar: account.avatar || (account.role === 'admin'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        monthlyBudget: account.monthlyBudget || 50000,
        currency: '₹',
        accountTier: account.accountTier || (account.role === 'admin' ? 'Master Admin' : 'Customer Account'),
        memberSince: 'October 2026',
      });
    }

    return { success: true };
  };

  const signUp = (
    name: string,
    email: string,
    password: string,
    targetRole: UserRole,
    monthlyBudgetNum?: number
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const exists = registeredAccounts.some(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return {
        success: false,
        error: `An account with email "${email}" is already registered. Please sign in instead.`,
      };
    }

    const newAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      role: targetRole,
      phone: '+91 90000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      monthlyBudget: monthlyBudgetNum || 50000,
      accountTier: 'New Customer',
    };

    setRegisteredAccounts((prev) => [...prev, newAccount]);
    setIsAuthenticated(true);
    setRoleState(targetRole);
    setUser({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: newAccount.role,
      avatar: newAccount.avatar,
      monthlyBudget: newAccount.monthlyBudget,
      currency: '₹',
      accountTier: 'New Customer',
      memberSince: 'October 2026',
    });

    if (targetRole === 'customer') {
      setTransactions([]);
    }

    return { success: true };
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'month'>) => {
    const month = data.date.substring(0, 7); // "YYYY-MM"
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}`,
      month,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (category: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? category : c))
    );
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profileData }));
  };

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  const getCategorySpent = (categoryId: string, month = '2026-10') => {
    return transactions
      .filter((t) => t.categoryId === categoryId && t.type === 'expense' && t.month === month)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = (month = '2026-10') => {
    return transactions
      .filter((t) => t.type === 'income' && (month ? t.month === month : true))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = (month = '2026-10') => {
    return transactions
      .filter((t) => t.type === 'expense' && (month ? t.month === month : true))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = (month = '2026-10') => {
    return getTotalIncome(month) - getTotalExpense(month);
  };

  const resetToDefaults = () => {
    setUser(defaultUser);
    setRoleState('customer');
    setTransactions(initialTransactions);
    setCategories(initialCategories);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        finishLoading,
        transactions,
        categories,
        theme,
        themeColors,
        toggleTheme,
        setTheme,

        setRole,
        switchRole,
        signIn,
        signUp,
        signOut,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        updateProfile,
        getCategoryById,
        getCategorySpent,
        getTotalIncome,
        getTotalExpense,
        getBalance,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
