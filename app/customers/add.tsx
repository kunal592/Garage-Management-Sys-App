import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Surface, Divider } from 'react-native-paper';
import { useGarage } from '../../src/hooks/useGarage';
import { Customer } from '../../src/data/mockData';

const VEHICLE_TYPES = ['Car', 'Bike', 'Truck', 'Van'];

export default function AddCustomerScreen() {
  const router = useRouter();
  const { addCustomer } = useGarage();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please enter at least the customer name and phone number.');
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      phone,
      address,
      vehicles: vehicleModel ? [{
        id: 'v' + Date.now().toString(),
        model: vehicleModel,
        number: vehicleNumber,
        lastService: 'New Customer'
      }] : [],
      history: [],
    };

    addCustomer(newCustomer);

    Alert.alert('Success', 'Customer added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add Customer',
          headerStyle: { backgroundColor: '#145A4A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '800' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <StatusBar barStyle="light-content" backgroundColor="#145A4A" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* Card 1: Customer Details */}
          <Surface style={styles.card} elevation={2}>
            <Text style={styles.cardTitle}>Customer Details</Text>
            <Divider style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <Ionicons name="location-outline" size={20} color="#64748B" style={[styles.inputIcon, { marginTop: 12 }]} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="123 Main St, City"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>
          </Surface>

          {/* Card 2: Vehicle Details */}
          <Surface style={styles.card} elevation={2}>
            <Text style={styles.cardTitle}>Vehicle Details (Optional)</Text>
            <Divider style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="car-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ABC-1234"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Model</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="construct-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Toyota Camry"
                  placeholderTextColor="#94A3B8"
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Ionicons name="layers-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <Text style={[styles.input, { paddingTop: 14, color: vehicleType ? '#0F172A' : '#94A3B8' }]}>
                  {vehicleType}
                </Text>
                <Ionicons
                  name={showTypeDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#64748B"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>

              {showTypeDropdown && (
                <View style={styles.dropdown}>
                  {VEHICLE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setVehicleType(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, vehicleType === type && styles.activeDropdownText]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </Surface>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Save Customer</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  divider: {
    marginBottom: 20,
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
  },
  textAreaWrapper: {
    height: 100,
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  textArea: {
    paddingTop: 12,
    height: '100%',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginTop: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#64748B',
  },
  activeDropdownText: {
    color: '#145A4A',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#145A4A',
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#145A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
