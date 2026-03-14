import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Text, Surface, DataTable, Searchbar, IconButton } from 'react-native-paper';
import { useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGarage } from "../../src/hooks/useGarage";
import { colors } from "../../src/theme/colors";
import { formatCurrency } from "../../src/utils/helpers";

export default function PartsPriceList() {
  const router = useRouter();
  const { parts } = useGarage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Parts Price List',
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

      <View style={styles.container}>
        <Searchbar
          placeholder="Search parts, category, brand..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          elevation={1}
        />

        <Surface style={styles.tableCard} elevation={2}>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title textStyle={styles.headerText}>Part Name</DataTable.Title>
              <DataTable.Title textStyle={styles.headerText}>Category</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.headerText}>Price</DataTable.Title>
            </DataTable.Header>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '85%' }}>
              {filteredParts.map((part) => (
                <DataTable.Row key={part.id} style={styles.row}>
                  <DataTable.Cell>
                    <View>
                      <Text style={styles.partName}>{part.name}</Text>
                      {part.brand && <Text style={styles.brandText}>{part.brand}</Text>}
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.categoryText}>{part.category}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.priceText}>{formatCurrency(part.price)}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
              
              {filteredParts.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No parts found matching "{searchQuery}"</Text>
                </View>
              )}
            </ScrollView>
          </DataTable>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerText: {
    fontWeight: '800',
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  row: {
    minHeight: 64,
    borderBottomColor: '#F1F5F9',
  },
  partName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  brandText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  }
});
