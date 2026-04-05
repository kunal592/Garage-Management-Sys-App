import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';

export const CustomerCardSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardHeader}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.cardHeaderText}>
        <Skeleton width="60%" height={20} style={{ marginBottom: 4 }} />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
    <View style={styles.cardBody}>
      <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="70%" height={16} borderRadius={4} />
    </View>
  </View>
);

export const CustomerListSkeleton = () => (
  <View style={{ padding: 20 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <CustomerCardSkeleton key={i} />
    ))}
  </View>
);

export const CustomerDetailSkeleton = () => (
  <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 20 }}>
    <View style={styles.detailHeader}>
      <Skeleton width={80} height={80} borderRadius={40} style={{ marginBottom: 16 }} />
      <Skeleton width="50%" height={24} style={{ marginBottom: 8 }} />
      <Skeleton width="30%" height={16} />
    </View>
    
    <View style={styles.section}>
      <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={100} borderRadius={12} />
    </View>
    
    <View style={styles.section}>
      <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
      {[1, 2].map(i => (
        <Skeleton key={i} width="100%" height={80} borderRadius={12} style={{ marginBottom: 12 }} />
      ))}
    </View>
  </ScrollView>
);

export const ServiceDetailSkeleton = () => (
  <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 20 }}>
    <Skeleton width="100%" height={400} borderRadius={24} style={{ marginBottom: 20 }} />
    <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 10 }} />
    <Skeleton width="100%" height={60} borderRadius={12} />
  </ScrollView>
);

export const DashboardSkeleton = () => (
  <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20 }}>
    <View style={{ marginTop: 40, marginBottom: 30 }}>
      <Skeleton width="60%" height={32} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={16} />
    </View>
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
      {[1, 2].map(i => (
        <Skeleton key={i} width="48%" height={110} borderRadius={24} />
      ))}
    </View>

    <View style={{ marginBottom: 32 }}>
      <Skeleton width="40%" height={24} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} width="22%" height={80} borderRadius={16} />
        ))}
      </View>
    </View>

    <View style={{ marginBottom: 32 }}>
      <Skeleton width="50%" height={24} style={{ marginBottom: 16 }} />
      {[1, 2, 3].map(i => (
        <Skeleton key={i} width="100%" height={90} borderRadius={20} style={{ marginBottom: 12 }} />
      ))}
    </View>
  </ScrollView>
);

export const ServiceListSkeleton = () => (
  <View style={{ padding: 20 }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} width="100%" height={100} borderRadius={16} style={{ marginBottom: 16 }} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  cardBody: {
    marginTop: 4,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
});
