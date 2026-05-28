import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useMission } from '../context/MissionContext';

const screenWidth = Dimensions.get('window').width;

export default function EnergiaScreen() {
  const { energy } = useMission();

  const chartConfig = {
    backgroundGradientFrom: '#12122a',
    backgroundGradientTo: '#12122a',
    color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
    labelColor: () => '#888',
    strokeWidth: 2,
  };

  const batteryColor = energy.battery < 20 ? '#ff6b6b' : energy.battery < 50 ? '#fdcb6e' : '#00d4ff';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>⚡ DASHBOARD DE ENERGIA</Text>

      {/* Cards */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Painel Solar</Text>
          <Text style={styles.cardValue}>{energy.solarPanel.toFixed(1)}%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bateria</Text>
          <Text style={[styles.cardValue, { color: batteryColor }]}>
            {energy.battery.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={[styles.card, { marginBottom: 16 }]}>
        <Text style={styles.cardLabel}>Consumo atual</Text>
        <Text style={styles.cardValue}>{energy.consumption.toFixed(1)} W</Text>
      </View>

      {/* Barra de bateria visual */}
      <View style={styles.barBox}>
        <Text style={styles.chartTitle}>Nível de Bateria</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${energy.battery}%` as any, backgroundColor: batteryColor }]} />
        </View>
        <Text style={[styles.barLabel, { color: batteryColor }]}>{energy.battery.toFixed(1)}%</Text>
      </View>

      {/* Gráfico de barras */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Visão Geral de Energia</Text>
        <BarChart
          data={{
            labels: ['Solar', 'Bateria', 'Consumo'],
            datasets: [{ data: [energy.solarPanel, energy.battery, energy.consumption] }],
          }}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix="%"
          style={styles.chart}
        />
      </View>

      {/* Status */}
      <View style={styles.statusBox}>
        <Text style={styles.chartTitle}>STATUS DO SISTEMA</Text>
        <Text style={styles.statusItem}>
          {energy.solarPanel > 60 ? '🟢' : '🟡'} Painel Solar: {energy.solarPanel > 60 ? 'Operacional' : 'Reduzido'}
        </Text>
        <Text style={styles.statusItem}>
          {energy.battery > 20 ? '🟢' : '🔴'} Bateria: {energy.battery > 20 ? 'Normal' : 'CRÍTICO'}
        </Text>
        <Text style={styles.statusItem}>
          {energy.consumption < 60 ? '🟢' : '🟡'} Consumo: {energy.consumption < 60 ? 'Normal' : 'Alto'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 16 },
  pageTitle: { color: '#00d4ff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  cardLabel: { color: '#888', fontSize: 12, marginBottom: 4 },
  cardValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  barBox: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  barBackground: {
    height: 20,
    backgroundColor: '#1a1a3a',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  barFill: { height: '100%', borderRadius: 10 },
  barLabel: { textAlign: 'right', fontSize: 13, fontWeight: 'bold' },
  chartBox: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  chartTitle: { color: '#00d4ff', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  chart: { borderRadius: 8 },
  statusBox: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  statusItem: { color: '#ccc', fontSize: 14, marginBottom: 6 },
});