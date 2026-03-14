import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  id: string;
  vehicle: string;
  customer: string;
  date: string;
  cost: string;
  service: string;
  status?: 'Pending' | 'Performed';
  isFirst?: boolean;
  onUpdateStatus?: (id: string) => void;
};

export default function RecentActivityCard({ id, vehicle, customer, date, cost, service, status, isFirst, onUpdateStatus }: Props) {
  const isPending = status === 'Pending';

  return (
    <Surface style={[styles.card, isFirst && styles.firstCard]} elevation={1}>
      <View style={styles.header}>
        <View style={styles.vehicleRow}>
          <Text style={styles.vehicle}>{vehicle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isPending ? '#FFF7ED' : '#F0FDFA', borderColor: isPending ? '#FDBA74' : '#2DD4BF' }]}>
            <MaterialCommunityIcons
                name={isPending ? "clock-outline" : "check-decagram"}
                size={14}
                color={isPending ? "#F59E0B" : "#2DD4BF"}
            />
            <Text style={[styles.statusText, { color: isPending ? "#F59E0B" : "#0D9488" }]}>{status || 'Performed'}</Text>
          </View>
        </View>
        <Text style={styles.cost}>₹{cost}</Text>
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
            <Text style={styles.details}>{customer} • {date}</Text>
            <Text style={styles.service} numberOfLines={1}>{service}</Text>
        </View>
        
        {isPending && onUpdateStatus && (
           <Button 
            mode="contained" 
            onPress={() => onUpdateStatus(id)}
            style={styles.actionBtn}
            labelStyle={styles.actionBtnLabel}
            buttonColor="#10B981"
           >
             Complete
           </Button>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  firstCard: {
    borderColor: '#2DD4BF',
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  cost: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  service: {
    fontSize: 13,
    color: '#94A3B8',
  },
  actionBtn: {
    height: 36,
    borderRadius: 10,
    marginLeft: 10,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginHorizontal: 8,
  }
});
