import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface, List, Divider, Avatar, IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGarage } from '../hooks/useGarage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

interface ServiceItem {
  id: string;
  name: string;
  price: string;
}

const AddServiceScreen: React.FC<Props> = ({ route, navigation }) => {
  const { getCustomerByPhone, addService } = useGarage();

  // Search State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<any>(null);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([{ id: '1', name: '', price: '' }]);
  const [labourCost, setLabourCost] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Performed' | 'Pending'>('Performed');

  // Auto-suggest logic
  useEffect(() => {
    if (phoneNumber.length >= 10) {
      const customer = getCustomerByPhone(phoneNumber);
      if (customer) {
        setFoundCustomer(customer);
        setSelectedVehicleId(customer.vehicles[0]?.id || '');
      } else {
        setFoundCustomer(null);
      }
    } else {
        setFoundCustomer(null);
    }
  }, [phoneNumber, getCustomerByPhone]);

  const totalPartsCost = useMemo(() => {
    return items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  }, [items]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', price: '' }]);
  };

  const updateItem = (id: string, field: keyof ServiceItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (!foundCustomer || !selectedVehicleId) {
      Alert.alert('Selection Required', 'Please find a customer by phone number and select a vehicle.');
      return;
    }

    if (items.some(i => !i.name)) {
      Alert.alert('Incomplete Info', 'Please provide a name for all service items.');
      return;
    }

    const labour = parseFloat(labourCost) || 0;
    const total = totalPartsCost + labour;

    const newService = {
      id: Math.random().toString(36).substr(2, 9),
      type: items.map(i => i.name).filter(Boolean).join(', '),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      cost: total,
      parts: totalPartsCost,
      labour: labour,
      status: status,
      notes: notes,
    };

    addService(foundCustomer.id, selectedVehicleId, newService);
    Alert.alert('Success', 'Service Record Added Successfully!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Customer Search Section */}
        <Surface style={styles.formCard} elevation={1}>
          <Text variant="titleMedium" style={styles.label}>Find Customer</Text>
          <TextInput
            mode="outlined"
            label="Phone Number"
            placeholder="Search by 10 digits"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            outlineStyle={{ borderRadius: 12 }}
            left={<TextInput.Icon icon="phone" color={colors.textSecondary} />}
          />

          {foundCustomer ? (
            <View style={styles.foundBox}>
              <View style={styles.customerRow}>
                <Avatar.Text
                    size={40}
                    label={foundCustomer.name[0]}
                    style={{ backgroundColor: colors.primaryLight }}
                    labelStyle={{ color: colors.primary, fontWeight: '700' }}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700' }}>{foundCustomer.name}</Text>
                  <Text variant="bodySmall" style={{ color: colors.textSecondary }}>{foundCustomer.phone}</Text>
                </View>
              </View>

              <Text variant="labelMedium" style={[styles.label, { marginTop: 15, marginBottom: 5 }]}>Select Vehicle</Text>
              {foundCustomer.vehicles.map((v: any) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.vehicleBtn, selectedVehicleId === v.id && styles.vehicleBtnActive]}
                  onPress={() => setSelectedVehicleId(v.id)}
                >
                  <MaterialCommunityIcons name="car" size={20} color={selectedVehicleId === v.id ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.vehicleBtnText, selectedVehicleId === v.id && { color: colors.primary, fontWeight: '700' }]}>
                    {v.model} ({v.number})
                  </Text>
                  {selectedVehicleId === v.id && (
                     <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : phoneNumber.length >= 10 && (
            <TouchableOpacity
                style={styles.notFoundLink}
                onPress={() => navigation.navigate('CustomerList' as any)}
            >
              <MaterialCommunityIcons name="account-plus" size={20} color={colors.danger} />
              <Text style={styles.notFoundText}>Customer not found. Create new customer?</Text>
            </TouchableOpacity>
          )}
        </Surface>

        {/* Service Items Section */}
        <Surface style={styles.formCard} elevation={1}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.label}>Service Items & Parts</Text>
            <TouchableOpacity onPress={addItem} style={styles.addItemBtn}>
                <MaterialCommunityIcons name="plus-circle" size={20} color={colors.primary} />
                <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <TextInput
                mode="outlined"
                placeholder="Item (e.g. Oil)"
                value={item.name}
                onChangeText={(v) => updateItem(item.id, 'name', v)}
                style={{ flex: 2, marginRight: 8 }}
                outlineStyle={{ borderRadius: 10 }}
              />
              <TextInput
                mode="outlined"
                placeholder="₹"
                keyboardType="numeric"
                value={item.price}
                onChangeText={(v) => updateItem(item.id, 'price', v)}
                style={{ flex: 1 }}
                outlineStyle={{ borderRadius: 10 }}
              />
              {items.length > 1 && (
                <IconButton
                    icon="close-circle"
                    iconColor={colors.danger}
                    onPress={() => removeItem(item.id)}
                    size={20}
                />
              )}
            </View>
          ))}

          <Divider style={{ marginVertical: 15, backgroundColor: colors.border }} />

          <View style={styles.costGrid}>
            <View style={{ flex: 1, marginRight: 8 }}>
               <Text variant="labelSmall" style={styles.label}>Total Parts</Text>
               <TextInput
                  mode="outlined"
                  value={totalPartsCost.toString()}
                  editable={false}
                  style={styles.readOnlyInput}
                  outlineStyle={{ borderRadius: 10 }}
               />
            </View>
            <View style={{ flex: 1 }}>
               <Text variant="labelSmall" style={styles.label}>Labour Cost</Text>
               <TextInput
                  mode="outlined"
                  value={labourCost}
                  onChangeText={setLabourCost}
                  keyboardType="numeric"
                  placeholder="₹ 0"
                  outlineStyle={{ borderRadius: 10 }}
               />
            </View>
          </View>

          <View style={[styles.inputGroup, { marginTop: 15 }]}>
            <Text variant="labelSmall" style={styles.label}>Notes</Text>
            <TextInput
              mode="outlined"
              placeholder="Internal notes..."
              multiline
              value={notes}
              onChangeText={setNotes}
              outlineStyle={{ borderRadius: 10 }}
              style={{ height: 80 }}
            />
          </View>
        </Surface>

        {/* Status Selection */}
        <Surface style={styles.formCard} elevation={1}>
          <Text variant="titleMedium" style={styles.label}>Service Status</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
                style={[styles.statusToggle, status === 'Performed' && styles.statusToggleActive]}
                onPress={() => setStatus('Performed')}
            >
                <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={status === 'Performed' ? '#FFF' : colors.textSecondary}
                />
                <Text style={[styles.statusToggleText, status === 'Performed' && { color: '#FFF' }]}>Performed</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.statusToggle, status === 'Pending' && styles.statusTogglePending]}
                onPress={() => setStatus('Pending')}
            >
                <MaterialCommunityIcons
                    name="clock"
                    size={20}
                    color={status === 'Pending' ? '#FFF' : colors.textSecondary}
                />
                <Text style={[styles.statusToggleText, status === 'Pending' && { color: '#FFF' }]}>Pending</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveBtn}
            contentStyle={{ height: 54 }}
            labelStyle={{ fontSize: 16, fontWeight: '800' }}
            disabled={!foundCustomer || items.some(i => !i.name)}
        >Confirm Service</Button>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  formCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  label: { fontWeight: '700', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.surface },
  inputGroup: { marginBottom: 10 },
  readOnlyInput: { backgroundColor: '#F8FAFC' },
  foundBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2DD4BF'
  },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  vehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  vehicleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  vehicleBtnText: { marginLeft: 10, color: colors.textSecondary, fontSize: 13 },
  notFoundLink: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3'
  },
  notFoundText: { marginLeft: 8, color: colors.danger, fontWeight: '600', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  addItemBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, padding: 8, borderRadius: 10 },
  addItemText: { marginLeft: 5, color: colors.primary, fontWeight: '700', fontSize: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  costGrid: { flexDirection: 'row' },
  statusRow: { flexDirection: 'row', marginTop: 8 },
  statusToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4
  },
  statusToggleActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  statusTogglePending: {
    backgroundColor: colors.warning,
    borderColor: colors.warning
  },
  statusToggleText: {
    marginLeft: 8,
    fontWeight: '700',
    color: colors.textSecondary
  },
  saveBtn: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
});

export default AddServiceScreen;
