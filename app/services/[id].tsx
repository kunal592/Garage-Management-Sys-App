import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Share, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Text, Surface, Avatar, Divider, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useServiceDetail } from "../../src/hooks/useQueries";
import { colors } from "../../src/theme/colors";
import { formatCurrency } from "../../src/utils/helpers";
import { ServiceDetailSkeleton } from "../../src/components/SkeletonLoaders";

export default function ServiceDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // TanStack Query Hook
  const { data: service, isLoading } = useServiceDetail(id as string);

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return (
      <View style={styles.center}>
        <Text>Service record not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  const handleShare = async () => {
    const message = `Service Record for ${service.vehicleModel}\nCustomer: ${service.customerName}\nDate: ${service.date}\nService Type: ${service.type}\nTotal Amount: ${formatCurrency(service.cost || service.totalCost || 0)}\nStatus: ${service.status}`;
    try { await Share.share({ message }); } catch (error) { console.log(error); }
  };

  const handleDownloadInvoice = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2DD4BF; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #145A4A; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .details-col { width: 45%; }
            .title { font-size: 14px; color: #64748B; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
            .value { font-size: 16px; margin-bottom: 15px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #E2E8F0; color: #64748B; text-transform: uppercase; font-size: 12px; }
            td { padding: 12px; border-bottom: 1px solid #E2E8F0; font-size: 14px; }
            .right { text-align: right; }
            .total-row td { font-weight: bold; font-size: 16px; border-bottom: none; }
            .grand-total { font-size: 20px; color: #0D9488; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94A3B8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">GarageMS Invoice</div>
            <div>Automotive Service & Repair</div>
          </div>
          
          <div class="details">
            <div class="details-col">
              <div class="title">Billed To:</div>
              <div class="value">${service.customerName}<br/>${service.customerPhone}</div>
              <div class="title">Vehicle:</div>
              <div class="value">${service.vehicleModel}<br/>${service.vehicleNumber || ''}</div>
            </div>
            <div class="details-col" style="text-align: right;">
              <div class="title">Invoice Date:</div>
              <div class="value">${service.date}</div>
              <div class="title">Status:</div>
              <div class="value">${service.status || 'Performed'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Summary</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Labor / Tasks</strong><br/><span style="color: #64748B; font-size: 12px;">${service.type}</span></td>
                <td class="right">${formatCurrency(service.serviceCost || 0)}</td>
              </tr>
              ${[...(service.selectedParts || []), ...(service.customParts || [])].map((part: any) => `
                <tr>
                  <td>${part.name} (x${part.quantity || 1})</td>
                  <td class="right">${formatCurrency(part.price * (part.quantity || 1))}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td class="right" style="padding-top: 30px;">Parts Total:</td>
                <td class="right" style="padding-top: 30px;">${formatCurrency(service.partsCost || 0)}</td>
              </tr>
              <tr class="total-row">
                <td class="right">Labor Total:</td>
                <td class="right">${formatCurrency(service.serviceCost || 0)}</td>
              </tr>
              <tr class="total-row">
                <td class="right grand-total">GRAND TOTAL:</td>
                <td class="right grand-total">${formatCurrency(service.totalCost || service.cost || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Thank you for your business!<br/>
            ${service.nextServiceDate ? `Next Service Reminder: ${new Date(service.nextServiceDate).toLocaleDateString()}` : ''}
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: 'Download Invoice' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
       <Stack.Screen
        options={{
          headerShown: true,
          title: 'Service Record',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
              <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={{ marginRight: 15 }}>
              <MaterialCommunityIcons name="share-variant" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Surface style={styles.receiptCard} elevation={2}>
          {/* Header & Status */}
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.receiptLabel}>SERVICE DATE</Text>
              <Text style={styles.receiptDate}>{service.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: service.status === 'Pending' ? '#FFF7ED' : '#F0FDFA' }]}>
              <Text style={[styles.statusText, { color: service.status === 'Pending' ? '#F59E0B' : '#0D9488' }]}>
                {service.status || 'Performed'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Customer & Vehicle */}
          <View style={styles.infoSection}>
             <View style={styles.infoRow}>
                <Avatar.Text size={48} label={service.customerName ? service.customerName[0] : '?'} style={{ backgroundColor: colors.primary + '20' }} labelStyle={{ color: colors.primary }} />
                <View style={styles.infoText}>
                  <Text style={styles.name}>{service.customerName}</Text>
                  <Text style={styles.phone}>{service.customerPhone}</Text>
                </View>
             </View>
             
             <Surface style={styles.vehicleBox} elevation={0}>
                <MaterialCommunityIcons name="car" size={24} color={colors.primary} />
                <Text style={styles.vehicleName}>{service.vehicleModel}</Text>
             </Surface>
          </View>

          <Divider style={styles.divider} />

          {/* Service Items */}
          <Text style={styles.sectionTitle}>SERVICE SUMMARY</Text>
          <View style={styles.serviceBox}>
            <MaterialCommunityIcons name="wrench-clock" size={20} color={colors.textSecondary} />
            <Text style={styles.serviceType}>{service.type}</Text>
          </View>

          {/* Parts Breakdown if exists */}
          {((service.selectedParts && service.selectedParts.length > 0) || (service.customParts && service.customParts.length > 0)) && (
            <View style={{ marginTop: 5 }}>
              <Text style={styles.sectionTitle}>PARTS & MATERIALS</Text>
              {[...(service.selectedParts || []), ...(service.customParts || [])].map((part: any, idx: number) => (
                <View key={idx} style={styles.partItemRow}>
                  <Text style={styles.partItemName}>• {part.name} (x{part.quantity})</Text>
                  <Text style={styles.partItemPrice}>{formatCurrency(part.price * part.quantity)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Cost Breakdown */}
          <View style={styles.breakdown}>
             <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Parts & Consumables</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(service.partsCost || 0)}</Text>
             </View>
             <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Labour Charges</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(service.serviceCost || 0)}</Text>
             </View>
             <Divider style={{ marginVertical: 12 }} />
             <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>GRAND TOTAL</Text>
                <Text style={styles.totalValue}>{formatCurrency(service.totalCost || service.cost || 0)}</Text>
             </View>
          </View>

          {/* Notes & Reminders */}
          {service.notes && (
            <View style={styles.noteSection}>
              <Text style={styles.receiptLabel}>SPECIAL NOTES</Text>
              <Text style={styles.noteText}>{service.notes}</Text>
            </View>
          )}

          {service.nextServiceDate && (
             <Surface style={styles.reminderBox} elevation={0}>
                <MaterialCommunityIcons name="calendar-star" size={20} color="#F59E0B" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.reminderLabel}>Next Service Scheduled</Text>
                  <Text style={styles.reminderDate}>{new Date(service.nextServiceDate).toLocaleDateString()}</Text>
                </View>
             </Surface>
          )}
        </Surface>

        <Button 
          mode="contained" 
          icon="download"
          onPress={handleDownloadInvoice} 
          style={styles.downloadBtn}
          buttonColor="#145A4A"
        >
          Download PDF Invoice
        </Button>

        <Button 
          mode="outlined" 
          onPress={() => router.back()} 
          style={[styles.closeBtn, { borderColor: colors.border }]}
          textColor={colors.textSecondary}
        >
          Close Record
        </Button>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#F1F5F9',
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  phone: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  vehicleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 10,
  },
  serviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  serviceType: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 10,
    lineHeight: 22,
  },
  breakdown: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  noteSection: {
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  reminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  reminderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  reminderDate: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  closeBtn: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
  },
  downloadBtn: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  partItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4
  },
  partItemName: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600'
  },
  partItemPrice: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700'
  }
});
