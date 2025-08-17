import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const HealthParametersChart = ({ formData, prediction }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Define normal ranges and get status for each parameter
  const getParameterAnalysis = () => {
    const parameters = [
      {
        name: 'BMI',
        value: parseFloat(formData.BMI) || 0,
        normalRange: { min: 18.5, max: 24.9 },
        unit: 'kg/m²',
        getStatus: (val) => {
          if (val < 18.5) return { status: 'low', color: '#3b82f6', message: 'Underweight' };
          if (val <= 24.9) return { status: 'normal', color: '#059669', message: 'Normal' };
          if (val <= 29.9) return { status: 'elevated', color: '#d97706', message: 'Overweight' };
          return { status: 'high', color: '#dc2626', message: 'Obese' };
        }
      },
      {
        name: 'Glucose',
        value: parseFloat(formData.Glucose) || 0,
        normalRange: { min: 70, max: 100 },
        unit: 'mg/dL',
        getStatus: (val) => {
          if (val < 70) return { status: 'low', color: '#3b82f6', message: 'Low' };
          if (val <= 100) return { status: 'normal', color: '#059669', message: 'Normal' };
          if (val <= 125) return { status: 'elevated', color: '#d97706', message: 'Pre-diabetic' };
          return { status: 'high', color: '#dc2626', message: 'Diabetic Range' };
        }
      },
      {
        name: 'Blood Pressure',
        value: parseFloat(formData.BloodPressure) || 0,
        normalRange: { min: 60, max: 80 },
        unit: 'mmHg',
        getStatus: (val) => {
          if (val < 60) return { status: 'low', color: '#3b82f6', message: 'Low' };
          if (val <= 80) return { status: 'normal', color: '#059669', message: 'Normal' };
          if (val <= 89) return { status: 'elevated', color: '#d97706', message: 'Elevated' };
          return { status: 'high', color: '#dc2626', message: 'High' };
        }
      },
      {
        name: 'Insulin',
        value: parseFloat(formData.Insulin) || 0,
        normalRange: { min: 16, max: 166 },
        unit: 'μU/mL',
        getStatus: (val) => {
          if (val < 16) return { status: 'low', color: '#3b82f6', message: 'Low' };
          if (val <= 166) return { status: 'normal', color: '#059669', message: 'Normal' };
          return { status: 'high', color: '#dc2626', message: 'High' };
        }
      },
      {
        name: 'Age Factor',
        value: parseFloat(formData.Age) || 0,
        normalRange: { min: 20, max: 50 },
        unit: 'years',
        getStatus: (val) => {
          if (val <= 30) return { status: 'normal', color: '#059669', message: 'Low Risk' };
          if (val <= 50) return { status: 'elevated', color: '#d97706', message: 'Moderate Risk' };
          return { status: 'high', color: '#dc2626', message: 'Higher Risk' };
        }
      }
    ];

    return parameters.map(param => ({
      ...param,
      analysis: param.getStatus(param.value)
    }));
  };

  const parametersData = getParameterAnalysis();

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance first
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // Register Chart.js components
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
      Title,
      Tooltip,
      Legend
    );

    const ctx = chartRef.current.getContext('2d');

    // Prepare data for chart
    const labels = parametersData.map(p => p.name);
    const values = parametersData.map(p => p.value);
    const colors = parametersData.map(p => p.analysis.color);
    const borderColors = parametersData.map(p => p.analysis.color);

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Your Values',
          data: values,
          backgroundColor: colors.map(color => color + '20'), // Add transparency
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return parametersData[index].name;
              },
              label: (context) => {
                const index = context.dataIndex;
                const param = parametersData[index];
                return [
                  `Value: ${param.value} ${param.unit}`,
                  `Status: ${param.analysis.message}`,
                  `Normal Range: ${param.normalRange.min}-${param.normalRange.max} ${param.unit}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#6b7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              maxRotation: 45
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [formData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'elevated':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="w-full h-80">
        <canvas ref={chartRef} className="max-w-full max-h-full" />
      </div>

      {/* Parameters Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parametersData.map((param, index) => (
          <div key={index} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md`}
               style={{ 
                 backgroundColor: param.analysis.color + '10',
                 borderColor: param.analysis.color + '30'
               }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{param.name}</h4>
              {getStatusIcon(param.analysis.status)}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold" style={{ color: param.analysis.color }}>
                {param.value} <span className="text-sm font-normal">{param.unit}</span>
              </p>
              <p className="text-sm text-gray-600">
                Normal: {param.normalRange.min}-{param.normalRange.max} {param.unit}
              </p>
              <p className="text-sm font-medium" style={{ color: param.analysis.color }}>
                {param.analysis.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lifestyle Factors */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Impact Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700">Smoking Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.smoking_status === 'never' 
                ? 'bg-green-100 text-green-800' 
                : formData.smoking_status === 'former'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {formData.smoking_status === 'never' ? 'Never' : 
               formData.smoking_status === 'former' ? 'Former' : 'Current'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700">Physical Activity</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              parseFloat(formData.physical_activity) === 1 
                ? 'bg-green-100 text-green-800' 
                : parseFloat(formData.physical_activity) === 0.5
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {parseFloat(formData.physical_activity) === 1 ? 'High' : 
               parseFloat(formData.physical_activity) === 0.5 ? 'Moderate' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthParametersChart;