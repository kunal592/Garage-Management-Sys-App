import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';

type Props = {
  title: string;
  icon: string;
  onPress: () => void;
};

export default function QuickActionButton({ title, icon, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <Surface style={styles.card} elevation={1}>
        <MaterialCommunityIcons name={icon as any} size={30} color="#1E4D3E" />
        <Text style={styles.title}>{title}</Text>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '23%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
  },
});
