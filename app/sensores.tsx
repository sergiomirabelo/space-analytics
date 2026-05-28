import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMission } from '../context/MissionContext';
import { useState, useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function SensoresScreen() {
  const { sensors } = useMission();

  const [tempHistory, setTempHistory] = useState([45, 46, 44, 47, 45, 48, 46]);
  const [radHistory, setRadHistory] = useState([12, 13, 11, 14, 12, 13, 12]);

  useEffect(() => {
    setTempHistory(prev => [...prev.slice(-6), sensors.temperature]);
    setRadHistory(prev => [...prev.slice(-6), sensors.radiation]);
  }, [sensors]);

  const chartConfig = {
    backgroundGradientFrom: '#12122a',
    backgroundGradientTo: '#12122a',
    color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
    labelColor: () => '#888',
    strokeWidth: 2,
    propsForDots: { r: '3', strokeWidth: '1', stroke: '#00d4ff' },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>📡 DASHBOARD DE SENSORES</Text>

      {/* Cards de valores */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Temperatura</Text>
          <Text style={[styles.cardValue, sensors.temperature > 80 && styles.danger]}>
            {sensors.temperature.toFixed(1)}°C
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pressão</Text>
          <Text style={styles.cardValue}>{sensors.pressure.toFixed(1)} kPa</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Radiação</Text>
          <Text style={[styles.cardValue, sensors.radiation > 30 && styles.danger]}>
            {sensors.radiation.toFixed(1)} mSv
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Umidade</Text>
          <Text style={styles.cardValue}>{sensors.humidity.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Gráfico Temperatura */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Temperatura (°C)</Text>
        <LineChart
          data={{ labels: [], datasets: [{ data: tempHistory }] }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Gráfico Radiação */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Radiação (mSv)</Text>
        <LineChart
          data={{ labels: [], datasets: [{ data: radHistory }] }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
            propsForDots: { r: '3', strokeWidth: '1', stroke: '#ff6b6b' },
          }}
          bezier
          style={styles.chart}
        />
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
});