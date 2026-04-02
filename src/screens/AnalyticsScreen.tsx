import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { Text, Surface, List, Avatar, Icon } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAnalytics } from '../hooks/useQueries';

type Props = NativeStackScreenProps<RootStackParamList, 'Analytics'>;

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen: React.FC<Props> = () => {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading || !analytics) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Indigo 600
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForLabels: {
        fontSize: 10,
        fontWeight: '600'
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerSection}>
        <Text variant="headlineSmall" style={styles.header}>Performance</Text>
        <Surface style={styles.periodBadge}>
            <Text style={styles.periodText}>Last 6 Months</Text>
        </Surface>
      </View>

      {/* Revenue Chart */}
      <Surface style={styles.chartCard}>
        <View style={styles.chartHeader}>
            <View>
                <Text variant="titleMedium" style={styles.chartTitle}>Revenue Growth</Text>
                <Text variant="bodySmall" style={styles.chartSubtitle}>Monthly earnings in INR</Text>
            </View>
            <View style={styles.trendContainer}>
                <Icon source="trending-up" size={20} color={colors.success} />
                <Text style={styles.trendText}>+12%</Text>
            </View>
        </View>
        <LineChart
          data={{
            labels: analytics.monthlyRevenue?.labels || [],
            datasets: [{ data: analytics.monthlyRevenue?.data || [] }],
          }}
          width={screenWidth - 80}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      </Surface>

      {/* Service Distribution */}
      <Surface style={styles.chartCard}>
        <Text variant="titleMedium" style={styles.chartTitle}>Service Breakdown</Text>
        <Text variant="bodySmall" style={[styles.chartSubtitle, { marginBottom: 10 }]}>Distribution by job type</Text>
        <PieChart
          data={(analytics.serviceDistribution || []).map((item: any) => ({
              ...item,
              color: item.name === 'Oil Change' ? '#4F46E5' :
                     item.name === 'Brake Repair' ? '#0EA5E9' :
                     item.name === 'Engine Work' ? '#6366F1' : '#94A3B8'
          }))}
          width={screenWidth - 80}
          height={180}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'0'}
          center={[10, 0]}
          absolute
        />
      </Surface>

      {/* Top Customers */}
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Loyal Customers</Text>
      </View>
      <Surface style={styles.listCard}>
        {(analytics.topCustomers || []).map((customer: any, index: number) => (
          <List.Item
            key={customer.id}
            title={customer.name}
            titleStyle={styles.customerName as any}
            description={`Contribution: ${formatCurrency(customer.totalSpent)}`}
            descriptionStyle={styles.customerSpend as any}
            left={() => (
              <Avatar.Text
                size={44}
                label={(index + 1).toString()}
                style={{
                    backgroundColor: index === 0 ? colors.accent : colors.primaryLight,
                    marginRight: 10
                }}
                labelStyle={{ color: index === 0 ? '#FFF' : colors.primary, fontWeight: '700' }}
              />
            )}
            style={index === (analytics.topCustomers?.length || 0) - 1 ? styles.lastItem : styles.listItem}
          />
        ))}
      </Surface>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 10,
  },
  header: {
    fontWeight: '800',
    color: colors.text,
  },
  periodBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      elevation: 0,
  },
  periodText: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: 12,
  },
  chartCard: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    shadowColor: colors.cardShadow as any,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 18,
  },
  chartSubtitle: {
      color: colors.textSecondary,
      fontWeight: '500',
  },
  trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ECFDF5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  trendText: {
      color: colors.success,
      fontWeight: '700',
      fontSize: 12,
      marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16,
  },
  sectionHeader: {
      marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 18,
  },
  listCard: {
    borderRadius: 28,
    backgroundColor: colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lastItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
  },
  customerName: {
      fontWeight: '700',
      color: colors.text,
      fontSize: 16,
  },
  customerSpend: {
      color: colors.textSecondary,
      fontWeight: '500',
  },
});

export default AnalyticsScreen;
