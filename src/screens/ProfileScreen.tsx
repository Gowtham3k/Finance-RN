import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    user,
    role,
    getTotalExpense,
    signOut,
    theme,
    themeColors,
    toggleTheme,
  } = useApp();

  const totalExpense = getTotalExpense('2026-10');

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Customer Profile"
        subtitle="Account Preferences & Settings"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Role Warning Banner if in Admin mode */}
        {role === 'admin' && (
          <View style={styles.roleWarningBanner}>
            <Ionicons name="information-circle" size={18} color="#F59E0B" />
            <Text style={styles.roleWarningText}>
              Note: Profile settings and personal limits apply to Customer mode.
            </Text>
          </View>
        )}

        {/* Profile Card */}
        <View style={[styles.profileHeaderCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={styles.avatarImage}
            />
            <TouchableOpacity
              style={styles.avatarEditBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: themeColors.textPrimary }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>{user.email}</Text>
          <View style={styles.tierPill}>
            <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
            <Text style={styles.tierText}>{user.accountTier}</Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={[styles.statsRow, { backgroundColor: themeColors.cardSecondary }]}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
                {user.currency}{user.monthlyBudget}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Monthly Limit</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: themeColors.expenseLight }]}>
                {user.currency}{totalExpense.toFixed(0)}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Oct Spent</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>{user.currency}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Currency</Text>
            </View>
          </View>

          {/* Edit Profile Button (Stack Navigation Trigger!) */}
          <TouchableOpacity
            style={[styles.editProfileBtn, { backgroundColor: themeColors.primary }]}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#FFF" />
            <Text style={styles.editProfileBtnText}>Edit Profile & Budget</Text>
          </TouchableOpacity>
        </View>

        {/* Account Details Section */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Account Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="call-outline" size={18} color={themeColors.primaryLight} />
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Phone Number</Text>
            </View>
            <Text style={[styles.detailValue, { color: themeColors.textPrimary }]}>{user.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={18} color={themeColors.cyan} />
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Member Since</Text>
            </View>
            <Text style={[styles.detailValue, { color: themeColors.textPrimary }]}>{user.memberSince}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="cash-outline" size={18} color={themeColors.income} />
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Currency Format</Text>
            </View>
            <Text style={[styles.detailValue, { color: themeColors.textPrimary }]}>{user.currency} (Standard)</Text>
          </View>
        </View>

        {/* Preferences & Security (Settings) */}
        <View style={[styles.sectionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Preferences & Security</Text>

          {/* Theme Mode Switch */}
          <View style={styles.preferenceRow}>
            <View style={styles.prefLeft}>
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={18}
                color={theme === 'dark' ? '#F59E0B' : themeColors.primary}
              />
              <View>
                <Text style={[styles.prefTitle, { color: themeColors.textPrimary }]}>Dark Theme Mode</Text>
                <Text style={[styles.prefSubtitle, { color: themeColors.textMuted }]}>
                  {theme === 'dark' ? 'Dark Luxury mode active' : 'Clean Light mode active'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ true: themeColors.primary, false: '#94A3B8' }}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: themeColors.cardBackground, borderColor: 'rgba(244, 63, 94, 0.4)' }]}
          onPress={signOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={themeColors.expenseLight} />
          <Text style={[styles.signOutButtonText, { color: themeColors.expenseLight }]}>Sign Out of Current Account</Text>
        </TouchableOpacity>

        {/* Footer Badge */}
        <View style={styles.examFooter}>
          <Ionicons name="wallet-outline" size={16} color={themeColors.textMuted} />
          <Text style={[styles.examFooterText, { color: themeColors.textMuted }]}>
            Finance Budget Tracker • Personal Wealth & Expense Management
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  roleWarningBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    flexDirection: 'column',
    gap: 8,
  },
  roleWarningText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  switchRoleBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  switchRoleBtnText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '700',
  },
  profileHeaderCard: {
    backgroundColor: '#131B2E',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#131B2E',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8,
  },
  editProfileBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  prefSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  signOutButtonText: {
    color: colors.expenseLight,
    fontSize: 13.5,
    fontWeight: '700',
  },
  examFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  examFooterText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
