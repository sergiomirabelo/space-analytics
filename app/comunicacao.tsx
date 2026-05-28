import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMission } from '../context/MissionContext';
import { useState, useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function ComunicacaoScreen() {
  const { comm } = useMission();

  const [signalHistory, setSignalHistory] = useState([78, 75, 80, 72, 77, 74, 78]);
  const [latencyHistory, setLatencyHistory] = useState([120, 130, 115, 140, 125, 135, 120]);

  useEffect(() => {
    setSignalHistory(prev => [...prev.slice(-6), comm.signalStrength]);
    setLatencyHistory(prev => [...prev.slice(-6), comm.latency]);
  }, [comm]);

  const signalColor = comm.signalStrength < 30 ? '#ff6b6b' : comm.signalStrength < 60 ? '#fdcb6e' : '#00d4ff';

  const chartConfig = {
    backgroundGradientFrom: '#12122a',
    backgroundGradientTo: '#12122a',
    color: (opacity = 1) => `rgba(162, 155, 254, ${opacity})`,
    labelColor: () => '#888',
    strokeWidth: 2,
    propsForDots: { r: '3', strokeWidth: '1', stroke: '#a29bfe' },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>📡 DASHBOARD DE COMUNICAÇÃO</Text>

      {/* Cards */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Força do Sinal</Text>
          <Text style={[styles.cardValue, { color: signalColor }]}>
            {comm.signalStrength.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Latência</Text>
          <Text style={[styles.cardValue, comm.latency > 300 && styles.danger]}>
            {comm.latency.toFixed(0)} ms
          </Text>
        </View>
      </View>

      <View style={[styles.card, { width: '100%', marginBottom: 16 }]}>
        <Text style={styles.cardLabel}>Taxa de Dados</Text>
        <Text style={styles.cardValue}>{comm.dataRate.toFixed(1)} Mbps</Text>
      </View>

      {/* Barra de sinal */}
      <View style={styles.barBox}>
        <Text style={styles.chartTitle}>Qualidade do Sinal</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${comm.signalStrength}%` as any, backgroundColor: signalColor }]} />
        </View>
        <Text style={[styles.barLabel, { color: signalColor }]}>
          {comm.signalStrength < 30 ? '🔴 CRÍTICO' : comm.signalStrength < 60 ? '🟡 FRACO' : '🟢 NORMAL'}
        </Text>
      </View>

      {/* Gráfico Sinal */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Histórico de Sinal (%)</Text>
        <LineChart
          data={{ labels: [], datasets: [{ data: signalHistory }] }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Gráfico Latência */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Histórico de Latência (ms)</Text>
        <LineChart
          data={{ labels: [], datasets: [{ data: latencyHistory }] }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(253, 203, 110, ${opacity})`,
            propsForDots: { r: '3', strokeWidth: '1', stroke: '#fdcb6e' },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Status */}
      <View style={styles.statusBox}>
        <Text style={styles.chartTitle}>STATUS DO LINK</Text>
        <Text style={styles.statusItem}>
          {comm.signalStrength > 60 ? '🟢' : comm.signalStrength > 30 ? '🟡' : '🔴'} Link de Telemetria: {comm.signalStrength > 60 ? 'Estável' : comm.signalStrength > 30 ? 'Instável' : 'PERDIDO'}
        </Text>
        <Text style={styles.statusItem}>
          {comm.latency < 200 ? '🟢' : '🟡'} Latência: {comm.latency < 200 ? 'Aceitável' : 'Alta'}
        </Text>
        <Text style={styles.statusItem}>
          🟢 Protocolo: TDMA Ativo
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
  danger: { color: '#ff6b6b' },
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