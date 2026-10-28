import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';
import { TransactionModal } from '../components/TransactionModal';
import { Transaction } from '../types';

export const CategoryDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const { categoryId } = route.params || {};

  const { categories, transactions, user, deleteTransaction, themeColors } = useApp();

  const [txModalVisible, setTxModalVisible] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  const category = categories.find((c) => c.id === categoryId) || categories[0];

  // Category specific transactions
  const categoryTransactions = transactions.filter((t) => t.categoryId === category?.id);

  const totalSpent = categoryTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = (category?.budget || 0) - totalSpent;
  const percentUsed = category?.budget
    ? Math.min(100, Math.round((totalSpent / category.budget) * 100))
    : 0;

  const amounts = categoryTransactions.map((t) => t.amount);
  const highestSpend = amounts.length > 0 ? Math.max(...amounts) : 0;
  const avgSpend = amounts.length > 0 ? totalSpent / categoryTransactions.length : 0;

  const statusColor =
    percentUsed >= 90
      ? colors.expense
      : percentUsed >= 70
      ? colors.warning
      : colors.income;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title={category?.name || 'Category Details'}
        subtitle="Category Breakdown"
        showBack={true}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Category Header Card */}
        <View style={[styles.headerCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={[styles.bigIconBox, { backgroundColor: (category?.color || colors.primary) + '25' }]}>
            <Ionicons
              name={(category?.icon || 'card') as any}
              size={36}
              color={category?.color || colors.primary}
            />
          </View>

          <Text style={[styles.categoryTitle, { color: themeColors.textPrimary }]}>{category?.name}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: category?.type === 'expense' ? colors.expenseBg : colors.incomeBg }]}>
              <Text style={[styles.typeBadgeText, { color: category?.type === 'expense' ? colors.expenseLight : colors.income }]}>
                {category?.type === 'expense' ? 'Expense Category' : 'Income Source'}
              </Text>
            </View>
          </View>

          {/* Budget Utilized Meter */}
          <View style={[styles.budgetBox, { backgroundColor: themeColors.cardSecondary }]}>
            <View style={styles.budgetRow}>
              <View>
                <Text style={[styles.budgetBoxLabel, { color: themeColors.textMuted }]}>MONTHLY BUDGET CAP</Text>
                <Text style={[styles.budgetBoxValue, { color: themeColors.textPrimary }]}>
                  {user.currency}{category?.budget.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.budgetBoxLabel}>TOTAL SPENT</Text>
                <Text style={[styles.budgetBoxValue, { color: statusColor }]}>
                  {user.currency}{totalSpent.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${percentUsed}%`, backgroundColor: statusColor },
                ]}
              />
            </View>

            <View style={styles.budgetFooter}>
              <Text style={[styles.percentLabel, { color: statusColor }]}>
                {percentUsed}% Used
              </Text>
              <Text style={styles.remainingLabel}>
                {remaining >= 0
                  ? `${user.currency}${remaining.toFixed(2)} Remaining`
                  : `${user.currency}${Math.abs(remaining).toFixed(2)} Over Limit`}
              </Text>
            </View>
          </View>

          {/* Statistics Grid */}
          <View style={[styles.statsGrid, { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>{categoryTransactions.length}</Text>
              <Text style={[styles.statDesc, { color: themeColors.textMuted }]}>Transactions</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>
                {user.currency}{avgSpend.toFixed(1)}
              </Text>
              <Text style={[styles.statDesc, { color: themeColors.textMuted }]}>Avg Per Tx</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>
                {user.currency}{highestSpend.toFixed(1)}
              </Text>
              <Text style={[styles.statDesc, { color: themeColors.textMuted }]}>Highest Record</Text>
            </View>
          </View>

          {/* Add Transaction Button for this Category */}
          <TouchableOpacity
            style={[styles.addTxBtn, { backgroundColor: themeColors.primary }]}
            onPress={() => {
              setTxToEdit(null);
              setTxModalVisible(true);
            }}
          >
            <Ionicons name="add-circle" size={18} color="#FFF" />
            <Text style={styles.addTxBtnText}>Add Expense to {category?.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Transactions in {category?.name} ({categoryTransactions.length})
          </Text>
        </View>

        {categoryTransactions.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <Ionicons name="receipt-outline" size={38} color={themeColors.textMuted} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No transactions under this category yet.</Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: themeColors.primary }]}
              onPress={() => setTxModalVisible(true)}
            >
              <Text style={styles.emptyAddBtnText}>Record First Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.txList}>
            {categoryTransactions.map((tx) => (
              <View key={tx.id} style={[styles.txCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                <View style={styles.txLeft}>
                  <Text style={[styles.txTitle, { color: themeColors.textPrimary }]}>{tx.title}</Text>
                  <Text style={[styles.txDate, { color: themeColors.textMuted }]}>{tx.date} • {tx.time}</Text>
                  {tx.note ? <Text style={[styles.txNote, { color: themeColors.textSecondary }]}>{`"${tx.note}"`}</Text> : null}
                </View>

                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'expense' ? themeColors.expenseLight : themeColors.income },
                    ]}
                  >
                    {tx.type === 'expense' ? '-' : '+'}
                    {user.currency}
                    {tx.amount.toFixed(2)}
                  </Text>

                  <View style={styles.txActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: themeColors.cardSecondary }]}
                      onPress={() => {
                        setTxToEdit(tx);
                        setTxModalVisible(true);
                      }}
                    >
                      <Ionicons name="pencil" size={13} color={themeColors.primaryLight} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}
                      onPress={() => deleteTransaction(tx.id)}
                    >
                      <Ionicons name="trash" size={13} color={themeColors.expense} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Transaction Modal */}
      <TransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
        transactionToEdit={txToEdit}
        defaultCategoryId={category?.id}
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
  headerCard: {
    backgroundColor: '#131B2E',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bigIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  badgeRow: {
    marginTop: 6,
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  budgetBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 14,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  budgetBoxValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  remainingLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statDesc: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  addTxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  addTxBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txList: {
    gap: 10,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txLeft: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  txDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  txNote: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  txActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#131B2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyAddBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
