import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMission } from '../context/MissionContext';
import AIAnalysis from '../components/AIAnalysis';

export default function HomeScreen() {
  const { sensors, energy, comm, alerts, missionTime } = useMission();

  const hours = Math.floor(missionTime / 3600);
  const minutes = Math.floor((missionTime % 3600) / 60);
  const seconds = missionTime % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 SPACE ANALYTICS</Text>
        <Text style={styles.headerSub}>Mission Control Dashboard</Text>
        <Text style={styles.timer}>
          ⏱ {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Ionicons name="thermometer" size={28} color="#ff6b6b" />
          <Text style={styles.cardValue}>{sensors.temperature.toFixed(1)}°C</Text>
          <Text style={styles.cardLabel}>Temperatura</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="battery-charging" size={28} color="#00d4ff" />
          <Text style={styles.cardValue}>{energy.battery.toFixed(1)}%</Text>
          <Text style={styles.cardLabel}>Bateria</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="wifi" size={28} color="#a29bfe" />
          <Text style={styles.cardValue}>{comm.signalStrength.toFixed(1)}%</Text>
          <Text style={styles.cardLabel}>Sinal</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="warning" size={28} color="#fdcb6e" />
          <Text style={styles.cardValue}>{alerts.length}</Text>
          <Text style={styles.cardLabel}>Alertas</Text>
        </View>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusTitle}>STATUS DA MISSÃO</Text>
        <Text style={styles.statusItem}>🌡 Pressão: {sensors.pressure.toFixed(1)} kPa</Text>
        <Text style={styles.statusItem}>☢ Radiação: {sensors.radiation.toFixed(1)} mSv</Text>
        <Text style={styles.statusItem}>💧 Umidade: {sensors.humidity.toFixed(1)}%</Text>
        <Text style={styles.statusItem}>⚡ Painel Solar: {energy.solarPanel.toFixed(1)}%</Text>
        <Text style={styles.statusItem}>📡 Latência: {comm.latency.toFixed(0)} ms</Text>
      </View>

      <AIAnalysis />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  headerTitle: { color: '#00d4ff', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  headerSub: { color: '#888', fontSize: 13, marginTop: 4 },
  timer: { color: '#a29bfe', fontSize: 16, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
  card: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    width: '44%',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  cardValue: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 6 },
  cardLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  statusBox: {
    backgroundColor: '#12122a',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  statusTitle: { color: '#00d4ff', fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  statusItem: { color: '#ccc', fontSize: 14, marginBottom: 6 },
});