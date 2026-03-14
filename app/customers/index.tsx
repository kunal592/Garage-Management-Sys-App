import React, { useState } from "react";
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity, TextInput } from "react-native";
import { Text, FAB, Surface } from "react-native-paper";
import { useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomerCard from "../../components/CustomerCard";
import { useGarage } from "../../src/hooks/useGarage";
import { colors } from "../../src/theme/colors";

export default function Customers() {
  const router = useRouter();
  const { customers } = useGarage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.vehicles.some(v => v.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Customer Directory',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
              <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Modern Pill-Shaped Search Bar */}
        <Surface style={styles.searchContainer} elevation={0}>
          <MaterialCommunityIcons name="magnify" size={24} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone or car..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Surface>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{filteredCustomers.length} Total Customers</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialCommunityIcons name="filter-variant" size={20} color={colors.primary} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard
              name={item.name}
              phone={item.phone}
              vehicle={item.vehicles[0]?.model || 'N/A'}
              lastService={item.vehicles[0]?.lastService || 'Never'}
              onPress={() => router.push(`/customers/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-search-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyText}>No customers found</Text>
              <Text style={styles.emptySubText}>Try searching with a different name or phone number</Text>
            </View>
          }
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/customers/add")}
        color="#FFF"
        label="Add Customer"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 20,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#475569",
    fontWeight: "800",
    fontSize: 18,
    marginTop: 10,
  },
  emptySubText: {
    color: "#94A3B8",
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 40,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 16,
    elevation: 4,
  },
});
