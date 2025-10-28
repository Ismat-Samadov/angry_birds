'use client';

import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DataChartProps {
  data: any[];
  chartType: string;
  config?: {
    x_column: string;
    y_column: string;
    title: string;
    xlabel: string;
    ylabel: string;
  };
}

// Validate chart data before rendering
function validateChartData(data: any[], chartType: string, config?: any): { valid: boolean; reason?: string } {
  // Rule 1: Must have data
  if (!data || data.length === 0) {
    return { valid: false, reason: 'No data provided' };
  }

  // Rule 2: Single row is usually not chartable
  if (data.length === 1) {
    return { valid: false, reason: 'Only one data point' };
  }

  // Rule 3: Check if columns exist
  if (config) {
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    if (config.x_column && !columns.includes(config.x_column)) {
      return { valid: false, reason: `X column '${config.x_column}' not found in data` };
    }

    if (config.y_column && !columns.includes(config.y_column)) {
      return { valid: false, reason: `Y column '${config.y_column}' not found in data` };
    }

    // Rule 4: Y column must have numeric data
    const yColumn = config.y_column || columns[1] || columns[0];
    const hasNumericData = data.some(row => {
      const val = row[yColumn];
      return typeof val === 'number' || !isNaN(parseFloat(String(val)));
    });

    if (!hasNumericData) {
      return { valid: false, reason: `Y column '${yColumn}' has no numeric data` };
    }
  }

  // Rule 5: Too many data points for pie chart
  if (chartType === 'pie' && data.length > 15) {
    return { valid: false, reason: 'Too many categories for pie chart (>15)' };
  }

  // Rule 6: Too many data points for bar/line chart
  if ((chartType === 'bar' || chartType === 'line') && data.length > 100) {
    return { valid: false, reason: `Too many data points (${data.length}) for ${chartType} chart` };
  }

  return { valid: true };
}

export default function DataChart({ data, chartType, config }: DataChartProps) {
  // Validate data before rendering
  const validation = validateChartData(data, chartType, config);

  if (!validation.valid) {
    console.warn('Chart validation failed:', validation.reason);
    return (
      <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <p className="font-semibold">Qrafik göstərilə bilməz</p>
        <p className="text-xs mt-1">{validation.reason}</p>
      </div>
    );
  }

  const firstRow = data[0];
  const columns = Object.keys(firstRow);

  // Auto-detect columns if not provided
  const xColumn = config?.x_column || columns[0];
  const yColumn = config?.y_column || columns.find(col => {
    const val = firstRow[col];
    return typeof val === 'number' || !isNaN(parseFloat(String(val)));
  }) || columns[1] || columns[0];

  const labels = data.map((row) => String(row[xColumn] || '').substring(0, 30));
  const values = data.map((row) => {
    const val = row[yColumn];
    return typeof val === 'number' ? val : parseFloat(String(val)) || 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: config?.ylabel || yColumn,
        data: values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(248, 113, 113, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(248, 113, 113, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: chartType === 'pie' ? 1.5 : 2,
    plugins: {
      legend: {
        display: chartType === 'pie',
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: config?.title || 'Chart',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales:
      chartType !== 'pie'
        ? {
            x: {
              title: {
                display: true,
                text: config?.xlabel || xColumn,
                font: {
                  size: 11,
                },
              },
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 10,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: config?.ylabel || yColumn,
                font: {
                  size: 11,
                },
              },
              beginAtZero: true,
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          }
        : undefined,
  };

  return (
    <div className="w-full">
      <div className="relative" style={{ height: chartType === 'pie' ? '400px' : '350px' }}>
        {chartType === 'bar' && <Bar data={chartData} options={options} />}
        {chartType === 'line' && <Line data={chartData} options={options} />}
        {chartType === 'pie' && <Pie data={chartData} options={options} />}
      </div>
    </div>
  );
}
