import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4C4C",
  "#4CFF72",
];

// ✅ Fetch chart-friendly power data from backend
const usePowerData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/power/charts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // ✅ refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return data;
};

// ✅ 1. Transformer Voltage Chart
export const TransformerVoltageChart = () => {
  const data = usePowerData();
  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Transformer Voltage Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="tr1Voltage" stroke="#82ca9d" dot={false} name="TR1 Voltage" />
          <Line type="monotone" dataKey="tr2Voltage" stroke="#00C49F" dot={false} name="TR2 Voltage" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ 2. Transformer Current Chart
export const TransformerCurrentChart = () => {
  const data = usePowerData();
  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Transformer Current Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#FF7300" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="tr1Current" stroke="#FF7300" dot={false} name="TR1 Current" />
          <Line type="monotone" dataKey="tr2Current" stroke="#FF4C4C" dot={false} name="TR2 Current" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ 3. Transformer Load Comparison
export const TransformerLoadChart = () => {
  const data = usePowerData();
  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Transformer Load Comparison (TR1 vs TR2)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="tr1Power" fill="#8884d8" name="TR1 Power" />
          <Bar dataKey="tr2Power" fill="#00C49F" name="TR2 Power" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ 4. Total Units Consumed
export const TotalConsumptionChart = () => {
  const data = usePowerData();
  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Total Units Consumed Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Area type="monotone" dataKey="totalUnitConsumed" stroke="#8884d8" fillOpacity={1} fill="url(#colorUnits)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ 5. Temperature vs Total Units
export const TemperatureVsConsumptionChart = () => {
  const data = usePowerData();
  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Temperature vs Total Units
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis yAxisId="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#FF4C4C" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="totalUnitConsumed" stroke="#8884d8" name="Total Units" />
          <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#FF4C4C" name="Temperature" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ 6. Area-wise Power Consumption
export const AreaWiseConsumptionChart = () => {
  const data = usePowerData();

  const aggregatedAreas = {};
  data.forEach((reading) => {
    reading.areas.forEach((a) => {
      if (!aggregatedAreas[a.name]) {
        aggregatedAreas[a.name] = 0;
      }
      aggregatedAreas[a.name] += a.value;
    });
  });

  const chartData = Object.entries(aggregatedAreas).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-[#2A2827] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Area-wise Power Consumption (Total)
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value.toLocaleString()} kWh`, name]}
              contentStyle={{
                backgroundColor: "#2A2827",
                border: "1px solid #555",
                borderRadius: "5px",
              }}
              itemStyle={{ color: "#F5FBFE", fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400">No area-wise data available</p>
      )}
    </div>
  );
};
