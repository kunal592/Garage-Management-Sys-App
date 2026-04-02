import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Share, ActivityIndicator } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCustomers } from "../../src/hooks/useQueries";
import { colors } from "../../src/theme/colors";

export default function AlertsScreen() {
  const { data: customers = [], isLoading } = useCustomers();

  const upcomingServices = useMemo(() => {
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
              id: vehicle.id,
              customerName: customer.name,
              phone: customer.phone,
              vehicleModel: vehicle.model,
              vehicleNumber: vehicle.vehicleNumber || vehicle.number,
              serviceDate: vehicle.nextServiceDate
            });
          }
        }
      });
    });
    return reminders;
  }, [customers]);

  const handleSendReminder = async (reminder: any) => {
    const message = `Hello ${reminder.customerName},
Your vehicle service for ${reminder.vehicleModel} (${reminder.vehicleNumber}) is scheduled for tomorrow.
Please visit our garage for maintenance.
Thank you.`;
    
    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Service Alerts',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
        }}
      />
      <StatusBar barStyle="dark-content" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Upcoming Reminders</Text>
            <Text style={styles.headerSub}>Services due in the next 24 hours</Text>
          </View>

          {upcomingServices.length > 0 ? (
            upcomingServices.map((reminder, idx) => (
              <Surface key={idx} style={styles.alertCard} elevation={2}>
                <View style={styles.cardHeader}>
                  <View style={styles.vehicleInfo}>
                     <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="car-wrench" size={24} color={colors.primary} />
                     </View>
                     <View style={{ marginLeft: 12 }}>
                        <Text style={styles.vehicleName}>{reminder.vehicleModel}</Text>
                        <Text style={styles.vehicleNumber}>{reminder.vehicleNumber}</Text>
                     </View>
                  </View>
                  <View style={styles.tomorrowBadge}>
                    <Text style={styles.tomorrowText}>Tomorrow</Text>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.customerInfo}>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-circle-outline" size={18} color="#64748B" />
                    <Text style={styles.infoLabel}>{reminder.customerName}</Text>
                  </View>
                  <View style={[styles.infoRow, { marginTop: 4 }]}>
                    <MaterialCommunityIcons name="phone-outline" size={18} color="#64748B" />
                    <Text style={styles.infoLabel}>{reminder.phone}</Text>
                  </View>
                  <View style={[styles.infoRow, { marginTop: 4 }]}>
                    <MaterialCommunityIcons name="calendar-clock" size={18} color="#64748B" />
                    <Text style={styles.infoLabel}>Due: {new Date(reminder.serviceDate).toLocaleDateString()}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.sendBtn}
                  onPress={() => handleSendReminder(reminder)}
                >
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#FFFFFF" />
                  <Text style={styles.sendBtnText}>Send Reminder</Text>
                </TouchableOpacity>
              </Surface>
            ))
          ) : (
            <View style={styles.emptyState}>
               <MaterialCommunityIcons name="bell-off-outline" size={80} color="#E2E8F0" />
               <Text style={styles.emptyTitle}>All caught up!</Text>
               <Text style={styles.emptyText}>No services scheduled for tomorrow.</Text>
            </View>
          )}
          <View style={{ height: 110 }} />
        </ScrollView>
      )}
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
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  vehicleNumber: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  tomorrowBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tomorrowText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#F1F5F9',
  },
  customerInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginLeft: 8,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    height: 52,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
});
