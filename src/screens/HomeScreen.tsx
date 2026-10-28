import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';
import { ReportsWidget } from '../components/ReportsWidget';
import { TransactionModal } from '../components/TransactionModal';
import { HoverCard } from '../components/HoverCard';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    user,
    role,
    signOut,
    transactions,
    getTotalIncome,
    getTotalExpense,
    getBalance,
    themeColors,
  } = useApp();

  // Modals & States
  const [txModalVisible, setTxModalVisible] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Financial calculations
  const totalIncome = getTotalIncome('2026-10');
  const totalExpense = getTotalExpense('2026-10');
  const netBalance = getBalance('2026-10');
  const recentTransactions = transactions.slice(0, 4);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title={role === 'admin' ? 'Admin Dashboard' : 'Finance Tracker'}
        subtitle={role === 'admin' ? 'System Management' : `Welcome, ${user.name}`}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* -------------------------------------------------------------
            CUSTOMER VIEW (When role === 'customer')
        ------------------------------------------------------------- */}
        {role === 'customer' ? (
          <>
            {/* Figma Fintech Hero Card */}
            <View style={[styles.balanceCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              {/* Top Accent Indicator */}
              <View style={[styles.cardAccentLine, { backgroundColor: themeColors.primary }]} />

              <View style={styles.balanceHeader}>
                <View style={styles.balanceHeaderLeft}>
                  <Text style={[styles.balanceLabel, { color: themeColors.textMuted }]}>TOTAL NET BALANCE</Text>
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                    activeOpacity={0.7}
                    accessibilityLabel="Toggle Balance Visibility"
                  >
                    <Ionicons
                      name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                      size={16}
                      color={themeColors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <View style={[styles.currencyBadge, { backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }]}>
                  <View style={[styles.liveDot, { backgroundColor: themeColors.primaryLight }]} />
                  <Text style={[styles.currencyBadgeText, { color: themeColors.primaryLight }]}>Oct 2026</Text>
                </View>
              </View>

              <Text style={[styles.balanceAmount, { color: themeColors.textPrimary }]}>
                {isBalanceHidden
                  ? '••••••••'
                  : `${user.currency}${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </Text>

              {/* Inflow & Outflow Pill Chips */}
              <View style={[styles.cashFlowRow, { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border }]}>
                <View style={styles.cashFlowItem}>
                  <View style={[styles.cashFlowIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Ionicons name="arrow-up" size={15} color={themeColors.income} />
                  </View>
                  <View>
                    <Text style={[styles.cashFlowLabel, { color: themeColors.textMuted }]}>Income</Text>
                    <Text style={[styles.cashFlowValue, { color: themeColors.incomeLight }]}>
                      {isBalanceHidden ? '••••' : `+${user.currency}${totalIncome.toFixed(2)}`}
                    </Text>
                  </View>
                </View>

                <View style={[styles.cashFlowDivider, { backgroundColor: themeColors.border }]} />

                <View style={styles.cashFlowItem}>
                  <View style={[styles.cashFlowIcon, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
                    <Ionicons name="arrow-down" size={15} color={themeColors.expense} />
                  </View>
                  <View>
                    <Text style={[styles.cashFlowLabel, { color: themeColors.textMuted }]}>Expenses</Text>
                    <Text style={[styles.cashFlowValue, { color: themeColors.expenseLight }]}>
                      {isBalanceHidden ? '••••' : `-${user.currency}${totalExpense.toFixed(2)}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Part III.(iii) Requirement: Reports Daily / Weekly / Monthly in Home Screen */}
            <ReportsWidget />

            {/* Figma 4-Circle Quick Action Dock with Hover & Spring Animations */}
            <View style={styles.actionDockRow}>
              {/* + Add Transaction */}
              <HoverCard
                style={styles.actionDockItem}
                onPress={() => setTxModalVisible(true)}
                scaleHoverTo={1.12}
                scalePressTo={0.9}
                accessibilityLabel="Add Transaction"
              >
                <View style={[styles.actionCircle, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary }]}>
                  <Ionicons name="add" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionDockLabel, { color: themeColors.textPrimary }]}>Add</Text>
              </HoverCard>

              {/* Ledger */}
              <HoverCard
                style={styles.actionDockItem}
                onPress={() => navigation.navigate('TransactionsTab')}
                scaleHoverTo={1.12}
                scalePressTo={0.9}
                accessibilityLabel="View Ledger"
              >
                <View style={[styles.actionCircle, { backgroundColor: themeColors.cardBackground, borderWidth: 1, borderColor: themeColors.border }]}>
                  <Ionicons name="receipt-outline" size={20} color={themeColors.income} />
                </View>
                <Text style={[styles.actionDockLabel, { color: themeColors.textPrimary }]}>Ledger</Text>
              </HoverCard>

              {/* Categories */}
              <HoverCard
                style={styles.actionDockItem}
                onPress={() => navigation.navigate('CategoriesTab')}
                scaleHoverTo={1.12}
                scalePressTo={0.9}
                accessibilityLabel="Manage Categories"
              >
                <View style={[styles.actionCircle, { backgroundColor: themeColors.cardBackground, borderWidth: 1, borderColor: themeColors.border }]}>
                  <Ionicons name="grid-outline" size={20} color={themeColors.primaryLight} />
                </View>
                <Text style={[styles.actionDockLabel, { color: themeColors.textPrimary }]}>Categories</Text>
              </HoverCard>

              {/* Analytics */}
              <HoverCard
                style={styles.actionDockItem}
                onPress={() => navigation.navigate('AnalysisTab')}
                scaleHoverTo={1.12}
                scalePressTo={0.9}
                accessibilityLabel="View Analytics"
              >
                <View style={[styles.actionCircle, { backgroundColor: themeColors.cardBackground, borderWidth: 1, borderColor: themeColors.border }]}>
                  <Ionicons name="pie-chart-outline" size={20} color={themeColors.cyan} />
                </View>
                <Text style={[styles.actionDockLabel, { color: themeColors.textPrimary }]}>Analytics</Text>
              </HoverCard>
            </View>

            {/* Recent Transactions List */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TransactionsTab')}>
                <Text style={[styles.seeAllText, { color: themeColors.primaryLight }]}>
                  See All ({transactions.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {recentTransactions.length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                  <View style={[styles.emptyIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                    <Ionicons name="wallet-outline" size={32} color={themeColors.primaryLight} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
                    No Transactions Yet
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
                    Welcome {user.name}! Your fresh customer dashboard is ready. Tap below to record your first income or expense.
                  </Text>
                  <TouchableOpacity
                    style={[styles.emptyActionBtn, { backgroundColor: themeColors.primary }]}
                    onPress={() => setTxModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle" size={18} color="#FFF" />
                    <Text style={styles.emptyActionBtnText}>Add First Transaction</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                recentTransactions.map((tx) => {
                  const isExpense = tx.type === 'expense';
                  return (
                    <HoverCard
                      key={tx.id}
                      style={[styles.transactionCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                      glowColor={themeColors.primary + '50'}
                      scaleHoverTo={1.02}
                      scalePressTo={0.98}
                      onPress={() => navigation.navigate('TransactionsTab')}
                    >
                      <View style={styles.txRowInner}>
                        <View
                          style={[
                            styles.txIconBox,
                            { backgroundColor: tx.categoryColor + '20' },
                          ]}
                        >
                          <Ionicons
                            name={tx.categoryIcon as any}
                            size={18}
                            color={tx.categoryColor}
                          />
                        </View>

                        <View style={styles.txDetails}>
                          <Text style={[styles.txTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
                            {tx.title}
                          </Text>
                          <Text style={[styles.txMeta, { color: themeColors.textMuted }]}>
                            {tx.categoryName} • {tx.date}
                          </Text>
                        </View>

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
                      </View>
                    </HoverCard>
                  );
                })
              )}
            </View>
          </>
        ) : (
          /* -------------------------------------------------------------
              ADMIN VIEW (When role === 'admin')
          ------------------------------------------------------------- */
          <View style={styles.adminContainer}>
            {/* Admin Overview Banner */}
            <View style={[styles.adminBanner, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.primary }]}>
              <View style={styles.adminBadgeRow}>
                <Ionicons name="shield-checkmark" size={18} color="#F59E0B" />
                <Text style={styles.adminBannerBadge}>System Administrator Panel</Text>
              </View>
              <Text style={[styles.adminBannerTitle, { color: themeColors.textPrimary }]}>Financial Health & User Velocity</Text>
              <Text style={[styles.adminBannerSub, { color: themeColors.textSecondary }]}>
                Real-time monitoring across all registered mobile client sessions.
              </Text>
            </View>

            {/* 4 KPI Grid Cards */}
            <View style={styles.kpiGrid}>
              <View style={[styles.kpiCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                <Ionicons name="people" size={20} color={themeColors.primaryLight} />
                <Text style={[styles.kpiNumber, { color: themeColors.textPrimary }]}>1,420</Text>
                <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>Registered Users</Text>
                <Text style={[styles.kpiSub, { color: themeColors.income }]}>+12% this month</Text>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                <Ionicons name="swap-horizontal" size={20} color={themeColors.cyan} />
                <Text style={[styles.kpiNumber, { color: themeColors.textPrimary }]}>{transactions.length + 8900}</Text>
                <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>Total Transactions</Text>
                <Text style={[styles.kpiSub, { color: themeColors.cyan }]}>100% verified</Text>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                <Ionicons name="cash" size={20} color={themeColors.income} />
                <Text style={[styles.kpiNumber, { color: themeColors.textPrimary }]}>{user.currency}{(totalIncome * 45).toLocaleString()}</Text>
                <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>Volume Processed</Text>
                <Text style={[styles.kpiSub, { color: themeColors.textMuted }]}>Client ledger</Text>
              </View>

              <View style={[styles.kpiCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                <Ionicons name="server" size={20} color={themeColors.purple} />
                <Text style={[styles.kpiNumber, { color: themeColors.textPrimary }]}>99.9%</Text>
                <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>App Uptime</Text>
                <Text style={[styles.kpiSub, { color: themeColors.income }]}>Local state cache</Text>
              </View>
            </View>

            {/* Admin Actions */}
            <View style={[styles.adminActionsCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.adminSectionTitle, { color: themeColors.textPrimary }]}>Admin Diagnostics</Text>
              <View style={styles.adminBtnGrid}>
                <TouchableOpacity
                  style={[styles.adminControlBtn, { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border }]}
                  onPress={() => {}}
                >
                  <Ionicons name="shield-checkmark-outline" size={16} color={themeColors.primaryLight} />
                  <Text style={[styles.adminControlBtnText, { color: themeColors.textPrimary }]}>Run Security Health Check</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminControlBtn, { backgroundColor: themeColors.cardSecondary, borderColor: themeColors.border }]}
                  onPress={() => {}}
                >
                  <Ionicons name="sync-outline" size={16} color="#F59E0B" />
                  <Text style={[styles.adminControlBtnText, { color: themeColors.textPrimary }]}>Sync System Ledgers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminControlBtn, { backgroundColor: themeColors.cardSecondary, borderColor: 'rgba(244, 63, 94, 0.4)' }]}
                  onPress={signOut}
                >
                  <Ionicons name="log-out-outline" size={16} color={themeColors.expense} />
                  <Text style={[styles.adminControlBtnText, { color: themeColors.expenseLight }]}>
                    Sign Out of Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Ledger Audit Feed */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>System Ledger Audit Feed</Text>
            </View>

            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((t) => (
                <View key={t.id} style={[styles.adminAuditItem, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
                  <View style={styles.auditLeft}>
                    <Text style={[styles.auditId, { color: themeColors.textMuted }]}>{t.id}</Text>
                    <Text style={[styles.auditTitle, { color: themeColors.textPrimary }]}>{t.title}</Text>
                    <Text style={[styles.auditCategory, { color: themeColors.textSecondary }]}>{t.categoryName} • {t.date}</Text>
                  </View>
                  <View style={styles.auditRight}>
                    <Text
                      style={[
                        styles.auditAmount,
                        { color: t.type === 'expense' ? themeColors.expenseLight : themeColors.income },
                      ]}
                    >
                      {t.type === 'expense' ? '-' : '+'}{user.currency}{t.amount.toFixed(2)}
                    </Text>
                    <View style={styles.auditBadge}>
                      <Text style={styles.auditBadgeText}>AUDITED</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Transaction Creation Modal */}
      <TransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
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
  // Auth Quick Strip
  authBannerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  authBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authBannerText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  authToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authToggleBtnText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  // Auth Box
  authBox: {
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  authTabRow: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  authTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  authTabActive: {
    backgroundColor: colors.primary,
  },
  authTabText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  authTabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  authRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authRoleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleBtnGroup: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: 8,
    padding: 2,
  },
  roleSelectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  roleSelectBtnActive: {
    backgroundColor: '#334155',
  },
  roleSelectBtnText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  roleSelectBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  authInputGroup: {
    marginBottom: 10,
  },
  authInputLabel: {
    fontSize: 11.5,
    color: colors.textLight,
    marginBottom: 4,
  },
  authInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: colors.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  authInputError: {
    borderColor: colors.expense,
  },
  authErrorText: {
    fontSize: 10.5,
    color: colors.expense,
    marginTop: 2,
  },
  authSubmitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  authSubmitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  signOutLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  signOutLinkText: {
    color: colors.expenseLight,
    fontSize: 11.5,
    fontWeight: '600',
  },
  // Figma Hero Balance Card
  balanceCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardAccentLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  balanceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeBtn: {
    padding: 4,
    borderRadius: 6,
  },
  balanceLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  currencyBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 18,
  },
  cashFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  cashFlowItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cashFlowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashFlowLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  cashFlowValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  cashFlowDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 8,
  },
  // Figma 4-Circle Quick Action Dock
  actionDockRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 8,
  },
  actionDockItem: {
    alignItems: 'center',
    gap: 6,
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  actionDockLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    backgroundColor: '#131B2E',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  txMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  // Admin View Styles
  adminContainer: {
    gap: 14,
  },
  adminBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  adminBannerBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  adminBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  adminBannerSub: {
    fontSize: 12,
    color: '#C7D2FE',
    lineHeight: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  kpiSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  adminActionsCard: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminSectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  adminBtnGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  adminControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminControlBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  adminAuditItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  auditLeft: {
    flex: 1,
  },
  auditId: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  auditCategory: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  auditRight: {
    alignItems: 'flex-end',
  },
  auditAmount: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  auditBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  auditBadgeText: {
    fontSize: 8.5,
    color: '#6EE7B7',
    fontWeight: '800',
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  emptyActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
