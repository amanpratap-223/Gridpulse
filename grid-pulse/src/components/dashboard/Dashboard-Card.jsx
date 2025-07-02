import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardCard({
  title,
  description,
  children,
  className,
  fullHeight = false,
}) {
  return (
<Card
  className={cn(
    "grid-pulse-card overflow-hidden transition-all duration-200 bg-[#2a2726] text-[#f5fbfe] hover:shadow-md hover:border-[#5FB1E8]/30",
    fullHeight && "h-full",
    className
  )}
>
  <CardHeader className="pb-2">
    <CardTitle className="text-lg font-medium">{title}</CardTitle>
    {description && <CardDescription>{description}</CardDescription>}
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
  );
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
  className,
}) {
  const trendColor = trend?.value > 0 ? 'text-green-500' : trend?.value < 0 ? 'text-red-500' : 'text-gray-400';

  const formattedValue = typeof value === 'number' 
  ? value >= 10000 
    ? (value / 1000).toFixed(1) + 'k' 
    : value.toLocaleString() 
  : value;

  return (
    <DashboardCard title={title} className={className}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-end gap-1">
            <div className="text-3xl font-bold tracking-tight">{formattedValue}</div>
            {unit && <div className="text-sm text-[#94A3B8] mb-1">{unit}</div>}
          </div>
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${trendColor}`}>
               <span>{trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'} {Math.abs(trend.value).toFixed(1)}%</span>
              <span className="ml-1 text-[#94A3B8]">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && <div className="p-2 rounded-md bg-[#5FB1E8]/10 text-[#5FB1E8]">{icon}</div>}
      </div>
    </DashboardCard>
  );
}