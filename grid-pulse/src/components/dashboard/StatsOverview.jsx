import React from 'react';
import { Zap, Thermometer, Compass, CircleDollarSign } from 'lucide-react';
import { MetricCard} from './dashboard-card';
import { calculateConsumptionChange, getAverageConsumption, getLatestReading } from '@/data/energyData';

export const StatsOverview = () => {
  const latestReading = getLatestReading();
  const consumptionChange = calculateConsumptionChange();
  const avgConsumption = getAverageConsumption();

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Current TR-1 Voltage"
        value={latestReading.tr1Voltage}
        unit="V"
        icon={<Zap className="h-5 w-5" />}
        trend={{ value: (latestReading.tr1Voltage / 420 - 1) * 100, label: "from nominal" }}
      />
      <MetricCard
        title="Current TR-2 Voltage"
        value={latestReading.tr2Voltage}
        unit="V"
        icon={<Zap className="h-5 w-5" />}
        trend={{ value: (latestReading.tr2Voltage / 420 - 1) * 100, label: "from nominal" }}
      />
      <MetricCard
        title="Latest Consumption"
        value={latestReading.totalUnitConsumed?.toLocaleString() || "N/A"}
        unit="kWh"
        icon={<CircleDollarSign className="h-5 w-5" />}
        trend={latestReading.totalUnitConsumed ? { value: consumptionChange, label: "vs previous" } : undefined}
      />
      <MetricCard
        title="Avg Daily Consumption"
        value={Math.round(avgConsumption).toLocaleString()}
        unit="kWh"
        icon={<Thermometer className="h-5 w-5" />}
      />
    </div>
  );
};
