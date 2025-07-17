import React, { useEffect, useState } from "react";
import { Zap, Thermometer, CircleDollarSign } from "lucide-react";
import { MetricCard } from "./dashboard-card";

export const StatsOverview = () => {
  const [latestReading, setLatestReading] = useState({});
  const [avgConsumption, setAvgConsumption] = useState(0);
  const [consumptionChange, setConsumptionChange] = useState(0);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated
      const res = await fetch("http://localhost:3000/power/charts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.length) return;

      // ✅ Latest Reading (sorted by date)
      const sorted = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const latest = sorted[0];

      setLatestReading({
        tr1Voltage: latest.tr1Voltage || 0,
        tr2Voltage: latest.tr2Voltage || 0,
        totalUnitConsumed: latest.totalUnitConsumed || 0,
      });

      // ✅ Avg Daily Consumption
      const avg =
        data.reduce((sum, item) => sum + (item.totalUnitConsumed || 0), 0) /
        data.length;
      setAvgConsumption(avg);

      // ✅ Consumption Change (latest vs previous)
      if (sorted.length > 1) {
        const prev = sorted[1].totalUnitConsumed || 1;
        const change =
          ((latest.totalUnitConsumed - prev) / prev) * 100 || 0;
        setConsumptionChange(change);
      }
    } catch (error) {
      console.error("Error fetching StatsOverview data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Current TR-1 Voltage"
        value={latestReading.tr1Voltage}
        unit="V"
        icon={<Zap className="h-5 w-5" />}
        trend={{
          value: (latestReading.tr1Voltage / 420 - 1) * 100,
          label: "from nominal",
        }}
      />
      <MetricCard
        title="Current TR-2 Voltage"
        value={latestReading.tr2Voltage}
        unit="V"
        icon={<Zap className="h-5 w-5" />}
        trend={{
          value: (latestReading.tr2Voltage / 420 - 1) * 100,
          label: "from nominal",
        }}
      />
      <MetricCard
        title="Latest Consumption"
        value={
          latestReading.totalUnitConsumed?.toLocaleString() || "N/A"
        }
        unit="kWh"
        icon={<CircleDollarSign className="h-5 w-5" />}
        trend={{
          value: consumptionChange,
          label: "vs previous",
        }}
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
