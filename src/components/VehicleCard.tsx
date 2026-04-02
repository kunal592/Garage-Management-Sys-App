import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { colors } from '../theme/colors';
import { Vehicle } from '../data/types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBackground}>
            <Icon source="car-side" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.model}>{vehicle.model}</Text>
            <Text variant="bodySmall" style={styles.plateNumber}>{vehicle.vehicleNumber}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Icon source="calendar-clock" size={16} color={colors.textSecondary} />
            <Text variant="bodySmall" style={styles.lastServiceText}>
              Last Service: <Text style={styles.dateText}>{vehicle.lastServiceDate}</Text>
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
    shadowColor: colors.cardShadow as any,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  model: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16,
  },
  plateNumber: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastServiceText: {
    marginLeft: 6,
    color: colors.textSecondary,
  },
  dateText: {
    color: colors.text,
    fontWeight: '600',
  },
});

export default VehicleCard;
