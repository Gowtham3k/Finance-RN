import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryModal } from '../components/CategoryModal';
import { Category } from '../types';

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { categories, getCategorySpent, user, themeColors } = useApp();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const renderCategoryCard = (cat: Category) => {
    const spent = getCategorySpent(cat.id, '2026-10');
    const remaining = cat.budget - spent;
    const percentUsed = Math.min(100, Math.round((spent / cat.budget) * 100));

    // Color code indicator
    const isOverBudget = percentUsed >= 90;
    const isWarning = percentUsed >= 70 && percentUsed < 90;
    const statusColor = isOverBudget
      ? colors.expense
      : isWarning
      ? colors.warning
      : colors.income;

    return (
      <TouchableOpacity
        key={cat.id}
        style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CategoryDetails', { categoryId: cat.id })}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: cat.color + '22' }]}>
              <Ionicons name={cat.icon as any} size={20} color={cat.color} />
            </View>
            <View>
              <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>{cat.name}</Text>
              <Text style={[styles.budgetCap, { color: themeColors.textMuted }]}>
                Budget: {user.currency}{cat.budget.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.cardRight}>
            <Text style={[styles.spentAmount, { color: statusColor }]}>
              {user.currency}{spent.toFixed(2)}
            </Text>
            <Text style={styles.spentLabel}>Spent this month</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: themeColors.cardSecondary }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentUsed}%`, backgroundColor: statusColor },
              ]}
            />
          </View>

          <View style={styles.progressMeta}>
            <Text style={[styles.percentText, { color: statusColor }]}>
              {percentUsed}% Used
            </Text>
            <Text style={[styles.remainingText, { color: themeColors.textMuted }]}>
              {remaining >= 0
                ? `${user.currency}${remaining.toFixed(2)} Left`
                : `${user.currency}${Math.abs(remaining).toFixed(2)} Over Budget`}
            </Text>
          </View>
        </View>

        {/* Click to inspect badge */}
        <View style={[styles.cardFooter, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.tapToViewText, { color: themeColors.textSecondary }]}>Tap to view transaction breakdown</Text>
          <Ionicons name="chevron-forward" size={14} color={themeColors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Overall Categories"
        subtitle="Budget Limits & Spending"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Summary & Add Category Action */}
        <View style={[styles.topSummaryBar, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View>
            <Text style={[styles.topSummaryTitle, { color: themeColors.textPrimary }]}>Categories Tracked</Text>
            <Text style={[styles.topSummarySub, { color: themeColors.textMuted }]}>
              {expenseCategories.length} Expense • {incomeCategories.length} Income
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addCategoryBtn, { backgroundColor: themeColors.primary }]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Ionicons name="add" size={16} color="#FFF" />
            <Text style={styles.addCategoryBtnText}>New Category</Text>
          </TouchableOpacity>
        </View>

        {/* Expense Categories Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="arrow-down-circle" size={16} color={themeColors.expense} />
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Expense Categories</Text>
        </View>

        <View style={styles.cardsGrid}>
          {expenseCategories.map(renderCategoryCard)}
        </View>

        {/* Income Categories Section */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Ionicons name="arrow-up-circle" size={16} color={themeColors.income} />
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Income Sources</Text>
        </View>

        <View style={styles.cardsGrid}>
          {incomeCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CategoryDetails', { categoryId: cat.id })}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.cardLeft}>
                  <View style={[styles.iconBox, { backgroundColor: cat.color + '22' }]}>
                    <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                  </View>
                  <View>
                    <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>{cat.name}</Text>
                    <Text style={[styles.budgetCap, { color: themeColors.textMuted }]}>
                      Target: {user.currency}{cat.budget.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Text style={[styles.spentAmount, { color: themeColors.income }]}>
                    +{user.currency}{cat.budget.toLocaleString()}
                  </Text>
                  <Text style={[styles.spentLabel, { color: themeColors.textMuted }]}>Expected</Text>
                </View>
              </View>
              <View style={[styles.cardFooter, { borderTopColor: themeColors.border }]}>
                <Text style={[styles.tapToViewText, { color: themeColors.textSecondary }]}>Tap to view credit history</Text>
                <Ionicons name="chevron-forward" size={14} color={themeColors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Category Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
      />
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
  topSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topSummaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  topSummarySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addCategoryBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardsGrid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  budgetCap: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  spentLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  remainingText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  tapToViewText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
