import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title: string;
  value: string;
  icon?: string;
  trend?: string;
  color?: string;
};

export default function StatCard({ title, value, icon, trend, color }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            {icon && <MaterialCommunityIcons name={icon as any} size={24} color={color || '#1B4D3E'} />}
        </View>
        {trend && (
            <View style={styles.trendBadge}>
                <Text style={[styles.trendText, { color: color || '#2DD4BF' }]}>{trend}</Text>
            </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color: color || '#1B4D3E' }]}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 24,
    margin: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    marginTop: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
  },
  title: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: '600',
    marginTop: 2,
  },
});