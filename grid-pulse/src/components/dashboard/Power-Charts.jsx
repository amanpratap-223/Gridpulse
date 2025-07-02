import React from 'react';
import { DashboardCard } from './dashboard-card';
import { getTransformerVoltages, getTransformerCurrents, getDailyConsumption, getConsumptionByArea,getTR1SupplyData,getTR2SupplyData,getTRKwhData } from '@/data/energyData';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

// Custom colors that match our Grid Pulse theme
const colors = {
  primary: '#5FB1E8',
  secondary: '#073E67',
  tertiary: '#35A2EB',
  quaternary: '#2E78A0',
  accent1: '#64D7F7',
  accent2: '#0891B2',
  gradientStart: '#073E67',
  gradientEnd: '#5FB1E8'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="grid-pulse-glass p-2 border border-[#EBEBEB]/40 rounded shadow-lg">
        <p className="text-sm font-medium text-[#F5FBFE]">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const VoltageChart = () => {
  const data = getTransformerVoltages();

  return (
    <DashboardCard 
      title="Transformer Voltages" 
      description="Daily voltage readings for both transformers"
      fullHeight
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorTr1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>  {/* Blue */}
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTr2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>  {/* Red */}
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={['auto', 'auto']}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 15 }} />
          <Line 
            type="monotone" 
            dataKey="tr1Voltage" 
            name="TR-1 Voltage (V)"
            stroke='#3B82F6' 
            strokeWidth={2}
            dot={{ stroke: colors.primary, strokeWidth: 2, r: 4, fill: 'rgba(0,0,0,0.3)' }}
            activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2, fill: colors.primary }}
          />
          <Line 
            type="monotone" 
            dataKey="tr2Voltage" 
            name="TR-2 Voltage (V)"
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ stroke: colors.accent1, strokeWidth: 2, r: 4, fill: 'rgba(0,0,0,0.3)' }}
            activeDot={{ r: 6, stroke: colors.accent1, strokeWidth: 2, fill: colors.accent1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};

export const CurrentChart = () => {
  const data = getTransformerCurrents();

  return (
    <DashboardCard
      title="Current Analysis"
      description="Daily current measurements in amperes"
      fullHeight
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorTr1Current" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>  {/* Blue */}
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTr2Current" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>  {/* Red */}
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 15 }} />
          <Area
            type="monotone"
            dataKey="tr1Current"
            name="TR-1 Current (A)"
            stroke="#3B82F6"  
            fill="url(#colorTr1Current)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="tr2Current"
            name="TR-2 Current (A)"
            stroke="#EF4444"  
            fill="url(#colorTr2Current)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};

export const KWHChart = () => {
  const data = getTRKwhData();

  return (
    <DashboardCard 
      title="TR-1 KWH and TR-2 KWH" 
      description="Historical energy consumption in kilowatt-hours"
      fullHeight
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis
            domain={[0, 12000000]}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            formatter={(value) => [`${(value / 1000000).toFixed(2)}M`, 'KWH']}
          />
          <Legend wrapperStyle={{ paddingTop: 15 }} />
          <Line 
            type="monotone" 
            dataKey="tr1KWH" 
            name="TR-1 KWH" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: 'rgba(0,0,0,0.3)' }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#3B82F6' }}
          />
          <Line 
            type="monotone" 
            dataKey="tr2KWH" 
            name="TR-2 KWH" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ stroke: '#EF4444', strokeWidth: 2, r: 4, fill: 'rgba(0,0,0,0.3)' }}
            activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#EF4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};


export const ConsumptionChart = () => {
  const data = getDailyConsumption().filter(item => item.value !== null);

  return (
    <DashboardCard
      title="Daily Energy Consumption"
      description="Total units consumed per day"
      fullHeight
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            name="Consumption (kWh)" 
            fill="url(#consumptionGradient)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};

export const ConsumptionByAreaChart = () => {
  const data = getConsumptionByArea();
  // Updated with more vibrant colors
  const COLORS = [
    '#3B82F6', // Bright blue
    '#EF4444', // Bright red
    '#F59E0B', // Amber/orange
    '#10B981', // Emerald green
    '#8B5CF6', // Purple
    '#EC4899'  // Pink
  ];

  return (
    <DashboardCard
      title="Consumption by Area"
      description="Distribution of energy consumption across areas"
      fullHeight
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};



  export const TR1SupplyChart = () => {
    const data = getTR1SupplyData();
  
    return (
      <DashboardCard 
        title="TR-1 Supply Chart" 
        description="Historical power consumption by area (MWH)"
        fullHeight
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis
              domain={[0, 4000]}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            <Line type="monotone" dataKey="professorHouse" name="Professor House MWH" stroke="#4299E1" strokeWidth={2} />
            <Line type="monotone" dataKey="csBuilding" name="CS Building MWH" stroke="#F56565" strokeWidth={2} />
            <Line type="monotone" dataKey="lc1" name="LC-1 MWH" stroke="#ECC94B" strokeWidth={2} />
            <Line type="monotone" dataKey="hostelNRoad" name="Hostel-N Road Side MWH" stroke="#48BB78" strokeWidth={2} />
            <Line type="monotone" dataKey="rndSS" name="R&D SS MWH" stroke="#ED8936" strokeWidth={2} />
            <Line type="monotone" dataKey="commonPanel" name="Common Panel MWH" stroke="#38B2AC" strokeWidth={2} />
            <Line type="monotone" dataKey="wsPumpRoom" name="WS Pump Room KWH" stroke="#90CDF4" strokeWidth={2} />
            <Line type="monotone" dataKey="dataCentre" name="Data Centre" stroke="#FC8181" strokeWidth={2} />
            <Line type="monotone" dataKey="acHostelE" name="AC Hostel-E &G MWH" stroke="#F6E05E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>
    );
  };
  
  export const TR2SupplyChart = () => {
    const data = getTR2SupplyData();
  
    return (
      <DashboardCard 
        title="TR-2 Supply Areas" 
        description="Historical power consumption by area (MWH)"
        fullHeight
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis
              domain={[0, 3000]}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            <Line type="monotone" dataKey="lc2" name="LC-2 MWH" stroke="#4299E1" strokeWidth={2} />
            <Line type="monotone" dataKey="chiller2" name="Chiller-2 MWH" stroke="#F56565" strokeWidth={2} />
            <Line type="monotone" dataKey="chiller3" name="Chiller-3 MWH" stroke="#ECC94B" strokeWidth={2} />
            <Line type="monotone" dataKey="firePumpRoom" name="Fire Pump Room KWH" stroke="#48BB78" strokeWidth={2} />
            <Line type="monotone" dataKey="hostelNTAN" name="Hostel-N TAN Side MWH" stroke="#ED8936" strokeWidth={2} />
            <Line type="monotone" dataKey="dispensary" name="Dispensary" stroke="#38B2AC" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>
    );
  };
  