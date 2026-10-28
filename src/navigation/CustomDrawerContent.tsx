import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const CustomDrawerContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, role, signOut, theme, themeColors, toggleTheme } = useApp();

  const navigateTo = (screenName: string, params?: any) => {
    navigation.closeDrawer();
    navigation.navigate('MainTabs', {
      screen: screenName,
      params,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.drawerBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Drawer Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Image
            source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
            style={[styles.avatar, { borderColor: themeColors.primary }]}
          />
          <Text style={[styles.name, { color: themeColors.textPrimary }]}>{user.name}</Text>
          <Text style={[styles.email, { color: themeColors.textSecondary }]}>{user.email}</Text>

          {/* Role Pill */}
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor:
                  role === 'admin'
                    ? theme === 'dark'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(217, 119, 6, 0.12)'
                    : theme === 'dark'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(5, 150, 105, 0.12)',
                borderWidth: 1,
                borderColor:
                  role === 'admin'
                    ? theme === 'dark'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(217, 119, 6, 0.25)'
                    : theme === 'dark'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(5, 150, 105, 0.25)',
              },
            ]}
          >
            <Ionicons
              name={role === 'admin' ? 'shield-checkmark' : 'person'}
              size={12}
              color={role === 'admin' ? (theme === 'dark' ? '#F59E0B' : '#B45309') : (theme === 'dark' ? '#10B981' : '#059669')}
            />
            <Text
              style={[
                styles.roleBadgeText,
                {
                  color:
                    role === 'admin'
                      ? theme === 'dark'
                        ? '#F59E0B'
                        : '#B45309'
                      : theme === 'dark'
                      ? '#10B981'
                      : '#059669',
                },
              ]}
            >
              {role === 'admin' ? 'System Administrator' : 'Customer Account'}
            </Text>
          </View>
        </View>

        {/* Quick Theme Toggle Card */}
        <TouchableOpacity
          style={[styles.themeCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <View style={styles.themeLeft}>
            <View style={[styles.navIconBox, { backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(13, 148, 136, 0.15)' }]}>
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={18}
                color={theme === 'dark' ? '#F59E0B' : themeColors.primary}
              />
            </View>
            <View>
              <Text style={[styles.themeTitle, { color: themeColors.textPrimary }]}>Theme Mode</Text>
              <Text style={[styles.themeSub, { color: themeColors.textSecondary }]}>
                {theme === 'dark' ? 'Dark Luxury' : 'Clean Light'}
              </Text>
            </View>
          </View>
          <View style={[styles.themeTogglePill, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.themeToggleText}>{theme === 'dark' ? 'DARK' : 'LIGHT'}</Text>
          </View>
        </TouchableOpacity>

        {/* Navigation Links */}
        <View style={styles.navSection}>
          <Text style={[styles.sectionHeading, { color: themeColors.textMuted }]}>NAVIGATION MENU</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('HomeTab')}
          >
            <View style={[styles.navIconBox, { backgroundColor: themeColors.primary + '18' }]}>
              <Ionicons name="home-outline" size={18} color={themeColors.primary} />
            </View>
            <Text style={[styles.navText, { color: themeColors.textPrimary }]}>Home Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('TransactionsTab')}
          >
            <View style={[styles.navIconBox, { backgroundColor: themeColors.primary + '18' }]}>
              <Ionicons name="card-outline" size={18} color={themeColors.primary} />
            </View>
            <Text style={[styles.navText, { color: themeColors.textPrimary }]}>Transactions (Month-wise)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('CategoriesTab')}
          >
            <View style={[styles.navIconBox, { backgroundColor: themeColors.primary + '18' }]}>
              <Ionicons name="grid-outline" size={18} color={themeColors.primary} />
            </View>
            <Text style={[styles.navText, { color: themeColors.textPrimary }]}>Overall Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('AnalysisTab')}
          >
            <View style={[styles.navIconBox, { backgroundColor: themeColors.primary + '18' }]}>
              <Ionicons name="pie-chart-outline" size={18} color={themeColors.primary} />
            </View>
            <Text style={[styles.navText, { color: themeColors.textPrimary }]}>Financial Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('ProfileTab')}
          >
            <View style={[styles.navIconBox, { backgroundColor: themeColors.primary + '18' }]}>
              <Ionicons name="person-outline" size={18} color={themeColors.primary} />
            </View>
            <Text style={[styles.navText, { color: themeColors.textPrimary }]}>Profile & Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.navSection}>
          <Text style={[styles.sectionHeading, { color: themeColors.textMuted }]}>ACCOUNT</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              navigation.closeDrawer();
              signOut();
            }}
          >
            <View style={[styles.navIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="log-out-outline" size={18} color={themeColors.expense} />
            </View>
            <Text style={[styles.navText, { color: themeColors.expenseLight }]}>Sign Out / Change Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Application Footer */}
      <View style={[styles.footer, { backgroundColor: themeColors.cardBackground, borderTopColor: themeColors.border }]}>
        <Ionicons name="shield-checkmark" size={16} color={themeColors.primaryLight} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.footerTitle, { color: themeColors.textPrimary }]}>Finance Budget Tracker Pro</Text>
          <Text style={[styles.footerSub, { color: themeColors.textMuted }]}>Client-Side Vault • ₹ INR Default</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
  },
  profileHeader: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    fontSize: 11.5,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
  },
  customerBadge: {
    backgroundColor: '#D1FAE5',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeSub: {
    fontSize: 11,
  },
  themeTogglePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  themeToggleText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },

  navSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
  },
  footerTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  footerSub: {
    fontSize: 10,
  },
});
