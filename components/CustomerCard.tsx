import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar, IconButton, Surface } from 'react-native-paper';
import { colors } from '../src/theme/colors';

type Props = {
  name: string;
  phone: string;
  vehicle: string;
  lastService: string;
  onPress?: () => void;
};

const CustomerCard: React.FC<Props> = ({
  name,
  phone,
  vehicle,
  lastService,
  onPress,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Surface style={styles.card} elevation={0}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.content}>
        <Avatar.Text
          size={52}
          label={initials}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.name}>{name}</Text>
          <Text variant="bodySmall" style={styles.phone}>{phone}</Text>
          <View style={styles.tagRow}>
             <View style={styles.tag}>
                <Text style={styles.tagText}>{vehicle}</Text>
             </View>
             <Text variant="bodySmall" style={styles.serviceDate}>Last: {lastService}</Text>
          </View>
        </View>
        <IconButton
          icon="chevron-right"
          size={22}
          iconColor={colors.textSecondary}
          style={styles.chevron}
        />
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
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
    fontSize: 18,
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
    marginBottom: 8,
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  serviceDate: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  chevron: {
    marginRight: -8,
  }
});

export default CustomerCard;
