import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Share, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import StatCard from "../../components/StatCard";
import QuickActionButton from "../../components/QuickActionButton";
import RecentActivityCard from "../../components/RecentActivityCard";
import { formatCurrency } from "../../src/utils/helpers";
import { useStats, useRecentActivity, useCustomers, useUpdateServiceStatus } from '../../src/hooks/useQueries';
import { colors } from '../../src/theme/colors';
import { DashboardSkeleton } from '../../src/components/SkeletonLoaders';

export default function Dashboard() {
  const router = useRouter();
  
  // TanStack Query Hooks
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: customers } = useCustomers();
  const updateStatusMutation = useUpdateServiceStatus();

  const serviceReminders = useMemo(() => {
    if (!customers) return [];
    
    const reminders: any[] = [];
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(now.getHours() + 24);

    customers.forEach((customer: any) => {
      customer.vehicles?.forEach((vehicle: any) => {
        if (vehicle.nextServiceDate) {
          const serviceDate = new Date(vehicle.nextServiceDate);
          if (serviceDate >= now && serviceDate <= tomorrow) {
            reminders.push({
              customerName: customer.name,
              phone: customer.phone,
              vehicleModel: vehicle.model,
              vehicleNumber: vehicle.vehicleNumber || vehicle.number,
              serviceDate: new Date(vehicle.nextServiceDate).toLocaleDateString()
            });
          }
        }
      });
    });
    return reminders;
  }, [customers]);

  const handleSendReminder = async (reminder: any) => {
    const message = `Hello ${reminder.customerName},
Your vehicle service for ${reminder.vehicleModel} (${reminder.vehicleNumber}) is scheduled for ${reminder.serviceDate}.
Please visit us for your scheduled maintenance.
Thank you.`;
    
    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (statsLoading || activityLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Top Header / Welcome */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>Garage Manager</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/customers')}
            >
               <MaterialCommunityIcons name="account-group" size={24} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/services/add')}
            >
               <MaterialCommunityIcons name="wrench" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Reminders Section */}
        {serviceReminders.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeaderTitle}>🚨 Upcoming Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.remindersScroll}>
              {serviceReminders.map((reminder, idx) => (
                <View key={idx} style={styles.reminderCard}>
                  <View style={styles.reminderHeader}>
                    <MaterialCommunityIcons name="bell-ring" size={20} color="#F59E0B" />
                    <Text style={styles.reminderTitle}>Scheduled Soon</Text>
                  </View>
                  <Text style={styles.remCustName}>{reminder.customerName}</Text>
                  <Text style={styles.remVehInfo}>{reminder.vehicleModel} • {reminder.vehicleNumber}</Text>
                  <Text style={styles.remDateInfo}>Date: {reminder.serviceDate}</Text>
                  
                  <TouchableOpacity 
                    style={styles.sendRemBtn} 
                    onPress={() => handleSendReminder(reminder)}
                  >
                    <MaterialCommunityIcons name="share-variant" size={18} color="#FFFFFF" />
                    <Text style={styles.sendRemText}>Send Reminder</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Stats Section */}
        {stats && (
          <View style={styles.statsRow}>
            <StatCard
              title="Today Revenue"
              value={formatCurrency(stats.todayRevenue)}
              icon="currency-inr"
              trend="+12%"
              color="#2DD4BF"
            />
            <StatCard
              title="Services"
              value={stats.todayServices.toString()}
              icon="wrench-clock"
              trend="+5"
              color="#6366F1"
            />
          </View>
        )}

        {/* Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              title="Add Cust"
              icon="account-plus-outline"
              onPress={() => router.push('/customers/add')}
            />
            <QuickActionButton
              title="Add Service"
              icon="wrench-outline"
              onPress={() => router.push('/services/add')}
            />
            <QuickActionButton
              title="Customers"
              icon="account-group-outline"
              onPress={() => router.push('/customers')}
            />
            <QuickActionButton
              title="Analytics"
              icon="chart-bar"
              onPress={() => router.push('/analytics')}
            />
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push('/explore')}>
              <Text style={styles.view_all_text}>View All</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#2DD4BF" />
            </TouchableOpacity>
          </View>

          {recentActivity?.map((activity: any, index: number) => (
            <TouchableOpacity key={activity.id} onPress={() => router.push(`/services/${activity.id}`)}>
              <RecentActivityCard
                id={activity.id}
                vehicle={activity.vehicle}
                customer={activity.customer}
                date={activity.time}
                cost={activity.cost.toString()}
                service={activity.type}
                status={activity.status}
                isFirst={index === 0}
                onUpdateStatus={(id) => updateStatusMutation.mutate({ id, status: 'Performed' })}
              />
            </TouchableOpacity>
          ))}

          {(!recentActivity || recentActivity.length === 0) && (
            <Text style={styles.emptyText}>No recent activity</Text>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  dateText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
  },
  headerIconsRow: {
    flexDirection: 'row',
  },
  headerIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginLeft: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view_all_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2DD4BF",
    marginRight: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
    fontStyle: 'italic',
  },
  remindersScroll: {
    marginTop: 8,
    marginBottom: 10,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    width: 280,
    padding: 20,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  remCustName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  remVehInfo: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  remDateInfo: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  sendRemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 14,
  },
  sendRemText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
});
