import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  G,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/theme';
import { Header } from '../components/Header';

type TimePeriod = 'oct' | 'sep' | 'aug';

export const AnalysisScreen: React.FC = () => {
  const { role, user, transactions, categories, getTotalExpense, getTotalIncome, themeColors } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('oct');

  const monthMap: Record<TimePeriod, { key: string; label: string }> = {
    oct: { key: '2026-10', label: 'October 2026' },
    sep: { key: '2026-09', label: 'September 2026' },
    aug: { key: '2026-08', label: 'August 2026' },
  };

  const activeMonthKey = monthMap[selectedPeriod].key;
  const currentMonthTx = transactions.filter((t) => t.month === activeMonthKey);
  const totalExpense = getTotalExpense(activeMonthKey);
  const totalIncome = getTotalIncome(activeMonthKey);
  const netSavings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category spending aggregation for Donut / Pie Chart
  const categorySpending = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const spent = currentMonthTx
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalExpense > 0 ? Math.round((spent / totalExpense) * 100) : 0;
      return {
        ...cat,
        spent,
        percentage,
      };
    })
    .filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  // SVG Donut Chart Math
  const donutSize = 220;
  const strokeWidth = 28;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const donutSlices = categorySpending.map((cat, idx) => {
    const priorPercent = categorySpending.slice(0, idx).reduce((acc, c) => acc + c.percentage, 0);
    const strokeDash = (cat.percentage / 100) * circumference;
    const strokeOffset = -((priorPercent / 100) * circumference);
    return {
      ...cat,
      strokeDash,
      strokeOffset,
    };
  });

  // 6-Month Comparison Data for Bar Graph
  const monthlyComparison = [
    { month: 'May', income: 65000, expense: 39500, label: 'May 26' },
    { month: 'Jun', income: 72000, expense: 42000, label: 'Jun 26' },
    { month: 'Jul', income: 65000, expense: 41200, label: 'Jul 26' },
    { month: 'Aug', income: 65000, expense: 43900, label: 'Aug 26' },
    { month: 'Sep', income: 77000, expense: 44450, label: 'Sep 26' },
    { month: 'Oct', income: totalIncome, expense: totalExpense, label: 'Oct 26' },
  ];
  const maxBarValue = 85000;

  // 4-Week Spending Velocity Line Graph
  const weeklyVelocity = [
    { week: 'Week 1', amount: 23400, x: 30, y: 35 },
    { week: 'Week 2', amount: 8200, x: 110, y: 110 },
    { week: 'Week 3', amount: 6350, x: 190, y: 125 },
    { week: 'Week 4', amount: 7100, x: 270, y: 115 },
  ];

  // SVG Line Path: M 30 35 C 70 70, 80 110, 110 110 C 140 110, 160 125, 190 125 C 220 125, 240 115, 270 115
  const linePath = 'M 30 35 C 70 70, 80 110, 110 110 C 140 110, 160 125, 190 125 C 220 125, 240 115, 270 115';
  const areaPath = 'M 30 35 C 70 70, 80 110, 110 110 C 140 110, 160 125, 190 125 C 220 125, 240 115, 270 115 L 270 150 L 30 150 Z';

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title={role === 'admin' ? 'Macro System Analytics' : 'Financial Charts & Analytics'}
        subtitle={role === 'admin' ? 'System Throughput & Ledgers' : `${monthMap[selectedPeriod].label} Performance`}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector Tabs */}
        <View style={[styles.periodRow, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          {(['oct', 'sep', 'aug'] as TimePeriod[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodBtn,
                selectedPeriod === p && { backgroundColor: themeColors.primary },
              ]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  selectedPeriod === p && styles.periodBtnTextActive,
                ]}
              >
                {monthMap[p].label.split(' ')[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* -------------------------------------------------------------
            CUSTOMER VIEW (Rich Visual Charts)
        ------------------------------------------------------------- */}
        {role === 'customer' ? (
          <>
            {/* Financial Health Score Banner */}
            <View style={[styles.scoreCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.scoreRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.scoreLabel, { color: themeColors.textMuted }]}>FINANCIAL HEALTH SCORE</Text>
                  <Text style={[styles.scoreValue, { color: themeColors.textPrimary }]}>88 / 100</Text>
                  <Text style={styles.scoreSub}>Excellent! Savings rate is {savingsRate}% this period</Text>
                </View>
                <View style={styles.gaugeBox}>
                  <Ionicons name="shield-checkmark" size={32} color={colors.income} />
                  <Text style={styles.gaugeText}>A+ GRADE</Text>
                </View>
              </View>

              {/* Financial Metrics Strip */}
              <View style={[styles.metricsStrip, { backgroundColor: themeColors.cardSecondary }]}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Total Inflow</Text>
                  <Text style={[styles.metricAmount, { color: colors.income }]}>
                    +{user.currency}{totalIncome.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Total Outflow</Text>
                  <Text style={[styles.metricAmount, { color: colors.expenseLight }]}>
                    -{user.currency}{totalExpense.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Net Savings</Text>
                  <Text style={[styles.metricAmount, { color: colors.primaryLight }]}>
                    +{user.currency}{netSavings.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* CHART 1: Category Spending Donut / Pie Chart */}
            <View style={[styles.chartCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.chartHeaderRow}>
                <View style={[styles.chartHeaderIcon, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                  <Ionicons name="pie-chart" size={18} color="#EC4899" />
                </View>
                <View>
                  <Text style={[styles.chartTitle, { color: themeColors.textPrimary }]}>
                    Expense Breakdown (Pie Chart)
                  </Text>
                  <Text style={[styles.chartSubtitle, { color: themeColors.textMuted }]}>
                    Category share of {user.currency}{totalExpense.toLocaleString()} spent
                  </Text>
                </View>
              </View>

              {/* SVG Donut Circle */}
              <View style={styles.donutCenterWrapper}>
                <Svg width={donutSize} height={donutSize} style={styles.donutSvg}>
                  <G rotation="-90" origin={`${donutSize / 2}, ${donutSize / 2}`}>
                    {/* Background track circle */}
                    <Circle
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={radius}
                      stroke={themeColors.border}
                      strokeWidth={strokeWidth}
                      fill="none"
                    />

                    {/* Donut Slices */}
                    {donutSlices.map((slice) => (
                      <Circle
                        key={slice.id}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={radius}
                        stroke={slice.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${slice.strokeDash} ${circumference}`}
                        strokeDashoffset={slice.strokeOffset}
                        strokeLinecap="round"
                        fill="none"
                      />
                    ))}
                  </G>
                </Svg>

                {/* Donut Inner Label */}
                <View style={styles.donutInnerContent}>
                  <Text style={[styles.donutInnerLabel, { color: themeColors.textMuted }]}>TOTAL SPENT</Text>
                  <Text style={[styles.donutInnerAmount, { color: themeColors.textPrimary }]}>
                    {user.currency}{totalExpense.toLocaleString()}
                  </Text>
                  <Text style={[styles.donutInnerCount, { color: themeColors.incomeLight }]}>
                    {categorySpending.length} Categories
                  </Text>
                </View>
              </View>

              {/* Pie Chart Legend Grid */}
              <View style={styles.legendGrid}>
                {categorySpending.map((cat) => (
                  <View key={cat.id} style={[styles.legendPill, { backgroundColor: themeColors.cardSecondary }]}>
                    <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.legendCatName, { color: themeColors.textPrimary }]} numberOfLines={1}>
                        {cat.name}
                      </Text>
                      <Text style={[styles.legendCatAmount, { color: themeColors.textSecondary }]}>
                        {user.currency}{cat.spent.toLocaleString()} ({cat.percentage}%)
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* CHART 2: Monthly Income vs Expense Bar Graph */}
            <View style={[styles.chartCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.chartHeaderRow}>
                <View style={[styles.chartHeaderIcon, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <Ionicons name="bar-chart" size={18} color={themeColors.primaryLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.chartTitle, { color: themeColors.textPrimary }]}>
                    Income vs Expense (6-Month Bar Graph)
                  </Text>
                  <Text style={[styles.chartSubtitle, { color: themeColors.textMuted }]}>
                    Monthly cash flow comparison in {user.currency}
                  </Text>
                </View>
              </View>

              {/* Bar Chart Legend */}
              <View style={styles.barLegendRow}>
                <View style={styles.barLegendItem}>
                  <View style={[styles.legendColorBox, { backgroundColor: themeColors.income }]} />
                  <Text style={[styles.barLegendText, { color: themeColors.textSecondary }]}>Income</Text>
                </View>
                <View style={styles.barLegendItem}>
                  <View style={[styles.legendColorBox, { backgroundColor: themeColors.expense }]} />
                  <Text style={[styles.barLegendText, { color: themeColors.textSecondary }]}>Expense</Text>
                </View>
              </View>

              {/* Vertical Bar Columns */}
              <View style={[styles.barChartContainer, { borderBottomColor: themeColors.border }]}>
                {monthlyComparison.map((m, idx) => {
                  const incomeHeight = Math.min(130, Math.round((m.income / maxBarValue) * 130));
                  const expenseHeight = Math.min(130, Math.round((m.expense / maxBarValue) * 130));
                  const isCurrent = m.month === 'Oct';

                  return (
                    <View key={idx} style={styles.barMonthGroup}>
                      <View style={styles.barPillarWrapper}>
                        {/* Income Bar */}
                        <View style={[styles.pillarTrack, { backgroundColor: themeColors.cardSecondary }]}>
                          <View
                            style={[
                              styles.pillarFill,
                              { height: incomeHeight, backgroundColor: themeColors.income },
                            ]}
                          />
                        </View>

                        {/* Expense Bar */}
                        <View style={[styles.pillarTrack, { backgroundColor: themeColors.cardSecondary }]}>
                          <View
                            style={[
                              styles.pillarFill,
                              { height: expenseHeight, backgroundColor: themeColors.expense },
                            ]}
                          />
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.barMonthText,
                          { color: isCurrent ? themeColors.primaryLight : themeColors.textMuted },
                          isCurrent && { fontWeight: '700' },
                        ]}
                      >
                        {m.month}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* CHART 3: Cash Flow Spending Trend (Area Line Graph) */}
            <View style={[styles.chartCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.chartHeaderRow}>
                <View style={[styles.chartHeaderIcon, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                  <Ionicons name="trending-up" size={18} color={themeColors.cyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.chartTitle, { color: themeColors.textPrimary }]}>
                    Weekly Spending Velocity (Trend Line)
                  </Text>
                  <Text style={[styles.chartSubtitle, { color: themeColors.textMuted }]}>
                    October 4-week expenditure progression
                  </Text>
                </View>
              </View>

              {/* SVG Area Line Chart */}
              <View style={styles.lineChartBox}>
                <Svg width="100%" height={160} viewBox="0 0 300 160">
                  <Defs>
                    <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                      <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                    </LinearGradient>
                  </Defs>

                  {/* Grid Lines */}
                  <Path d="M 20 40 L 280 40" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                  <Path d="M 20 80 L 280 80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                  <Path d="M 20 120 L 280 120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

                  {/* Area fill */}
                  <Path d={areaPath} fill="url(#lineGrad)" />

                  {/* Smooth Curve */}
                  <Path d={linePath} stroke="#06B6D4" strokeWidth="3" fill="none" />

                  {/* Data Point Circles */}
                  {weeklyVelocity.map((pt, i) => (
                    <Circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#06B6D4"
                      stroke="#131B2E"
                      strokeWidth="2"
                    />
                  ))}
                </Svg>

                {/* X-Axis labels for line chart */}
                <View style={styles.velocityLabelsRow}>
                  {weeklyVelocity.map((w, idx) => (
                    <View key={idx} style={styles.velocityCol}>
                      <Text style={[styles.velocityWeekText, { color: themeColors.textMuted }]}>{w.week}</Text>
                      <Text style={[styles.velocityAmountText, { color: themeColors.textPrimary }]}>
                        {user.currency}{(w.amount / 1000).toFixed(1)}k
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          /* -------------------------------------------------------------
              ADMIN VIEW (Macro System Analytics in ₹ INR)
          ------------------------------------------------------------- */
          <>
            <View style={[styles.scoreCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.scoreRow}>
                <View>
                  <Text style={[styles.scoreLabel, { color: themeColors.textMuted }]}>PLATFORM VOLUME VELOCITY</Text>
                  <Text style={[styles.scoreValue, { color: themeColors.textPrimary }]}>
                    {user.currency}2,48,500
                  </Text>
                  <Text style={styles.scoreSub}>Active month throughput across 1,420 accounts</Text>
                </View>
                <View style={[styles.gaugeBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="analytics" size={28} color="#F59E0B" />
                  <Text style={[styles.gaugeText, { color: '#F59E0B' }]}>ACTIVE</Text>
                </View>
              </View>

              <View style={[styles.metricsStrip, { backgroundColor: themeColors.cardSecondary }]}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Avg Ticket Size</Text>
                  <Text style={[styles.metricAmount, { color: themeColors.textPrimary }]}>
                    {user.currency}648.00
                  </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Daily Tx Velocity</Text>
                  <Text style={[styles.metricAmount, { color: themeColors.textPrimary }]}>285 / day</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>Audit Health</Text>
                  <Text style={[styles.metricAmount, { color: colors.income }]}>100% Safe</Text>
                </View>
              </View>
            </View>

            {/* Macro Category Distribution */}
            <View style={[styles.chartCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={styles.chartHeaderRow}>
                <Ionicons name="bar-chart" size={18} color={themeColors.primaryLight} />
                <Text style={[styles.chartTitle, { color: themeColors.textPrimary }]}>
                  Platform Category Share (Aggregate Ledger)
                </Text>
              </View>

              <View style={styles.macroList}>
                {[
                  { name: 'Housing & Rent', share: 38, volume: '94,430', color: '#6366F1' },
                  { name: 'Food & Dining', share: 26, volume: '64,610', color: '#F59E0B' },
                  { name: 'Shopping & Retail', share: 18, volume: '44,730', color: '#EC4899' },
                  { name: 'Transportation', share: 11, volume: '27,335', color: '#3B82F6' },
                  { name: 'Utilities & Bills', share: 7, volume: '17,395', color: '#06B6D4' },
                ].map((item, index) => (
                  <View key={index} style={styles.macroRow}>
                    <View style={[styles.macroIndexBox, { backgroundColor: item.color + '22' }]}>
                      <Text style={{ color: item.color, fontWeight: '800' }}>#{index + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.macroLabelRow}>
                        <Text style={[styles.macroName, { color: themeColors.textPrimary }]}>{item.name}</Text>
                        <Text style={[styles.macroPercent, { color: themeColors.textSecondary }]}>
                          {item.share}% ({user.currency}{item.volume})
                        </Text>
                      </View>
                      <View style={styles.macroTrack}>
                        <View
                          style={[
                            styles.macroFill,
                            { width: `${item.share * 2.5}%`, backgroundColor: item.color },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  periodRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodBtnText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '700',
  },
  periodBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scoreCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 10.5,
    letterSpacing: 1,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
  },
  scoreSub: {
    fontSize: 12,
    color: colors.incomeLight,
    fontWeight: '600',
  },
  gaugeBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  gaugeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.income,
    marginTop: 2,
  },
  metricsStrip: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  metricAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  chartCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  chartHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  chartSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  donutCenterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
    height: 220,
  },
  donutSvg: {
    position: 'absolute',
  },
  donutInnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInnerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  donutInnerAmount: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 2,
  },
  donutInnerCount: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    width: '48%',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendCatName: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  legendCatAmount: {
    fontSize: 10,
    marginTop: 1,
  },
  barLegendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginBottom: 14,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  barLegendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  barMonthGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barPillarWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 130,
  },
  pillarTrack: {
    width: 10,
    height: 130,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  pillarFill: {
    width: '100%',
    borderRadius: 5,
  },
  barMonthText: {
    fontSize: 11,
    marginTop: 8,
  },
  lineChartBox: {
    marginTop: 6,
  },
  velocityLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  velocityCol: {
    alignItems: 'center',
  },
  velocityWeekText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  velocityAmountText: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  macroList: {
    gap: 12,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  macroIndexBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  macroName: {
    fontSize: 13,
    fontWeight: '600',
  },
  macroPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  macroTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 4,
  },
});
