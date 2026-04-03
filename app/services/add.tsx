import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { useAddCustomer, useAddService, useCustomers, useParts, useAddVehicle } from '../../src/hooks/useQueries';
import { colors } from '../../src/theme/colors';

interface ListItem {
  id: string;
  name: string;
  price: string;
}

export default function AddServiceScreen() {
  const router = useRouter();

  // TanStack Query Hooks
  const { data: customers = [] } = useCustomers();
  const { data: parts = [] } = useParts();
  const addCustomerMutation = useAddCustomer();
  const addServiceMutation = useAddService();

  // Search & Found State
  const addVehicleMutation = useAddVehicle();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // New Customer/Vehicle State (if not found)
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Form State
  const [serviceItems, setServiceItems] = useState<ListItem[]>([{ id: 's1', name: '', price: '' }]);
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: number }>({}); // partId -> quantity
  const [customParts, setCustomParts] = useState<ListItem[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Performed' | 'Pending'>('Performed');
  const [nextServiceDate, setNextServiceDate] = useState('');

  const partsByCategory = useMemo(() => {
    const categories: { [key: string]: any[] } = {};
    parts.forEach((part: any) => {
      if (!categories[part.category]) categories[part.category] = [];
      categories[part.category].push(part);
    });
    return categories;
  }, [parts]);

  // Auto-suggest logic
  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const customer = customers.find((c: any) => c.phone.replace(/\D/g, '').includes(cleanPhone));
      if (customer) {
        setFoundCustomer(customer);
        setSelectedVehicleId(customer.vehicles?.[0]?.id || '');
        setIsNewCustomer(false);
      } else {
        setFoundCustomer(null);
        setIsNewCustomer(true);
      }
    } else {
      setFoundCustomer(null);
      setIsNewCustomer(false);
    }
  }, [phoneNumber, customers]);

  const totalLabourCost = useMemo(() => {
    return serviceItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  }, [serviceItems]);

  const totalPartsCost = useMemo(() => {
    const masterPartsTotal = Object.keys(selectedParts).reduce((sum, partId) => {
      const part = parts.find((p: any) => p.id === partId);
      return sum + (part ? part.price * selectedParts[partId] : 0);
    }, 0);
    const customPartsTotal = customParts.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    return masterPartsTotal + customPartsTotal;
  }, [selectedParts, customParts, parts]);

  const totalCost = totalLabourCost + totalPartsCost;

  const addServiceItem = () => {
    setServiceItems([...serviceItems, { id: Math.random().toString(), name: '', price: '' }]);
  };

  const updateItem = (list: ListItem[], setList: (l: ListItem[]) => void, id: string, field: keyof ListItem, value: string) => {
    setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (list: ListItem[], setList: (l: ListItem[]) => void, id: string) => {
    if (list.length > 1) setList(list.filter(item => item.id !== id));
  };

  const setShortcutDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setNextServiceDate(d.toISOString().split('T')[0]); // Use YYYY-MM-DD for reliable parsing
  };

  const handleSave = async () => {
    let finalCustomerId = foundCustomer?.id;
    let finalVehicleId = selectedVehicleId;

    // Validation for existing customer
    if (!isNewCustomer && !foundCustomer) {
      Alert.alert('Selection Required', 'Please find a customer by phone number.');
      return;
    }

    if (!isNewCustomer && foundCustomer && !isAddingNewVehicle && !selectedVehicleId) {
      Alert.alert('Selection Required', 'Please select a vehicle or add a new one.');
      return;
    }

    if (!isNewCustomer && foundCustomer && isAddingNewVehicle) {
      if (!newVehicleModel || !newVehicleNumber) {
        Alert.alert('Info Required', 'Please fill in Vehicle Model and Vehicle Number.');
        return;
      }
      try {
        const newVehicle = await addVehicleMutation.mutateAsync({
          customerId: foundCustomer.id,
          data: {
            model: newVehicleModel.trim(),
            vehicleNumber: newVehicleNumber.toUpperCase().trim()
          }
        });
        finalVehicleId = newVehicle.id;
      } catch (error) {
        Alert.alert('Error', 'Failed to add new vehicle to existing customer.');
        return;
      }
    }

    // Validation/Creation for new customer
    if (isNewCustomer) {
      if (!newCustomerName || !newVehicleModel || !newVehicleNumber) {
        Alert.alert('Info Required', 'Please fill in Customer Name, Vehicle Model, and Vehicle Number.');
        return;
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number to register the new customer.');
        return;
      }

      try {
        const newCustomer = await addCustomerMutation.mutateAsync({
          name: newCustomerName.trim(),
          phone: cleanPhone,
          address: '',
          vehicles: [
            {
              model: newVehicleModel.trim(),
              vehicleNumber: newVehicleNumber.toUpperCase().trim()
            }
          ]
        });

        finalCustomerId = newCustomer.id;
        finalVehicleId = newCustomer.vehicles?.[0]?.id;
      } catch (error: any) {
        const msg = error?.message || '';
        if (msg.includes('already exists')) {
          Alert.alert('Duplicate Phone', 'A customer with this phone number already exists. Use the search to find them instead.');
        } else {
          Alert.alert('Error', `Failed to create customer: ${msg || 'Please check your connection and try again.'}`);
        }
        return;
      }
    }

    // Service items validation
    const hasService = serviceItems.some(i => i.name && i.price);
    const hasParts = Object.keys(selectedParts).length > 0 || customParts.some(i => i.name && i.price);

    if (!hasService && !hasParts) {
      Alert.alert('Empty Form', 'Please add at least one service or part item.');
      return;
    }

    const serviceNames = serviceItems.map(i => i.name).filter(Boolean);
    const partsNames = [
      ...Object.keys(selectedParts).map(id => parts.find((p: any) => p.id === id)?.name),
      ...customParts.map(i => i.name)
    ].filter(Boolean);

    const summaryNames = [...serviceNames, ...partsNames].filter(Boolean);

    const selectedPartsArray = Object.keys(selectedParts).map(partId => {
      const part = parts.find((p: any) => p.id === partId);
      return {
        id: partId,
        quantity: selectedParts[partId],
        price: part?.price ?? 0,
      };
    });

    const newServiceData = {
      customerId: finalCustomerId,
      vehicleId: finalVehicleId,
      status: status,
      serviceItems: summaryNames.length > 0 ? summaryNames : ['Parts Sale'],
      serviceCost: totalLabourCost,
      partsCost: totalPartsCost,
      totalCost: totalCost,
      nextServiceDate: nextServiceDate ? new Date(nextServiceDate).toISOString() : null,
      selectedParts: selectedPartsArray,
    };

    try {
      await addServiceMutation.mutateAsync(newServiceData);
      Alert.alert('Success', 'Service Record Added Successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save service record');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add Service',
          headerStyle: { backgroundColor: '#1A3A3A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '800' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
              <MaterialCommunityIcons name="chevron-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <StatusBar barStyle="light-content" backgroundColor="#1A3A3A" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Surface style={styles.formCard} elevation={1}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <TextInput
              mode="outlined"
              label="Phone Number"
              placeholder="Enter 10 digit number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
              left={<TextInput.Icon icon="phone" color={colors.textSecondary} />}
            />

            {foundCustomer && (
              <View style={styles.foundBox}>
                <View style={styles.customerRow}>
                  <Avatar.Text
                    size={40}
                    label={foundCustomer.name ? foundCustomer.name[0] : '?'}
                    style={{ backgroundColor: '#2DD4BF20' }}
                    labelStyle={{ color: '#2DD4BF', fontWeight: '700' }}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>{foundCustomer.name}</Text>
                    <Text style={{ color: colors.textSecondary }}>{foundCustomer.phone}</Text>
                  </View>
                </View>

                <Text style={[styles.label, { marginTop: 15, marginBottom: 5 }]}>Select Vehicle</Text>
                {foundCustomer.vehicles?.map((v: any) => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vehicleBtn, selectedVehicleId === v.id && !isAddingNewVehicle && styles.vehicleBtnActive]}
                    onPress={() => {
                      setSelectedVehicleId(v.id);
                      setIsAddingNewVehicle(false);
                    }}
                  >
                    <MaterialCommunityIcons name="car" size={20} color={selectedVehicleId === v.id && !isAddingNewVehicle ? '#2DD4BF' : colors.textSecondary} />
                    <Text style={[styles.vehicleBtnText, selectedVehicleId === v.id && !isAddingNewVehicle && { color: '#2DD4BF', fontWeight: '700' }]}>
                      {v.model} ({v.vehicleNumber || v.number})
                    </Text>
                    {selectedVehicleId === v.id && !isAddingNewVehicle && (
                      <MaterialCommunityIcons name="check-circle" size={18} color="#2DD4BF" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.vehicleBtn, isAddingNewVehicle && styles.vehicleBtnActive]}
                  onPress={() => {
                    setIsAddingNewVehicle(true);
                    setSelectedVehicleId('');
                  }}
                >
                  <MaterialCommunityIcons name="plus-circle-outline" size={20} color={isAddingNewVehicle ? '#2DD4BF' : colors.textSecondary} />
                  <Text style={[styles.vehicleBtnText, isAddingNewVehicle && { color: '#2DD4BF', fontWeight: '700' }]}>
                    Add New Vehicle
                  </Text>
                  {isAddingNewVehicle && (
                    <MaterialCommunityIcons name="check-circle" size={18} color="#2DD4BF" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>

                {isAddingNewVehicle && (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      label="Vehicle Model"
                      placeholder="e.g. Swift"
                      value={newVehicleModel}
                      onChangeText={setNewVehicleModel}
                      style={[styles.newInput, { flex: 1, marginRight: 8 }]}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                    <TextInput
                      mode="outlined"
                      label="Reg Number"
                      placeholder="DL 01..."
                      value={newVehicleNumber}
                      onChangeText={setNewVehicleNumber}
                      style={[styles.newInput, { flex: 1 }]}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                  </View>
                )}
              </View>
            )}

            {isNewCustomer && (
              <View style={styles.newCustomerBox}>
                <View style={styles.newTag}>
                  <MaterialCommunityIcons name="account-plus" size={16} color="#0D9488" />
                  <Text style={styles.newTagText}>New Customer Detected</Text>
                </View>

                <TextInput
                  mode="outlined"
                  label="Customer Name"
                  placeholder="Full Name"
                  value={newCustomerName}
                  onChangeText={setNewCustomerName}
                  style={styles.newInput}
                  outlineStyle={{ borderRadius: 10 }}
                />

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TextInput
                    mode="outlined"
                    label="Vehicle Model"
                    placeholder="e.g. Swift"
                    value={newVehicleModel}
                    onChangeText={setNewVehicleModel}
                    style={[styles.newInput, { flex: 1, marginRight: 8 }]}
                    outlineStyle={{ borderRadius: 10 }}
                  />
                  <TextInput
                    mode="outlined"
                    label="Reg Number"
                    placeholder="DL 01..."
                    value={newVehicleNumber}
                    onChangeText={setNewVehicleNumber}
                    style={[styles.newInput, { flex: 1 }]}
                    outlineStyle={{ borderRadius: 10 }}
                  />
                </View>
              </View>
            )}
          </Surface>

          {/* Service Section */}
          <Surface style={styles.formCard} elevation={1}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Service Items</Text>
              <TouchableOpacity onPress={addServiceItem} style={styles.addItemBtn}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#2DD4BF" />
                <Text style={styles.addItemText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {serviceItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <TextInput
                  mode="outlined"
                  placeholder="Task (e.g. Labor)"
                  value={item.name}
                  onChangeText={(v) => updateItem(serviceItems, setServiceItems, item.id, 'name', v)}
                  style={{ flex: 2, marginRight: 8 }}
                  outlineStyle={{ borderRadius: 10 }}
                />
                <TextInput
                  mode="outlined"
                  placeholder="₹"
                  keyboardType="numeric"
                  value={item.price}
                  onChangeText={(v) => updateItem(serviceItems, setServiceItems, item.id, 'price', v)}
                  style={{ flex: 1 }}
                  outlineStyle={{ borderRadius: 10 }}
                />
                {serviceItems.length > 1 && (
                  <IconButton
                    icon="close-circle"
                    iconColor={colors.danger}
                    onPress={() => removeItem(serviceItems, setServiceItems, item.id)}
                    size={20}
                  />
                )}
              </View>
            ))}
          </Surface>

          <Surface style={styles.formCard} elevation={1}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Parts & Consumables</Text>
                <TouchableOpacity onPress={() => router.push('/parts/price-list')}>
                  <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>View Price List</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setCustomParts([...customParts, { id: Math.random().toString(), name: '', price: '' }])} style={styles.addItemBtn}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#2DD4BF" />
                <Text style={styles.addItemText}>Add Custom</Text>
              </TouchableOpacity>
            </View>

            {/* Categorized Master List */}
            {Object.keys(partsByCategory).map(category => (
              <View key={category} style={styles.categoryContainer}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => setCollapsedCategories({ ...collapsedCategories, [category]: !collapsedCategories[category] })}
                >
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <MaterialCommunityIcons
                    name={collapsedCategories[category] ? "chevron-down" : "chevron-up"}
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {!collapsedCategories[category] && (
                  <View style={styles.categoryContent}>
                    {partsByCategory[category].map(part => {
                      const isSelected = !!selectedParts[part.id];
                      return (
                        <View key={part.id} style={styles.partSelectionRow}>
                          <TouchableOpacity
                            style={styles.partInfo}
                            onPress={() => {
                              if (isSelected) {
                                const newParts = { ...selectedParts };
                                delete newParts[part.id];
                                setSelectedParts(newParts);
                              } else {
                                setSelectedParts({ ...selectedParts, [part.id]: 1 });
                              }
                            }}
                          >
                            <MaterialCommunityIcons
                              name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
                              size={24}
                              color={isSelected ? colors.primary : colors.textSecondary}
                            />
                            <View style={{ marginLeft: 10 }}>
                              <Text style={[styles.partName, isSelected && { fontWeight: '800' }]}>{part.name}</Text>
                              <Text style={styles.partPrice}>₹{part.price}</Text>
                            </View>
                          </TouchableOpacity>

                          {isSelected && (
                            <View style={styles.quantityControl}>
                              <IconButton
                                icon="minus"
                                size={16}
                                style={styles.qtyBtn}
                                onPress={() => {
                                  if (selectedParts[part.id] > 1) {
                                    setSelectedParts({ ...selectedParts, [part.id]: selectedParts[part.id] - 1 });
                                  }
                                }}
                              />
                              <Text style={styles.qtyText}>{selectedParts[part.id]}</Text>
                              <IconButton
                                icon="plus"
                                size={16}
                                style={styles.qtyBtn}
                                onPress={() => setSelectedParts({ ...selectedParts, [part.id]: selectedParts[part.id] + 1 })}
                              />
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}

            {/* Custom Items */}
            {customParts.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.subSectionTitle}>Custom Items</Text>
                {customParts.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <TextInput
                      mode="outlined"
                      placeholder="Part Name"
                      value={item.name}
                      onChangeText={(v) => setCustomParts(customParts.map(p => p.id === item.id ? { ...p, name: v } : p))}
                      style={{ flex: 2, marginRight: 8 }}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                    <TextInput
                      mode="outlined"
                      placeholder="₹"
                      keyboardType="numeric"
                      value={item.price}
                      onChangeText={(v) => setCustomParts(customParts.map(p => p.id === item.id ? { ...p, price: v } : p))}
                      style={{ flex: 1 }}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                    <IconButton
                      icon="close-circle"
                      iconColor={colors.danger}
                      onPress={() => setCustomParts(customParts.filter(p => p.id !== item.id))}
                      size={20}
                    />
                  </View>
                ))}
              </View>
            )}
          </Surface>

          {/* Totals & Notes */}
          <Surface style={styles.formCard} elevation={1}>
            <View style={styles.costGrid}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Labor Total</Text>
                <Text style={styles.totalVal}>₹ {totalLabourCost}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Parts Total</Text>
                <Text style={styles.totalVal}>₹ {totalPartsCost}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.label}>Grand Total</Text>
                <Text style={[styles.totalVal, { color: '#2DD4BF' }]}>₹ {totalCost}</Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 15 }} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                mode="outlined"
                placeholder="Additional details..."
                multiline
                value={notes}
                onChangeText={setNotes}
                outlineStyle={{ borderRadius: 10 }}
                style={{ height: 80 }}
              />
            </View>

            <Text style={[styles.label, { marginTop: 15 }]}>Service Status</Text>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[styles.statusToggle, status === 'Performed' && styles.statusToggleActive]}
                onPress={() => setStatus('Performed')}
              >
                <MaterialCommunityIcons name="check-circle" size={20} color={status === 'Performed' ? '#FFF' : colors.textSecondary} />
                <Text style={[styles.statusToggleText, status === 'Performed' && { color: '#FFF' }]}>Performed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusToggle, status === 'Pending' && styles.statusTogglePending]}
                onPress={() => setStatus('Pending')}
              >
                <MaterialCommunityIcons name="clock" size={20} color={status === 'Pending' ? '#FFF' : colors.textSecondary} />
                <Text style={[styles.statusToggleText, status === 'Pending' && { color: '#FFF' }]}>Pending</Text>
              </TouchableOpacity>
            </View>

            <Divider style={{ marginVertical: 15 }} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Next Service Reminder</Text>
              <View style={styles.dateSelectorRow}>
                <TextInput
                  mode="outlined"
                  placeholder="Set next service date"
                  value={nextServiceDate}
                  onChangeText={setNextServiceDate}
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  outlineStyle={{ borderRadius: 10 }}
                  left={<TextInput.Icon icon="calendar-clock" color="#2DD4BF" />}
                />
                <TouchableOpacity style={styles.dateShortcut} onPress={() => setShortcutDate(3)}>
                  <Text style={styles.shortcutText}>+3M</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateShortcut} onPress={() => setShortcutDate(6)}>
                  <Text style={styles.shortcutText}>+6M</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Surface>

          <TouchableOpacity
            style={[styles.saveBtn, ((!foundCustomer && !isNewCustomer) || totalCost === 0) && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={(!foundCustomer && !isNewCustomer) || totalCost === 0 || addServiceMutation.isPending || addCustomerMutation.isPending}
          >
            {addServiceMutation.isPending || addCustomerMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Confirm Service Record</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
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
    padding: 16,
  },
  formCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 10
  },
  foundBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2DD4BF'
  },
  newCustomerBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed'
  },
  newInput: {
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  newTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12
  },
  newTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    marginLeft: 4,
    textTransform: 'uppercase'
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  vehicleBtnActive: {
    borderColor: '#2DD4BF',
    backgroundColor: '#F0FDFA'
  },
  vehicleBtnText: {
    marginLeft: 10,
    color: '#64748B',
    fontSize: 14
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  addItemText: {
    marginLeft: 5,
    color: '#0D9488',
    fontWeight: '700',
    fontSize: 13
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  costGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B'
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  statusToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 4
  },
  statusToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  statusTogglePending: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B'
  },
  statusToggleText: {
    marginLeft: 8,
    fontWeight: '700',
    color: '#64748B'
  },
  saveBtn: {
    backgroundColor: '#1A3A3A',
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A3A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
    marginBottom: 20
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  dateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  dateShortcut: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2DD4BF',
    marginLeft: 6
  },
  shortcutText: {
    color: '#0D9488',
    fontWeight: '800',
    fontSize: 12
  },
  categoryContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden'
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC'
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  categoryContent: {
    padding: 8,
    backgroundColor: '#FFFFFF'
  },
  partSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  partInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  partName: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600'
  },
  partPrice: {
    fontSize: 12,
    color: '#64748B'
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 4
  },
  qtyBtn: {
    margin: 0
  },
  qtyText: {
    fontWeight: '800',
    fontSize: 14,
    color: '#0F172A',
    marginHorizontal: 4
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase'
  }
});
