import React from 'react';
import { View, StyleSheet, ScrollView, Linking, StatusBar } from 'react-native';
import { Text, Surface, Button, Icon, IconButton, Avatar } from 'react-native-paper';
import { colors } from '../theme/colors';
import { MOCK_DATA } from '../data/mockData';
import VehicleCard from '../components/VehicleCard';
import ServiceItem from '../components/ServiceItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerDetail'>;

const CustomerDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;
  const customer = MOCK_DATA.customers.find(c => c.id === customerId);

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

  const initials = customer.name.split(' ').map(n => n[0]).join('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Surface style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={initials}
              style={styles.avatarLarge}
              labelStyle={styles.avatarText}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.name}>{customer.name}</Text>
              <View style={styles.phoneRow}>
                <Icon source="phone-outline" size={16} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.phone}>{customer.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.addressSection}>
            <View style={styles.addressIconContainer}>
               <Icon source="map-marker-outline" size={20} color={colors.primary} />
            </View>
            <Text variant="bodyMedium" style={styles.address}>{customer.address}</Text>
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

        {/* Vehicles Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Registered Vehicles</Text>
          <IconButton
            icon="plus-circle-outline"
            iconColor={colors.primary}
            size={28}
            onPress={() => {}}
            style={{ margin: 0 }}
          />
        </View>
        {customer.vehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}

        {/* Service History Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Service History</Text>
          <Button
            mode="text"
            textColor={colors.primary}
            onPress={() => navigation.navigate('AddService', { customerId: customer.id })}
            labelStyle={{ fontWeight: '700' }}
          >
            Add New
          </Button>
        </View>
        <Surface style={styles.historyCard}>
          {customer.history.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
            />
          ))}
        </Surface>

        <View style={styles.footerActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Analytics')}
            style={styles.analyticsBtn}
            icon="chart-timeline-variant"
            buttonColor={colors.primary}
          >
            View Spending History
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    shadowColor: colors.cardShadow as any,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    backgroundColor: colors.primary,
    elevation: 4,
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
    lineHeight: 28,
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
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  addressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  address: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 18,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 4,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  footerActions: {
    marginBottom: 20,
  },
  analyticsBtn: {
    borderRadius: 16,
    paddingVertical: 6,
  },
});

export default CustomerDetailScreen;
