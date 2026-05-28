import React, { createContext, useContext, useState, useEffect } from 'react';

type SensorData = {
  temperature: number;
  pressure: number;
  radiation: number;
  humidity: number;
};

type EnergyData = {
  solarPanel: number;
  battery: number;
  consumption: number;
};

type CommData = {
  signalStrength: number;
  latency: number;
  dataRate: number;
};

type Alert = {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
};

type Thresholds = {
  maxTemperature: number;
  minBattery: number;
  minSignal: number;
};

type MissionContextType = {
  sensors: SensorData;
  energy: EnergyData;
  comm: CommData;
  alerts: Alert[];
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  missionTime: number;
};

const defaultThresholds: Thresholds = {
  maxTemperature: 80,
  minBattery: 20,
  minSignal: 30,
};

const MissionContext = createContext<MissionContextType>({} as MissionContextType);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [missionTime, setMissionTime] = useState(0);
  const [thresholds, setThresholds] = useState<Thresholds>(defaultThresholds);

  const [sensors, setSensors] = useState<SensorData>({
    temperature: 45,
    pressure: 101,
    radiation: 12,
    humidity: 55,
  });

  const [energy, setEnergy] = useState<EnergyData>({
    solarPanel: 85,
    battery: 72,
    consumption: 34,
  });

  const [comm, setComm] = useState<CommData>({
    signalStrength: 78,
    latency: 120,
    dataRate: 9.6,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime((t) => t + 1);

      setSensors((prev) => ({
        temperature: Math.min(120, Math.max(20, prev.temperature + (Math.random() - 0.48) * 3)),
        pressure: Math.min(120, Math.max(80, prev.pressure + (Math.random() - 0.5) * 2)),
        radiation: Math.min(50, Math.max(5, prev.radiation + (Math.random() - 0.5) * 1)),
        humidity: Math.min(100, Math.max(20, prev.humidity + (Math.random() - 0.5) * 2)),
      }));

      setEnergy((prev) => ({
        solarPanel: Math.min(100, Math.max(0, prev.solarPanel + (Math.random() - 0.5) * 4)),
        battery: Math.min(100, Math.max(0, prev.battery + (Math.random() - 0.52) * 2)),
        consumption: Math.min(80, Math.max(10, prev.consumption + (Math.random() - 0.5) * 3)),
      }));

      setComm((prev) => ({
        signalStrength: Math.min(100, Math.max(0, prev.signalStrength + (Math.random() - 0.5) * 5)),
        latency: Math.min(500, Math.max(50, prev.latency + (Math.random() - 0.5) * 20)),
        dataRate: Math.min(20, Math.max(1, prev.dataRate + (Math.random() - 0.5) * 1)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newAlerts: Alert[] = [];

    if (sensors.temperature > thresholds.maxTemperature) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'critical',
        message: `Temperatura crítica: ${sensors.temperature.toFixed(1)}°C`,
        timestamp: new Date(),
      });
    }

    if (energy.battery < thresholds.minBattery) {
      newAlerts.push({
        id: `bat-${Date.now()}`,
        type: 'critical',
        message: `Bateria baixa: ${energy.battery.toFixed(1)}%`,
        timestamp: new Date(),
      });
    }

    if (comm.signalStrength < thresholds.minSignal) {
      newAlerts.push({
        id: `sig-${Date.now()}`,
        type: 'warning',
        message: `Sinal fraco: ${comm.signalStrength.toFixed(1)}%`,
        timestamp: new Date(),
      });
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
    }
  }, [sensors, energy, comm, thresholds]);

  return (
    <MissionContext.Provider
      value={{ sensors, energy, comm, alerts, thresholds, setThresholds, missionTime }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  return useContext(MissionContext);
}