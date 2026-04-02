import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { Surface, Avatar, List, Icon } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { colors } from '../../src/theme/colors';
import { formatCurrency } from '../../src/utils/helpers';
import { useAnalytics } from '../../src/hooks/useQueries';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading || !analytics) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Indigo 600
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4F46E5',
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: '600'
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>BUSINESS INSIGHTS</Text>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        <Surface style={styles.periodBadge} elevation={0}>
          <Text style={styles.periodText}>Last 6 Months</Text>
        </Surface>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Surface style={styles.statMiniCard} elevation={1}>
            <Text style={styles.miniLabel}>Avg. Ticket</Text>
            <Text style={styles.miniValue}>₹2,450</Text>
            <View style={styles.trendRow}>
              <Icon source="trending-up" size={14} color={colors.success} />
              <Text style={styles.trendText}>+8%</Text>
            </View>
          </Surface>
          <Surface style={styles.statMiniCard} elevation={1}>
            <Text style={styles.miniLabel}>New Clients</Text>
            <Text style={styles.miniValue}>+24</Text>
            <View style={styles.trendRow}>
              <Icon source="trending-up" size={14} color={colors.success} />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </Surface>
        </View>

        {/* Revenue Growth Chart */}
        <Surface style={styles.chartCard} elevation={1}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Revenue Trend</Text>
              <Text style={styles.chartSubtitle}>Monthly earnings in INR</Text>
            </View>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>+15.4%</Text>
            </View>
          </View>
          <LineChart
            data={{
              labels: analytics.monthlyRevenue.labels || [],
              datasets: [{ data: analytics.monthlyRevenue.data || [] }],
            }}
            width={screenWidth - 80}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
          />
        </Surface>

        {/* Service Breakdown */}
        <Surface style={styles.chartCard} elevation={1}>
          <Text style={styles.chartTitle}>Service Breakdown</Text>
          <Text style={styles.chartSubtitle}>Distribution by job category</Text>
          <PieChart
            data={(analytics.serviceDistribution || []).map((item: any) => ({
              ...item,
              color: item.name === 'Oil Change' ? '#4F46E5' :
                     item.name === 'Brake Repair' ? '#0EA5E9' :
                     item.name === 'Engine Work' ? '#6366F1' : '#94A3B8'
            }))}
            width={screenWidth - 72}
            height={180}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'0'}
            center={[10, 0]}
            absolute
          />
        </Surface>

        {/* Top Customers Leaderboard */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Customers</Text>
        </View>

        <Surface style={styles.leaderboardCard} elevation={1}>
          {(analytics.topCustomers || []).map((customer: any, index: number) => (
            <List.Item
              key={customer.id}
              title={customer.name}
              titleStyle={styles.customerName}
              description={`Total Billing: ${formatCurrency(customer.totalSpent)}`}
              descriptionStyle={styles.customerBilling}
              left={() => (
                <View style={styles.rankContainer}>
                  <Avatar.Text
                    size={40}
                    label={(index + 1).toString()}
                    style={{
                      backgroundColor: index === 0 ? colors.accent : colors.primaryLight
                    }}
                    labelStyle={{
                      color: index === 0 ? '#FFFFFF' : colors.primary,
                      fontWeight: '800'
                    }}
                  />
                </View>
              )}
              style={[
                styles.listItem,
                index === (analytics.topCustomers?.length || 0) - 1 && { borderBottomWidth: 0 }
              ]}
            />
          ))}
        </Surface>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
  },
  periodBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 5,
  },
  periodText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statMiniCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  growthBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rankContainer: {
    justifyContent: 'center',
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerBilling: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
});
