import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMission } from '../context/MissionContext';

export default function AIAnalysis() {
  const { sensors, energy, comm, alerts } = useMission();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    setAnalysis('');

    const prompt = `Você é um sistema de IA embarcado em uma nave espacial. Analise os dados abaixo e gere um relatório técnico curto (3-4 frases) sobre o status da missão, destacando riscos e recomendações.

DADOS DA MISSÃO:
- Temperatura: ${sensors.temperature.toFixed(1)}°C
- Pressão: ${sensors.pressure.toFixed(1)} kPa
- Radiação: ${sensors.radiation.toFixed(1)} mSv
- Umidade: ${sensors.humidity.toFixed(1)}%
- Painel Solar: ${energy.solarPanel.toFixed(1)}%
- Bateria: ${energy.battery.toFixed(1)}%
- Consumo: ${energy.consumption.toFixed(1)}W
- Sinal: ${comm.signalStrength.toFixed(1)}%
- Latência: ${comm.latency.toFixed(0)}ms
- Alertas ativos: ${alerts.length}

Responda em português, de forma técnica e objetiva.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SUA_CHAVE_GROQ_AQUI',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'Erro ao gerar análise.';
      setAnalysis(text);
    } catch (error) {
      setAnalysis('Erro de conexão com o sistema de IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 ANÁLISE DE IA</Text>
      <Text style={styles.subtitle}>Interpretação inteligente dos dados da missão</Text>

      <TouchableOpacity style={styles.button} onPress={generateAnalysis} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#0a0a1a" />
        ) : (
          <Text style={styles.buttonText}>⚡ Gerar Relatório da Missão</Text>
        )}
      </TouchableOpacity>

      {analysis ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>RELATÓRIO GERADO:</Text>
          <Text style={styles.resultText}>{analysis}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12122a',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  title: { color: '#00d4ff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 12, marginTop: 4, marginBottom: 12 },
  button: {
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#0a0a1a', fontWeight: 'bold', fontSize: 14 },
  resultBox: {
    marginTop: 12,
    backgroundColor: '#0a0a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  resultTitle: { color: '#00d4ff', fontSize: 11, fontWeight: 'bold', marginBottom: 6 },
  resultText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
});