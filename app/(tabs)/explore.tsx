import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { formatCurrency } from '../../src/utils/helpers';
import { useServices } from '../../src/hooks/useQueries';
import { colors } from '../../src/theme/colors';

export default function ServiceHistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rawServices = [], isLoading } = useServices();

  // Map raw backend shape to display shape
  const allServices = useMemo(() => {
    return rawServices.map((s: any) => ({
      id: s.id,
      date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—',
      customerName: s.customer?.name || '—',
      vehicleModel: s.vehicle?.model || '—',
      vehicleNumber: s.vehicle?.vehicleNumber || '—',
      type: Array.isArray(s.serviceItems) ? s.serviceItems.join(', ') : 'Service',
      cost: s.totalCost ?? 0,
      parts: s.partsCost ?? 0,
      labour: s.serviceCost ?? 0,
      status: s.status || 'Pending',
      notes: s.notes || null,
    }));
  }, [rawServices]);

  const filteredServices = useMemo(() => {
    if (!searchQuery) return allServices;
    return allServices.filter((s: any) =>
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allServices, searchQuery]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1A3A3A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service History</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        <Surface style={styles.searchContainer} elevation={0}>
          <MaterialCommunityIcons name="magnify" size={24} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer, vehicle, or item..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Surface>

        {/* Services List */}
        {filteredServices.map((service: any, index: number) => (
          <View key={service.id} style={styles.timelineContainer}>
            {/* Timeline Line & Dot */}
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, index === 0 && { backgroundColor: '#2DD4BF' }]} />
              {index !== filteredServices.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Service Card */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={{ flex: 1 }} 
              onPress={() => router.push(`/services/${service.id}`)}
            >
              <Surface style={styles.serviceCard} elevation={1}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{service.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, service.status !== 'Performed' && { backgroundColor: '#F1F5F9' }]}>
                    <MaterialCommunityIcons
                      name={service.status === 'Performed' ? "check-circle-outline" : "clock-outline"}
                      size={14}
                      color={service.status === 'Performed' ? "#2DD4BF" : "#64748B"}
                    />
                    <Text style={[styles.statusText, service.status !== 'Performed' && { color: '#64748B' }]}>
                      {service.status}
                    </Text>
                  </View>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>{formatCurrency(service.cost)}</Text>
                  </View>
                </View>

                <Text style={styles.customerName}>{service.customerName}</Text>

                <Surface style={styles.vehicleBadge} elevation={0}>
                  <Text style={styles.vehicleText}>{service.vehicleModel} ({service.vehicleNumber})</Text>
                </Surface>

                <View style={styles.serviceItemRow}>
                  <MaterialCommunityIcons name="wrench-outline" size={18} color="#94A3B8" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.serviceDescription}>
                    {service.type}
                  </Text>
                </View>

                <View style={styles.costBreakdownRow}>
                  <Text style={styles.costLabel}>Parts: <Text style={styles.costValue}>{formatCurrency(service.parts)}</Text></Text>
                  <Text style={styles.costLabel}>Labour: <Text style={styles.costValue}>{formatCurrency(service.labour)}</Text></Text>
                </View>

                {service.notes && (
                  <Surface style={styles.noteContainer} elevation={0}>
                    <Text style={styles.noteText}>Note: {service.notes}</Text>
                  </Surface>
                )}

                <TouchableOpacity 
                  style={styles.invoiceBtn} 
                  onPress={(e) => {
                    e.stopPropagation();
                    alert('Downloading Invoice...');
                  }}
                >
                  <MaterialCommunityIcons name="download-outline" size={20} color="#1A3A3A" style={{ marginRight: 8 }} />
                  <Text style={styles.invoiceBtnText}>Download Invoice</Text>
                </TouchableOpacity>
              </Surface>
            </TouchableOpacity>
          </View>
        ))}

        {filteredServices.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#64748B', fontSize: 16 }}>No services found</Text>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1A3A3A',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  timelineContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    marginTop: 14,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 26,
    bottom: -20,
    width: 2,
    backgroundColor: '#F1F5F9',
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A3A3A',
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    marginLeft: 4,
  },
  priceBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  vehicleBadge: {
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  vehicleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  serviceItemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceDescription: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
  },
  costBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  costValue: {
    color: '#1E293B',
    fontWeight: '700',
  },
  noteContainer: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    height: 44,
    borderRadius: 12,
  },
  invoiceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3A3A',
  },
});
