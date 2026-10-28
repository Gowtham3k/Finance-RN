import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
}) => {
  const navigation = useNavigation<any>();
  const { role, theme, themeColors, toggleTheme } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.headerBg, borderBottomColor: themeColors.border }]}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={themeColors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
            onPress={() => {
              if (navigation.toggleDrawer) {
                navigation.toggleDrawer();
              } else if (navigation.openDrawer) {
                navigation.openDrawer();
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Role Status Badge */}
        <View
          style={[
            styles.rolePill,
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
            size={13}
            color={role === 'admin' ? (theme === 'dark' ? '#F59E0B' : '#B45309') : (theme === 'dark' ? '#10B981' : '#059669')}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.roleText,
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
            {role === 'admin' ? 'Admin' : 'Customer'}
          </Text>
        </View>

        {/* Quick Theme Toggle Button (Light / Dark) */}
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme Mode"
        >
          <Ionicons
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={theme === 'dark' ? '#F59E0B' : themeColors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  adminPill: {
    backgroundColor: '#FEF3C7',
  },
  customerPill: {
    backgroundColor: '#D1FAE5',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  themeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
