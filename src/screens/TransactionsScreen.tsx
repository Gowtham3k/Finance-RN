import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';
import { TransactionModal } from '../components/TransactionModal';
import { Transaction, TransactionType } from '../types';

const MONTHS = [
  { key: '2026-08', label: 'Aug 2026' },
  { key: '2026-09', label: 'Sep 2026' },
  { key: '2026-10', label: 'Oct 2026' },
  { key: '2026-11', label: 'Nov 2026' },
];

export const TransactionsScreen: React.FC = () => {
  const { transactions, deleteTransaction, user, themeColors } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [txModalVisible, setTxModalVisible] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  // Month-filtered transactions
  const monthTransactions = transactions.filter((t) => t.month === selectedMonth);

  // Summary for selected month
  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthNet = monthIncome - monthExpense;

  // Filtered by search and type
  const filteredTransactions = monthTransactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleEdit = (tx: Transaction) => {
    setTxToEdit(tx);
    setTxModalVisible(true);
  };

  const handleDelete = (tx: Transaction) => {
    deleteTransaction(tx.id);
  };

  const handleNewTransaction = () => {
    setTxToEdit(null);
    setTxModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Transactions"
        subtitle="Month-wise Ledger"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Month Picker Carousel (Requirement: Transaction month wise screen) */}
        <View style={styles.monthSelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthScroll}>
            {MONTHS.map((m) => {
              const isActive = selectedMonth === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.monthPill,
                    { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                    isActive && [styles.monthPillActive, { backgroundColor: themeColors.primary, borderColor: themeColors.primary }],
                  ]}
                  onPress={() => setSelectedMonth(m.key)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={isActive ? '#FFF' : themeColors.textMuted}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.monthPillText,
                      { color: themeColors.textMuted },
                      isActive && styles.monthPillTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Monthly Summary Bar */}
        <View style={[styles.summaryBar, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryColLabel, { color: themeColors.textMuted }]}>Income</Text>
            <Text style={[styles.summaryColVal, { color: themeColors.income }]}>
              +{user.currency}{monthIncome.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryColLabel, { color: themeColors.textMuted }]}>Expense</Text>
            <Text style={[styles.summaryColVal, { color: themeColors.expenseLight }]}>
              -{user.currency}{monthExpense.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryColLabel, { color: themeColors.textMuted }]}>Net Flow</Text>
            <Text
              style={[
                styles.summaryColVal,
                { color: monthNet >= 0 ? themeColors.incomeLight : themeColors.expenseLight },
              ]}
            >
              {monthNet >= 0 ? '+' : ''}
              {user.currency}
              {monthNet.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Search Bar & Filter Chips */}
        <View style={styles.filterSection}>
          <View style={[styles.searchBar, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <Ionicons name="search" size={18} color={themeColors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.textPrimary }]}
              placeholder="Search by title, note, or category..."
              placeholderTextColor={themeColors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={themeColors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Type Filter Chips */}
          <View style={styles.typeChipsRow}>
            {(['all', 'expense', 'income'] as const).map((t) => {
              const isSelected = filterType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeChip,
                    { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                    isSelected && [styles.typeChipActive, { backgroundColor: themeColors.primaryLight, borderColor: themeColors.primaryLight }],
                    isSelected && t === 'expense' && [styles.typeChipExpense, { backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: themeColors.expense }],
                    isSelected && t === 'income' && [styles.typeChipIncome, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: themeColors.income }],
                  ]}
                  onPress={() => setFilterType(t)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: themeColors.textMuted },
                      isSelected && styles.typeChipTextActive,
                      isSelected && t === 'expense' && { color: themeColors.expenseLight },
                      isSelected && t === 'income' && { color: themeColors.incomeLight },
                    ]}
                  >
                    {t === 'all'
                      ? 'All Types'
                      : t === 'expense'
                      ? 'Expenses (-)'
                      : 'Income (+)'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.listHeaderRow}>
          <Text style={[styles.listCountText, { color: themeColors.textMuted }]}>
            Showing {filteredTransactions.length} of {monthTransactions.length} items
          </Text>
        </View>

        {filteredTransactions.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <Ionicons name="receipt-outline" size={48} color={themeColors.textMuted} />
            <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>No transactions found</Text>
            <Text style={[styles.emptySub, { color: themeColors.textSecondary }]}>
              {searchQuery
                ? 'Try searching with another keyword.'
                : 'No transactions recorded for this month.'}
            </Text>
            <TouchableOpacity style={[styles.addFirstBtn, { backgroundColor: themeColors.primary }]} onPress={handleNewTransaction}>
              <Ionicons name="add-circle" size={18} color="#FFF" />
              <Text style={styles.addFirstBtnText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            {filteredTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <View key={tx.id} style={[styles.txCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                  <View
                    style={[
                      styles.txIconBox,
                      { backgroundColor: tx.categoryColor + '20' },
                    ]}
                  >
                    <Ionicons
                      name={tx.categoryIcon as any}
                      size={20}
                      color={tx.categoryColor}
                    />
                  </View>

                  <View style={styles.txContent}>
                    <Text style={[styles.txTitle, { color: themeColors.textPrimary }]}>{tx.title}</Text>
                    <View style={styles.txMetaRow}>
                      <View style={[styles.categoryTag, { backgroundColor: tx.categoryColor + '20' }]}>
                        <Text style={[styles.categoryTagText, { color: tx.categoryColor }]}>
                          {tx.categoryName}
                        </Text>
                      </View>
                      <Text style={[styles.txDateText, { color: themeColors.textMuted }]}>
                        {tx.date} • {tx.time}
                      </Text>
                    </View>
                    {tx.note ? (
                      <Text style={[styles.txNote, { color: themeColors.textSecondary }]} numberOfLines={1}>
                        {`"${tx.note}"`}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.txRightCol}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: isExpense ? themeColors.expenseLight : themeColors.income },
                      ]}
                    >
                      {isExpense ? '-' : '+'}
                      {user.currency}
                      {tx.amount.toFixed(2)}
                    </Text>

                    {/* Action Buttons: Edit & Delete */}
                    <View style={styles.txActionButtons}>
                      <TouchableOpacity
                        style={[styles.actionIconBtn, { backgroundColor: themeColors.cardSecondary }]}
                        onPress={() => handleEdit(tx)}
                      >
                        <Ionicons name="pencil" size={14} color={themeColors.primaryLight} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionIconBtn, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}
                        onPress={() => handleDelete(tx)}
                      >
                        <Ionicons name="trash-outline" size={14} color={themeColors.expense} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewTransaction}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color="#FFF" />
      </TouchableOpacity>

      {/* Transaction Modal */}
      <TransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
        transactionToEdit={txToEdit}
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
    paddingBottom: 80,
  },
  monthSelectorContainer: {
    marginBottom: 14,
  },
  monthScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  monthPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryColLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  summaryColVal: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  filterSection: {
    marginBottom: 14,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
  typeChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: '#131B2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: '#334155',
  },
  typeChipExpense: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderColor: colors.expense,
  },
  typeChipIncome: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.income,
  },
  typeChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  typeChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  listHeaderRow: {
    marginBottom: 8,
  },
  listCountText: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  transactionsContainer: {
    gap: 10,
  },
  txCard: {
    flexDirection: 'row',
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  txIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txContent: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  txDateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  txNote: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  txRightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  txActionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#131B2E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  addFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addFirstBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});
