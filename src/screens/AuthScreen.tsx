import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { UserRole } from '../types';
export const AuthScreen: React.FC = () => {
  const { signIn, signUp, themeColors } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Form Fields - Auto-populated with default Customer credentials initially
  const [name, setName] = useState('');
  const [email, setEmail] = useState('customer@financetracker.com');
  const [password, setPassword] = useState('customer123');
  const [monthlyBudget, setMonthlyBudget] = useState('50000');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // When clicking Customer or Admin card, automatically fill the respective default email & password
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
    if (activeTab === 'signin') {
      if (role === 'customer') {
        setEmail('customer@financetracker.com');
        setPassword('customer123');
      } else {
        setEmail('admin@financetracker.com');
        setPassword('admin123');
      }
    } else {
      if (role === 'customer') {
        setName('Kavitha Priya');
        setEmail('kavitha@financetracker.com');
        setPassword('kavitha123');
      } else {
        setName('Admin Gowtham');
        setEmail('admin@financetracker.com');
        setPassword('admin123');
      }
    }
  };

  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setErrors({});
    if (tab === 'signin') {
      if (selectedRole === 'customer') {
        setEmail('customer@financetracker.com');
        setPassword('customer123');
      } else {
        setEmail('admin@financetracker.com');
        setPassword('admin123');
      }
    } else {
      if (selectedRole === 'customer') {
        setName('Kavitha Priya');
        setEmail('kavitha@financetracker.com');
        setPassword('kavitha123');
        setMonthlyBudget('50000');
      } else {
        setName('Admin Gowtham');
        setEmail('admin@financetracker.com');
        setPassword('admin123');
        setMonthlyBudget('75000');
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (activeTab === 'signup' && !name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (activeTab === 'signup' && name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;
    const result = signIn(email.trim(), password, selectedRole);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        auth: result.error || 'Access Denied: Invalid email or password.',
      }));
    }
  };

  const handleSignUp = () => {
    if (!validate()) return;
    const result = signUp(name.trim(), email.trim(), password, selectedRole, parseFloat(monthlyBudget) || 50000);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        auth: result.error || 'Failed to register account.',
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.brandHeader}>
          <View style={[styles.logoCircle, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary }]}>
            <Ionicons name="wallet" size={32} color="#FFF" />
          </View>
          <Text style={[styles.brandTitle, { color: themeColors.textPrimary }]}>Finance Tracker</Text>
          <Text style={[styles.brandSubtitle, { color: themeColors.textSecondary }]}>
            Secure Client-Side Wealth & Budget Authentication
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.authCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          {/* Tab Switcher: Sign In vs Sign Up */}
          <View style={[styles.tabBar, { backgroundColor: themeColors.cardSecondary }]}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signin' && [styles.tabBtnActive, { backgroundColor: themeColors.primary }]]}
              onPress={() => handleTabChange('signin')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: themeColors.textMuted },
                  activeTab === 'signin' && styles.tabBtnTextActive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signup' && [styles.tabBtnActive, { backgroundColor: themeColors.primary }]]}
              onPress={() => handleTabChange('signup')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: themeColors.textMuted },
                  activeTab === 'signup' && styles.tabBtnTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Role Authorization Selector */}
          <View style={styles.roleContainer}>
            <Text style={[styles.roleHeaderLabel, { color: themeColors.textSecondary }]}>Select Access Role</Text>
            <View style={styles.roleCardsRow}>
              {/* Customer Role Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border },
                  selectedRole === 'customer' && styles.roleCardActiveCustomer,
                ]}
                onPress={() => handleSelectRole('customer')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.roleIconBox,
                    { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                  ]}
                >
                  <Ionicons name="person" size={18} color="#10B981" />
                </View>
                <Text style={[styles.roleCardTitle, { color: themeColors.textPrimary }]}>Customer</Text>
                <Text style={[styles.roleCardDesc, { color: themeColors.textMuted }]}>
                  Personal budget, transactions & savings
                </Text>
                {selectedRole === 'customer' && (
                  <View style={styles.activePill}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.activePillText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Admin Role Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border },
                  selectedRole === 'admin' && styles.roleCardActiveAdmin,
                ]}
                onPress={() => handleSelectRole('admin')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.roleIconBox,
                    { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={18} color="#F59E0B" />
                </View>
                <Text style={[styles.roleCardTitle, { color: themeColors.textPrimary }]}>Admin</Text>
                <Text style={[styles.roleCardDesc, { color: themeColors.textMuted }]}>
                  System KPIs, ledgers & audit controls
                </Text>
                {selectedRole === 'admin' && (
                  <View style={[styles.activePill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Ionicons name="checkmark-circle" size={14} color="#F59E0B" />
                    <Text style={[styles.activePillText, { color: '#F59E0B' }]}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Inputs */}
          <View style={styles.formFields}>
            {/* Strict Authentication Error Banner */}
            {errors.auth ? (
              <View style={styles.authErrorBanner}>
                <Ionicons name="alert-circle" size={20} color="#F43F5E" />
                <Text style={styles.authErrorBannerText}>{errors.auth}</Text>
              </View>
            ) : null}

            {activeTab === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Full Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                    errors.name ? styles.inputError : null,
                  ]}
                  placeholder={selectedRole === 'admin' ? 'Admin Gowtham' : 'Gowtham S'}
                  placeholderTextColor={themeColors.textMuted}
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>
                {selectedRole === 'admin' ? 'Admin Email *' : 'Customer Email *'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                  errors.email ? styles.inputError : null,
                ]}
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin@financetracker.com'
                    : 'customer@financetracker.com'
                }
                placeholderTextColor={themeColors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrors((prev) => ({ ...prev, email: '', auth: '' }));
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Password *</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                  errors.password ? styles.inputError : null,
                ]}
                placeholder="••••••••"
                placeholderTextColor={themeColors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrors((prev) => ({ ...prev, password: '', auth: '' }));
                }}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {activeTab === 'signup' && selectedRole === 'customer' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Monthly Budget Target (₹)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: themeColors.cardSecondary, color: themeColors.textPrimary, borderColor: themeColors.border },
                  ]}
                  placeholder="50000"
                  placeholderTextColor={themeColors.textMuted}
                  keyboardType="numeric"
                  value={monthlyBudget}
                  onChangeText={setMonthlyBudget}
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: themeColors.primary }]}
              onPress={activeTab === 'signin' ? handleSignIn : handleSignUp}
              activeOpacity={0.8}
            >
              <Ionicons
                name={activeTab === 'signin' ? 'log-in-outline' : 'person-add-outline'}
                size={18}
                color="#FFF"
              />
              <Text style={styles.submitBtnText}>
                {activeTab === 'signin'
                  ? `Sign In as ${selectedRole.toUpperCase()}`
                  : `Create ${selectedRole.toUpperCase()} Account`}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#131B2E',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  roleContainer: {
    marginBottom: 18,
  },
  roleHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  roleCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
  },
  roleCardActiveCustomer: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  roleCardActiveAdmin: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  roleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleCardDesc: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 14,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  activePillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#10B981',
  },
  formFields: {
    gap: 12,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.expense,
  },
  errorText: {
    fontSize: 11,
    color: colors.expense,
    marginTop: 4,
    marginLeft: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  authErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    marginBottom: 14,
  },
  authErrorBannerText: {
    color: '#F43F5E',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
});
