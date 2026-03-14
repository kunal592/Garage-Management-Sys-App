import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Text, Surface, Button, Icon, Avatar } from 'react-native-paper';
import { colors } from '../theme/colors';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGarage } from '../hooks/useGarage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { stats, recentActivity } = useGarage();

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text variant="bodyMedium" style={styles.dateText}>Monday, 20 Nov</Text>
            <Text variant="headlineSmall" style={styles.welcomeText}>Garage Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Avatar.Icon size={40} icon="account" style={{ backgroundColor: colors.primaryLight }} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.row}>
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers.toString()}
              icon="account-group"
              color={colors.primary}
            />
            <StatCard
              title="Total Vehicles"
              value={stats.totalVehicles.toString()}
              icon="car-multiple"
              color={colors.secondary}
            />
          </View>
          <View style={styles.row}>
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(stats.todayRevenue)}
              icon="currency-inr"
              color={colors.success}
            />
            <StatCard
              title="Services Today"
              value={stats.todayServices.toString()}
              icon="wrench-clock"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('CustomerList')}
          >
            <Surface style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}>
              <Icon source="account-plus" size={24} color="#7C3AED" />
            </Surface>
            <Text variant="labelSmall" style={styles.actionLabel}>Add Client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('AddService', {})}
          >
            <Surface style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
              <Icon source="wrench-plus" size={24} color="#EA580C" />
            </Surface>
            <Text variant="labelSmall" style={styles.actionLabel}>Add Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('CustomerList')}
          >
            <Surface style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}>
              <Icon source="card-account-details" size={24} color="#0284C7" />
            </Surface>
            <Text variant="labelSmall" style={styles.actionLabel}>Directory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Surface style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Icon source="chart-box" size={24} color="#059669" />
            </Surface>
            <Text variant="labelSmall" style={styles.actionLabel}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Recent Activity</Text>
          <Button mode="text" labelStyle={{ color: colors.primary }} onPress={() => navigation.navigate('CustomerList')}>View All</Button>
        </View>

        <Surface style={styles.activityCard}>
          {recentActivity.map((activity: any) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                activity.id === recentActivity[recentActivity.length - 1].id && { borderBottomWidth: 0 }
              ]}
              onPress={() => navigation.navigate('CustomerDetail', { customerId: '1' })}
            >
              <View style={styles.activityIconCircle}>
                 <MaterialCommunityIcons
                    name={activity.status === 'Pending' ? "clock-outline" : "check-decagram"}
                    size={20}
                    color={activity.status === 'Pending' ? colors.warning : colors.success}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text variant="titleSmall" style={styles.activityCustomer}>{activity.customer}</Text>
                <Text variant="bodySmall" style={styles.activityType}>{activity.type}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text variant="titleSmall" style={styles.activityCost}>{formatCurrency(activity.cost)}</Text>
                <Text variant="bodySmall" style={styles.activityTime}>{activity.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {recentActivity.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text variant="bodySmall">No recent activity</Text>
            </View>
          )}
        </Surface>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  welcomeText: {
    fontWeight: '800',
    color: colors.text,
  },
  dateText: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileButton: {
    elevation: 0,
  },
  statsContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  actionLabel: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 8,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityCustomer: {
    fontWeight: '700',
    color: colors.text,
  },
  activityType: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityCost: {
    fontWeight: '700',
    color: colors.text,
  },
  activityTime: {
    color: colors.textSecondary,
    fontSize: 10,
  },
});

export default HomeScreen;
