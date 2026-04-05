import React from 'react';
import { View, StyleSheet, ScrollView, Linking, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Surface, Button, Avatar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";
import { useCustomerDetail } from "../../src/hooks/useQueries";
import { CustomerDetailSkeleton } from "../../src/components/SkeletonLoaders";

export default function CustomerDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // TanStack Query Hook
  const { data: customer, isLoading } = useCustomerDetail(id as string);

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (!customer) {
    return (
      <View style={styles.center}>
        <Text>Customer not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${customer.phone}`);
  };

  const initials = customer.name.split(' ').map((n: string) => n[0]).join('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Surface style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={initials}
              style={[styles.avatarLarge, { backgroundColor: colors.primary }]}
              labelStyle={styles.avatarText}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.name}>{customer.name}</Text>
              <View style={styles.phoneRow}>
                <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.phone}>{customer.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="phone"
              onPress={handleCall}
              style={styles.actionButton}
              buttonColor={colors.success}
              labelStyle={styles.buttonLabel}
            >
              Call Now
            </Button>
            <Button
              mode="outlined"
              icon="message-outline"
              onPress={() => {}}
              style={[styles.actionButton, { borderColor: colors.primary }]}
              textColor={colors.primary}
              labelStyle={styles.buttonLabel}
            >
              SMS
            </Button>
          </View>
        </Surface>

        {/* Vehicle Section */}
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        {customer.vehicles?.map((vehicle: any) => (
          <Surface key={vehicle.id} style={[styles.detailCard, { backgroundColor: colors.surface }]}>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="car" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.detailLabel}>Model</Text>
                  <Text style={styles.detailValue}>{vehicle.model}</Text>
                  <Text style={styles.detailSubValue}>{vehicle.vehicleNumber || vehicle.number}</Text>
                </View>
            </View>
          </Surface>
        ))}

        {/* History Section */}
        <Text style={styles.sectionTitle}>Service History</Text>
        {customer.history?.map((item: any) => (
          <Surface key={item.id} style={styles.detailCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyCost}>₹{item.cost}</Text>
            </View>
            <Text style={styles.historyType}>{item.type}</Text>
            {item.notes && <Text style={styles.historyNotes}>Note: {item.notes}</Text>}
          </Surface>
        ))}

        <Button
          mode="contained"
          onPress={() => router.push(`/explore?customerId=${customer.id}`)}
          style={styles.historyBtn}
          buttonColor="#2DD4BF"
        >
          View Full History
        </Button>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.surface,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 28,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 22,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phone: {
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 14,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  detailCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  detailSubValue: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  historyCost: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  historyType: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  historyNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  historyBtn: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 6,
  }
});
