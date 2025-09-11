/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartColors {
  primary: string;
  primaryBackground: string;
  secondary: string;
  secondaryBackground: string;
}

interface BaseChartProps {
  inflows: number[];
  outflows: number[];
  labels?: string[];
  isDarkMode?: boolean;
  colors?: ChartColors;
  title?: string;
  height?: number;
  showLegend?: boolean;
  currency?: string;
}

// Default colors
const defaultColors: ChartColors = {
  primary: 'rgb(16, 185, 129)', // emerald-500
  primaryBackground: 'rgba(16, 185, 129, 0.1)',
  secondary: 'rgb(239, 68, 68)', // red-500
  secondaryBackground: 'rgba(239, 68, 68, 0.1)',
};

const darkModeColors: ChartColors = {
  primary: 'rgb(16, 185, 129)',
  primaryBackground: 'rgba(16, 185, 129, 0.2)',
  secondary: 'rgb(248, 113, 113)', // red-400 for better visibility in dark mode
  secondaryBackground: 'rgba(248, 113, 113, 0.2)',
};

// Revenue Bar Chart Component
export const RevenueBarChart: React.FC<BaseChartProps> = ({
  inflows,
  outflows,
  labels,
  isDarkMode = false,
  colors,
  title = "Revenue Analysis",
  height = 400,
  showLegend = true,
  currency = "USD"
}) => {
  const chartColors = colors || (isDarkMode ? darkModeColors : defaultColors);
  const defaultLabels = labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const data = {
    labels: defaultLabels.slice(0, Math.max(inflows.length, outflows.length)),
    datasets: [
      {
        label: 'Inflows',
        data: inflows,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary,
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Outflows',
        data: outflows,
        backgroundColor: chartColors.secondary,
        borderColor: chartColors.secondary,
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: 600,
          },
          color: isDarkMode ? '#D1D5DB' : '#6B7280',
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: isDarkMode ? '#F9FAFB' : '#111827',
        font: {
          size: 16,
          weight: 600,
        },
        padding: 20,
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#F9FAFB' : '#111827',
        bodyColor: isDarkMode ? '#F9FAFB' : '#374151',
        borderColor: chartColors.primary,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(context.parsed.y);
            return `${label}: ${value}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
            weight: 500,
          },
          padding: 10,
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
          },
          padding: 15,
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number);
          }
        },
      },
    },
  };

  return (
    <div className={`w-full rounded-2xl shadow-sm border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div style={{ height: `${height}px`, padding: '20px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

// Revenue Line Chart Component
export const RevenueLineChart: React.FC<BaseChartProps> = ({
  inflows,
  outflows,
  labels,
  isDarkMode = false,
  colors,
  title = "Revenue Trend",
  height = 400,
  showLegend = true,
  currency = "USD"
}) => {
  const chartColors = colors || (isDarkMode ? darkModeColors : defaultColors);
  const defaultLabels = labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const data = {
    labels: defaultLabels.slice(0, Math.max(inflows.length, outflows.length)),
    datasets: [
      {
        label: 'Inflows',
        data: inflows,
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primaryBackground,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: isDarkMode ? '#374151' : '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Outflows',
        data: outflows,
        borderColor: chartColors.secondary,
        backgroundColor: chartColors.secondaryBackground,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.secondary,
        pointBorderColor: isDarkMode ? '#374151' : '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: 600,
          },
          color: isDarkMode ? '#D1D5DB' : '#6B7280',
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: isDarkMode ? '#F9FAFB' : '#111827',
        font: {
          size: 16,
          weight: 600,
        },
        padding: 20,
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#F9FAFB' : '#111827',
        bodyColor: isDarkMode ? '#F9FAFB' : '#374151',
        borderColor: chartColors.primary,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(context.parsed.y);
            return `${label}: ${value}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
            weight: 500,
          },
          padding: 10,
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            size: 12,
          },
          padding: 15,
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number);
          }
        },
      },
    },
  };

  return (
    <div className={`w-full rounded-2xl shadow-sm border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div style={{ height: `${height}px`, padding: '20px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// Combined Chart Component (with toggle)
export const RevenueCombinedChart: React.FC<BaseChartProps & { 
  defaultChartType?: 'bar' | 'line';
  showToggle?: boolean;
}> = ({
  inflows,
  outflows,
  labels,
  isDarkMode = false,
  colors,
  title = "Revenue Analysis",
  height = 400,
  showLegend = true,
  currency = "USD",
  defaultChartType = 'bar',
  showToggle = true
}) => {
  const [chartType, setChartType] = React.useState<'bar' | 'line'>(defaultChartType);

  // const chartColors = colors || (isDarkMode ? darkModeColors : defaultColors);

  return (
    <div className={`w-full rounded-2xl shadow-sm border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Toggle Controls */}
      {showToggle && (
        <div className={`p-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <div className={`flex rounded-lg p-1 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar'
                  ? isDarkMode 
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'bg-white text-emerald-600 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                chartType === 'line'
                  ? isDarkMode 
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'bg-white text-emerald-600 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height: `${height}px`, padding: '20px' }}>
        {chartType === 'bar' ? (
          <RevenueBarChart
            inflows={inflows}
            outflows={outflows}
            labels={labels}
            isDarkMode={isDarkMode}
            colors={colors}
            title=""
            height={height - 40}
            showLegend={showLegend}
            currency={currency}
          />
        ) : (
          <RevenueLineChart
            inflows={inflows}
            outflows={outflows}
            labels={labels}
            isDarkMode={isDarkMode}
            colors={colors}
            title=""
            height={height - 40}
            showLegend={showLegend}
            currency={currency}
          />
        )}
      </div>
    </div>
  );
};

// Example usage component
export const ChartExamples: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const mockInflows = [300000000, 250000000, 400000000, 180000000, 350000000, 420000000];
  const mockOutflows = [20000000, 15000000, 30000000, 12000000, 25000000, 28000000];
  const customLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Custom colors
  const customColors: ChartColors = {
    primary: 'rgb(99, 102, 241)', // indigo
    primaryBackground: 'rgba(99, 102, 241, 0.1)',
    secondary: 'rgb(245, 158, 11)', // amber
    secondaryBackground: 'rgba(245, 158, 11, 0.1)',
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Reusable Chart Components
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Bar Chart */}
        <RevenueBarChart
          inflows={mockInflows}
          outflows={mockOutflows}
          labels={customLabels}
          isDarkMode={isDarkMode}
          title="Monthly Revenue (Bar Chart)"
          currency="NGN"
        />

        {/* Line Chart */}
        <RevenueLineChart
          inflows={mockInflows}
          outflows={mockOutflows}
          labels={customLabels}
          isDarkMode={isDarkMode}
          title="Monthly Revenue (Line Chart)"
          currency="NGN"
        />

        {/* Combined Chart with custom colors */}
        <RevenueCombinedChart
          inflows={mockInflows}
          outflows={mockOutflows}
          labels={customLabels}
          isDarkMode={isDarkMode}
          colors={customColors}
          title="Revenue Analysis (Combined)"
          currency="NGN"
          defaultChartType="line"
        />
      </div>
    </div>
  );
};