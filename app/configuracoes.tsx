import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMission } from '../context/MissionContext';

export default function ConfiguracoesScreen() {
  const { thresholds, setThresholds } = useMission();

  const [maxTemp, setMaxTemp] = useState(String(thresholds.maxTemperature));
  const [minBattery, setMinBattery] = useState(String(thresholds.minBattery));
  const [minSignal, setMinSignal] = useState(String(thresholds.minSignal));
  const [errors, setErrors] = useState({ maxTemp: '', minBattery: '', minSignal: '' });
  const [saved, setSaved] = useState(false);

  // Carrega do AsyncStorage ao abrir
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('@thresholds');
        if (stored) {
          const parsed = JSON.parse(stored);
          setMaxTemp(String(parsed.maxTemperature));
          setMinBattery(String(parsed.minBattery));
          setMinSignal(String(parsed.minSignal));
          setThresholds(parsed);
        }
      } catch (e) {
        console.log('Erro ao carregar configurações');
      }
    };
    load();
  }, []);

  const validate = () => {
    const newErrors = { maxTemp: '', minBattery: '', minSignal: '' };
    let valid = true;

    const temp = Number(maxTemp);
    const bat = Number(minBattery);
    const sig = Number(minSignal);

    if (!maxTemp || isNaN(temp) || temp < 30 || temp > 150) {
      newErrors.maxTemp = 'Temperatura deve ser entre 30 e 150°C';
      valid = false;
    }
    if (!minBattery || isNaN(bat) || bat < 1 || bat > 50) {
      newErrors.minBattery = 'Bateria mínima deve ser entre 1 e 50%';
      valid = false;
    }
    if (!minSignal || isNaN(sig) || sig < 1 || sig > 80) {
      newErrors.minSignal = 'Sinal mínimo deve ser entre 1 e 80%';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const newThresholds = {
      maxTemperature: Number(maxTemp),
      minBattery: Number(minBattery),
      minSignal: Number(minSignal),
    };

    try {
      await AsyncStorage.setItem('@thresholds', JSON.stringify(newThresholds));
      setThresholds(newThresholds);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const handleReset = async () => {
    const defaults = { maxTemperature: 80, minBattery: 20, minSignal: 30 };
    setMaxTemp('80');
    setMinBattery('20');
    setMinSignal('30');
    setErrors({ maxTemp: '', minBattery: '', minSignal: '' });
    await AsyncStorage.setItem('@thresholds', JSON.stringify(defaults));
    setThresholds(defaults);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>⚙️ CONFIGURAÇÕES</Text>
      <Text style={styles.subtitle}>Defina os limiares de alerta da missão</Text>

      {/* Campo Temperatura */}
      <View style={styles.fieldBox}>
        <Text style={styles.label}>🌡 Temperatura Máxima (°C)</Text>
        <TextInput
          style={[styles.input, errors.maxTemp ? styles.inputError : null]}
          value={maxTemp}
          onChangeText={setMaxTemp}
          keyboardType="numeric"
          placeholderTextColor="#555"
          placeholder="Ex: 80"
        />
        {errors.maxTemp ? <Text style={styles.errorText}>{errors.maxTemp}</Text> : null}
      </View>

      {/* Campo Bateria */}
      <View style={styles.fieldBox}>
        <Text style={styles.label}>🔋 Bateria Mínima (%)</Text>
        <TextInput
          style={[styles.input, errors.minBattery ? styles.inputError : null]}
          value={minBattery}
          onChangeText={setMinBattery}
          keyboardType="numeric"
          placeholderTextColor="#555"
          placeholder="Ex: 20"
        />
        {errors.minBattery ? <Text style={styles.errorText}>{errors.minBattery}</Text> : null}
      </View>

      {/* Campo Sinal */}
      <View style={styles.fieldBox}>
        <Text style={styles.label}>📡 Sinal Mínimo (%)</Text>
        <TextInput
          style={[styles.input, errors.minSignal ? styles.inputError : null]}
          value={minSignal}
          onChangeText={setMinSignal}
          keyboardType="numeric"
          placeholderTextColor="#555"
          placeholder="Ex: 30"
        />
        {errors.minSignal ? <Text style={styles.errorText}>{errors.minSignal}</Text> : null}
      </View>

      {/* Botões */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {saved ? '✅ Salvo com sucesso!' : '💾 Salvar Configurações'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>🔄 Restaurar Padrões</Text>
      </TouchableOpacity>

      {/* Info atual */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>CONFIGURAÇÕES ATIVAS</Text>
        <Text style={styles.infoItem}>🌡 Temp. máxima: {thresholds.maxTemperature}°C</Text>
        <Text style={styles.infoItem}>🔋 Bateria mínima: {thresholds.minBattery}%</Text>
        <Text style={styles.infoItem}>📡 Sinal mínimo: {thresholds.minSignal}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 16 },
  pageTitle: { color: '#00d4ff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4, textAlign: 'center' },
  subtitle: { color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  fieldBox: { marginBottom: 20 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: '#12122a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a3a',
    color: '#fff',
    fontSize: 16,
    padding: 12,
  },
  inputError: { borderColor: '#ff6b6b' },
  errorText: { color: '#ff6b6b', fontSize: 12, marginTop: 4 },
  saveButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: { color: '#0a0a1a', fontSize: 15, fontWeight: 'bold' },
  resetButton: {
    backgroundColor: '#12122a',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  resetButtonText: { color: '#888', fontSize: 15 },
  infoBox: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  infoTitle: { color: '#00d4ff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10 },
  infoItem: { color: '#ccc', fontSize: 14, marginBottom: 6 },
});