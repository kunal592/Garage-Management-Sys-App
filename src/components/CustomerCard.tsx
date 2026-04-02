import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Avatar, IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';
import { Customer } from '../data/types';

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onPress }) => {
  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <Avatar.Text
          size={52}
          label={initials}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.name}>{customer.name}</Text>
          <Text variant="bodySmall" style={styles.phone}>{customer.phone}</Text>
          <View style={styles.tagRow}>
             <View style={styles.tag}>
                <Text style={styles.tagText}>{customer.vehicles[0]?.model}</Text>
             </View>
          </View>
        </View>
        <IconButton
          icon="chevron-right"
          size={22}
          iconColor={colors.textSecondary}
          style={styles.chevron}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow as any,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 17,
  },
  phone: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  chevron: {
    marginRight: -8,
  }
});

export default CustomerCard;
