import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { colors } from '../theme/colors';
import CustomerCard from '../components/CustomerCard';
import SearchBar from '../components/SearchBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCustomers } from '../hooks/useQueries';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerList'>;

const CustomerListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // TanStack Query Hook
  const { data: customers = [], isLoading, refetch, isRefetching } = useCustomers();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter((customer: any) =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(searchQuery) ||
      customer.vehicles?.some((v: any) => v.model.toLowerCase().includes(query)) ||
      customer.vehicles?.some((v: any) => v.vehicleNumber?.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search name, phone or vehicle..."
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {searchQuery ? 'No matching customers found' : 'No customers in directory'}
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CustomerList')} // Should probably go to AddCustomer if available
        label="Add Customer"
        color="#FFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 10,
    backgroundColor: colors.primary,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.primary as any,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CustomerListScreen;
