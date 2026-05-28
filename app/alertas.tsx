import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMission } from '../context/MissionContext';

export default function AlertasScreen() {
  const { alerts, sensors, energy, comm, thresholds } = useMission();

  const getAlertColor = (type: string) => {
    if (type === 'critical') return '#ff6b6b';
    if (type === 'warning') return '#fdcb6e';
    return '#00d4ff';
  };

  const getAlertIcon = (type: string) => {
    if (type === 'critical') return 'alert-circle';
    if (type === 'warning') return 'warning';
    return 'information-circle';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>🚨 SISTEMA DE ALERTAS</Text>

      {/* Status atual */}
      <View style={styles.statusGrid}>
        <View style={[styles.statusCard, sensors.temperature > thresholds.maxTemperature && styles.alertCard]}>
          <Ionicons
            name="thermometer"
            size={20}
            color={sensors.temperature > thresholds.maxTemperature ? '#ff6b6b' : '#00d4ff'}
          />
          <Text style={styles.statusLabel}>Temperatura</Text>
          <Text style={[styles.statusValue, sensors.temperature > thresholds.maxTemperature && styles.alertText]}>
            {sensors.temperature.toFixed(1)}°C
          </Text>
          <Text style={styles.threshold}>Limiar: {thresholds.maxTemperature}°C</Text>
        </View>

        <View style={[styles.statusCard, energy.battery < thresholds.minBattery && styles.alertCard]}>
          <Ionicons
            name="battery-charging"
            size={20}
            color={energy.battery < thresholds.minBattery ? '#ff6b6b' : '#00d4ff'}
          />
          <Text style={styles.statusLabel}>Bateria</Text>
          <Text style={[styles.statusValue, energy.battery < thresholds.minBattery && styles.alertText]}>
            {energy.battery.toFixed(1)}%
          </Text>
          <Text style={styles.threshold}>Limiar: {thresholds.minBattery}%</Text>
        </View>

        <View style={[styles.statusCard, comm.signalStrength < thresholds.minSignal && styles.alertCard]}>
          <Ionicons
            name="wifi"
            size={20}
            color={comm.signalStrength < thresholds.minSignal ? '#fdcb6e' : '#00d4ff'}
          />
          <Text style={styles.statusLabel}>Sinal</Text>
          <Text style={[styles.statusValue, comm.signalStrength < thresholds.minSignal && styles.warningText]}>
            {comm.signalStrength.toFixed(1)}%
          </Text>
          <Text style={styles.threshold}>Limiar: {thresholds.minSignal}%</Text>
        </View>
      </View>

      {/* Lista de alertas */}
      <Text style={styles.sectionTitle}>
        HISTÓRICO DE ALERTAS ({alerts.length})
      </Text>

      {alerts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-circle" size={48} color="#00d4ff" />
          <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
          <Text style={styles.emptySubText}>Todos os sistemas operando normalmente</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <View key={alert.id} style={[styles.alertItem, { borderLeftColor: getAlertColor(alert.type) }]}>
            <Ionicons name={getAlertIcon(alert.type) as any} size={22} color={getAlertColor(alert.type)} />
            <View style={styles.alertContent}>
              <Text style={[styles.alertMessage, { color: getAlertColor(alert.type) }]}>
                {alert.message}
              </Text>
              <Text style={styles.alertTime}>
                {alert.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 16 },
  pageTitle: { color: '#00d4ff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16, textAlign: 'center' },
  statusGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statusCard: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  alertCard: { borderColor: '#ff6b6b', backgroundColor: '#1a0a0a' },
  statusLabel: { color: '#888', fontSize: 10, marginTop: 4 },
  statusValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  alertText: { color: '#ff6b6b' },
  warningText: { color: '#fdcb6e' },
  threshold: { color: '#555', fontSize: 9, marginTop: 2 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#00d4ff', fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  emptySubText: { color: '#888', fontSize: 13, marginTop: 4 },
  alertItem: {
    backgroundColor: '#12122a',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  alertContent: { marginLeft: 12, flex: 1 },
  alertMessage: { fontSize: 14, fontWeight: 'bold' },
  alertTime: { color: '#555', fontSize: 11, marginTop: 2 },
});