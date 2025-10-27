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

export default function DataChart({ data, chartType, config }: DataChartProps) {
  if (!data || data.length === 0) return null;

  const xColumn = config?.x_column || Object.keys(data[0])[0];
  const yColumn = config?.y_column || Object.keys(data[0])[1] || Object.keys(data[0])[0];

  const labels = data.map((row) => row[xColumn]);
  const values = data.map((row) => parseFloat(row[yColumn]) || 0);

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
    plugins: {
      legend: {
        display: chartType === 'pie',
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: config?.title || 'Chart',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales:
      chartType !== 'pie'
        ? {
            x: {
              title: {
                display: true,
                text: config?.xlabel || xColumn,
              },
            },
            y: {
              title: {
                display: true,
                text: config?.ylabel || yColumn,
              },
              beginAtZero: true,
            },
          }
        : undefined,
  };

  return (
    <div className="w-full h-80">
      {chartType === 'bar' && <Bar data={chartData} options={options} />}
      {chartType === 'line' && <Line data={chartData} options={options} />}
      {chartType === 'pie' && <Pie data={chartData} options={options} />}
    </div>
  );
}
