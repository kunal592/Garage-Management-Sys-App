import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: `${color || colors.primary}10` }]}>
            <Icon source={icon || 'chart-bar'} size={22} color={color || colors.primary} />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleLarge" style={styles.value}>{value}</Text>
          <Text variant="labelMedium" style={styles.title}>{title}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 16,
    marginHorizontal: 4,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
    shadowColor: colors.cardShadow as any,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 4,
  },
  value: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 22,
  },
  title: {
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

export default StatCard;
