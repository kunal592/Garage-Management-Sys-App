import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../theme/colors';
import { formatCurrency, getStatusColor } from '../utils/helpers';
import { ServiceHistory } from '../data/mockData';

interface ServiceItemProps {
  service: ServiceHistory;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const statusColor = getStatusColor(service.status);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${statusColor}10` }]}>
        <Icon
          source={service.type.toLowerCase().includes('oil') ? 'oil' : 'wrench'}
          size={20}
          color={statusColor}
        />
      </View>
      <View style={styles.details}>
        <Text variant="titleSmall" style={styles.type}>{service.type}</Text>
        <Text variant="bodySmall" style={styles.date}>{service.date}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text variant="titleMedium" style={styles.cost}>{formatCurrency(service.cost)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {service.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  type: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 15,
  },
  date: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  cost: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ServiceItem;
