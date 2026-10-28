import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { ReportTimeframe } from '../types';

export const ReportsWidget: React.FC = () => {
  const { user, transactions, themeColors } = useApp();
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('monthly');

  // Filter current month transactions
  const currentMonthTx = transactions.filter((t) => t.month === '2026-10');
  const expenses = currentMonthTx.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = currentMonthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const isFreshAccount = transactions.length === 0;

  // Weekly data (Mock 7-day breakdown for Oct 19 - Oct 25, 2026)
  const weeklyDays = isFreshAccount
    ? [
        { day: 'Mon', amount: 0, height: 4 },
        { day: 'Tue', amount: 0, height: 4 },
        { day: 'Wed', amount: 0, height: 4 },
        { day: 'Thu', amount: 0, height: 4 },
        { day: 'Fri', amount: 0, height: 4 },
        { day: 'Sat', amount: 0, height: 4 },
        { day: 'Sun', amount: 0, height: 4 },
      ]
    : [
        { day: 'Mon', amount: 450, height: 35 },
        { day: 'Tue', amount: 1100, height: 75, highlight: true },
        { day: 'Wed', amount: 650, height: 50 },
        { day: 'Thu', amount: 300, height: 25 },
        { day: 'Fri', amount: 850, height: 65 },
        { day: 'Sat', amount: 1400, height: 95, highlight: true },
        { day: 'Sun', amount: 640, height: 48 },
      ];
  const weeklyTotal = weeklyDays.reduce((acc, d) => acc + d.amount, 0);

  // Daily timeline breakdown (Today's activities)
  const dailySlots = isFreshAccount
    ? []
    : [
        { slot: 'Morning', label: 'Coffee & Commute', amount: 180, icon: 'cafe-outline' },
        { slot: 'Afternoon', label: 'Lunch Bistro', amount: 240, icon: 'restaurant-outline' },
        { slot: 'Evening', label: 'Grocery Restock', amount: 650, icon: 'basket-outline' },
        { slot: 'Night', label: 'Streaming & Relax', amount: 120, icon: 'film-outline' },
      ];
  const dailyTotal = dailySlots.reduce((acc, s) => acc + s.amount, 0);

  const budgetUsedPercent = Math.min(
    100,
    Math.round((totalExpense / (user.monthlyBudget || 50000)) * 100)
  );

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
      {/* Header with Title and Segment Control */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
            <Ionicons name="bar-chart" size={16} color={themeColors.primaryLight} />
          </View>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Financial Reports</Text>
        </View>

        {/* Tab Controls */}
        <View style={[styles.tabContainer, { backgroundColor: themeColors.cardSecondary }]}>
          {(['daily', 'weekly', 'monthly'] as ReportTimeframe[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                timeframe === tab && [styles.tabButtonActive, { backgroundColor: themeColors.primary }],
              ]}
              onPress={() => setTimeframe(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: themeColors.textMuted },
                  timeframe === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Render Dynamic Report Content based on selected timeframe */}
      {timeframe === 'daily' && (
        <View style={styles.content}>
          <View style={[styles.summaryBar, { backgroundColor: themeColors.cardSecondary }]}>
            <View>
              <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>{"Today's Spending (28 Oct)"}</Text>
              <Text style={[styles.summaryValue, { color: themeColors.textPrimary }]}>
                {user.currency}{dailyTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.dailyBadge}>
              <Ionicons name="sunny" size={14} color="#F59E0B" />
              <Text style={styles.dailyBadgeText}>{dailySlots.length} Slots</Text>
            </View>
          </View>

          {/* Timeline Breakdown */}
          <View style={styles.timelineList}>
            {dailySlots.map((slot, index) => (
              <View key={index} style={[styles.timelineItem, { borderBottomColor: themeColors.border }]}>
                <View style={[styles.slotIconBox, { backgroundColor: themeColors.cardSecondary }]}>
                  <Ionicons name={slot.icon as any} size={16} color={themeColors.primaryLight} />
                </View>
                <View style={styles.slotDetails}>
                  <Text style={[styles.slotName, { color: themeColors.textPrimary }]}>{slot.slot}</Text>
                  <Text style={[styles.slotLabel, { color: themeColors.textMuted }]}>{slot.label}</Text>
                </View>
                <Text style={[styles.slotAmount, { color: themeColors.expenseLight }]}>
                  -{user.currency}{slot.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {timeframe === 'weekly' && (
        <View style={styles.content}>
          <View style={[styles.summaryBar, { backgroundColor: themeColors.cardSecondary }]}>
            <View>
              <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>This Week Total</Text>
              <Text style={[styles.summaryValue, { color: themeColors.textPrimary }]}>
                {user.currency}{weeklyTotal.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.dailyBadge, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Ionicons name="trending-up" size={14} color={themeColors.primaryLight} />
              <Text style={[styles.dailyBadgeText, { color: themeColors.primaryLight }]}>
                Peak: Sat ({user.currency}1400)
              </Text>
            </View>
          </View>

          {/* 7-Day Bar Chart */}
          <View style={styles.chartContainer}>
            {weeklyDays.map((d, idx) => (
              <View key={idx} style={styles.barColumn}>
                <Text style={[styles.barAmountText, { color: themeColors.textMuted }]}>{user.currency}{d.amount}</Text>
                <View style={[styles.barTrack, { backgroundColor: themeColors.cardSecondary }]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${d.height}%`, backgroundColor: themeColors.primary },
                      d.highlight && [styles.barHighlight, { backgroundColor: themeColors.cyan }],
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barDayText,
                    { color: themeColors.textMuted },
                    d.highlight && [styles.barDayHighlight, { color: themeColors.cyan }],
                  ]}
                >
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {timeframe === 'monthly' && (
        <View style={styles.content}>
          <View style={[styles.summaryBar, { backgroundColor: themeColors.cardSecondary }]}>
            <View>
              <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>October 2026 Total Expense</Text>
              <Text style={[styles.summaryValue, { color: themeColors.expenseLight }]}>
                {user.currency}{totalExpense.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: themeColors.textMuted, textAlign: 'right' }]}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: themeColors.income, textAlign: 'right' }]}>
                +{user.currency}{totalIncome.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Budget Health Meter */}
          <View style={[styles.budgetGaugeContainer, { backgroundColor: themeColors.cardSecondary }]}>
            <View style={styles.gaugeHeader}>
              <Text style={[styles.gaugeTitle, { color: themeColors.textSecondary }]}>Monthly Budget Utilization</Text>
              <Text style={[styles.gaugePercent, { color: themeColors.primaryLight }]}>{budgetUsedPercent}%</Text>
            </View>
            <View style={[styles.gaugeTrack, { backgroundColor: themeColors.border }]}>
              <View
                style={[
                  styles.gaugeFill,
                  { width: `${budgetUsedPercent}%`, backgroundColor: themeColors.primary },
                  budgetUsedPercent > 80 ? [styles.gaugeWarning, { backgroundColor: themeColors.warning }] : null,
                ]}
              />
            </View>
            <View style={styles.gaugeFooter}>
              <Text style={[styles.gaugeSubText, { color: themeColors.textMuted }]}>
                Spent {user.currency}{totalExpense.toFixed(0)} of {user.currency}
                {user.monthlyBudget} Cap
              </Text>
              <Text style={[styles.gaugeSubText, { color: themeColors.incomeLight }]}>
                {user.currency}
                {Math.max(0, user.monthlyBudget - totalExpense).toFixed(0)} Left
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 3,
  },
  tabButton: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    marginTop: 4,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 10,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dailyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  timelineList: {
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  slotIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  slotDetails: {
    flex: 1,
  },
  slotName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  slotLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  slotAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.expenseLight,
  },
  // Weekly Bar Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 15,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barAmountText: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 7,
  },
  barHighlight: {
    backgroundColor: colors.cyan,
  },
  barDayText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  barDayHighlight: {
    color: colors.cyan,
    fontWeight: '700',
  },
  // Monthly Budget Gauge
  budgetGaugeContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 14,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gaugeTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  gaugePercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  gaugeTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  gaugeWarning: {
    backgroundColor: colors.warning,
  },
  gaugeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gaugeSubText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
