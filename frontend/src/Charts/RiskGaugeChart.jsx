import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js';

const RiskGaugeChart = ({ riskPercentage = 0, riskLevel = 'Low' }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Get risk color based on level
  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          primary: '#dc2626',
          secondary: '#ef4444',
          gradient: '#fca5a5',
          background: '#fef2f2',
          shadow: 'rgba(239, 68, 68, 0.3)'
        };
      case 'medium':
      case 'moderate':
        return {
          primary: '#d97706',
          secondary: '#f59e0b',
          gradient: '#fbbf24',
          background: '#fffbeb',
          shadow: 'rgba(245, 158, 11, 0.3)'
        };
      default:
        return {
          primary: '#059669',
          secondary: '#10b981',
          gradient: '#34d399',
          background: '#f0fdf4',
          shadow: 'rgba(16, 185, 129, 0.3)'
        };
    }
  };

  const colors = getRiskColor(riskLevel);
  const normalizedPercentage = Math.min(Math.max(riskPercentage || 0, 0), 100);

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
      Title,
      Tooltip,
      Legend,
      ArcElement,
      DoughnutController
    );

    const ctx = chartRef.current.getContext('2d');

    // Create multiple gradients for enhanced visuals
    const mainGradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 150);
    mainGradient.addColorStop(0, colors.secondary);
    mainGradient.addColorStop(0.7, colors.primary);
    mainGradient.addColorStop(1, colors.primary);

    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, 400);
    backgroundGradient.addColorStop(0, '#f8fafc');
    backgroundGradient.addColorStop(1, '#e2e8f0');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          // Main data arc
          {
            data: [normalizedPercentage, 100 - normalizedPercentage],
            backgroundColor: [mainGradient, 'rgba(226, 232, 240, 0.3)'],
            borderColor: [colors.primary, 'transparent'],
            borderWidth: [4, 0],
            borderRadius: [12, 0],
            cutout: '78%',
            spacing: 2
          },
          // Outer decorative ring
          {
            data: [100],
            backgroundColor: ['rgba(148, 163, 184, 0.1)'],
            borderColor: ['rgba(148, 163, 184, 0.2)'],
            borderWidth: 1,
            cutout: '85%',
            radius: '95%'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: Math.PI,
        rotation: Math.PI,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        interaction: { intersect: false },
        animation: {
          animateRotate: true,
          duration: 2500,
          easing: 'easeOutBounce'
        }
      },
      plugins: [{
        id: 'customGaugeElements',
        beforeDraw: (chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();
          
          const centerX = width / 2;
          const centerY = height / 2 + 30;
          const radius = 120;
          
          // Draw subtle background pattern
          ctx.save();
          ctx.globalAlpha = 0.05;
          for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + Math.cos(angle + Math.PI) * radius * 0.9,
              centerY + Math.sin(angle + Math.PI) * radius * 0.9
            );
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.restore();
          
          // Main percentage text with enhanced styling
          ctx.save();
          ctx.font = 'bold 56px Inter, system-ui, sans-serif';
          ctx.fillStyle = colors.primary;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = colors.shadow;
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 2;
          ctx.fillText(`${Math.round(normalizedPercentage)}%`, centerX, centerY - 20);
          ctx.restore();
          
          // Risk level text
          ctx.save();
          ctx.font = 'bold 20px Inter, system-ui, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.textAlign = 'center';
          ctx.fillText(`${riskLevel} Risk`, centerX, centerY + 25);
          ctx.restore();
          
          // Add animated pulse effect for high risk
          if (riskLevel.toLowerCase() === 'high') {
            const time = Date.now() * 0.003;
            const pulseAlpha = 0.1 + Math.sin(time) * 0.05;
            ctx.save();
            ctx.globalAlpha = pulseAlpha;
            ctx.beginPath();
            ctx.arc(centerX, centerY - 20, 80, 0, Math.PI * 2);
            ctx.fillStyle = colors.primary;
            ctx.fill();
            ctx.restore();
          }
          
          ctx.save();
        }
      }]
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [riskPercentage, riskLevel, colors]);

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return '🚨';
      case 'medium':
      case 'moderate':
        return '⚠️';
      default:
        return '✅';
    }
  };

  const getRiskMessage = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          title: 'Immediate Attention Required',
          message: 'Your assessment indicates elevated risk factors. We strongly recommend consulting with a healthcare professional for proper evaluation and management.',
          action: 'Schedule Medical Consultation'
        };
      case 'medium':
      case 'moderate':
        return {
          title: 'Lifestyle Modifications Recommended',
          message: 'You have moderate risk factors that can be improved through lifestyle changes and regular health monitoring.',
          action: 'Start Prevention Plan'
        };
      default:
        return {
          title: 'Excellent Health Profile',
          message: 'Your current health profile shows low risk factors. Continue maintaining these healthy habits for optimal wellness.',
          action: 'Maintain Current Lifestyle'
        };
    }
  };

  const riskInfo = getRiskMessage(riskLevel);

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full" 
             style={{ backgroundColor: colors.primary }}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full" 
             style={{ backgroundColor: colors.secondary }}></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 rotate-45" 
             style={{ backgroundColor: colors.gradient }}></div>
      </div>

      {/* Main chart container */}
      <div className="relative z-10">
        <div className="w-full h-96 flex items-center justify-center mb-8">
          <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Glowing background effect for high risk */}
            {riskLevel.toLowerCase() === 'high' && (
              <div className="absolute inset-0 rounded-full animate-pulse"
                   style={{ 
                     background: `radial-gradient(circle, ${colors.shadow} 0%, transparent 70%)`,
                     filter: 'blur(20px)'
                   }}></div>
            )}
            
            {/* Chart container with enhanced styling */}
            <div className="relative bg-white rounded-full shadow-2xl p-8 border border-gray-100"
                 style={{ 
                   boxShadow: `0 25px 50px -12px ${colors.shadow}, 0 0 0 1px rgba(255,255,255,0.5)` 
                 }}>
              <canvas ref={chartRef} className="max-w-full max-h-full" />
            </div>
          </div>
        </div>

        {/* Enhanced Risk Level Indicators */}
        <div className="flex justify-center mb-8 space-x-6">
          {[
            { label: 'Low', range: '0-30%', color: '#059669', active: riskLevel.toLowerCase() === 'low' },
            { label: 'Medium', range: '30-70%', color: '#d97706', active: riskLevel.toLowerCase() === 'medium' || riskLevel.toLowerCase() === 'moderate' },
            { label: 'High', range: '70-100%', color: '#dc2626', active: riskLevel.toLowerCase() === 'high' }
          ].map((item, index) => (
            <div key={index} className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
              item.active 
                ? 'bg-white shadow-lg scale-105 border-2' 
                : 'bg-gray-50'
            }`}
            style={{ 
              borderColor: item.active ? item.color : 'transparent',
              transform: item.active ? 'scale(1.05)' : 'scale(1)'
            }}>
              <div className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                   style={{ backgroundColor: item.color }}></div>
              <span className={`text-sm font-medium ${
                item.active ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {item.label} ({item.range})
              </span>
            </div>
          ))}
        </div>

        {/* Enhanced Risk Assessment Card */}
        <div className="relative">
          <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${
            riskLevel.toLowerCase() === 'high' ? 'animate-pulse' : ''
          }`}
               style={{ 
                 backgroundColor: colors.background,
                 borderColor: colors.primary + '40',
                 boxShadow: `0 10px 30px ${colors.shadow}`
               }}>
            
            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 text-3xl opacity-60">
              {getRiskIcon(riskLevel)}
            </div>
            
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 rounded-full mr-4" 
                     style={{ backgroundColor: colors.primary }}></div>
                <h4 className="text-xl font-bold text-gray-900">
                  {riskInfo.title}
                </h4>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-base">
                {riskInfo.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Risk Score: <span className="font-bold" style={{ color: colors.primary }}>
                      {Math.round(normalizedPercentage)}%
                    </span>
                  </div>
                </div>
                
                <button className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                        style={{ 
                          backgroundColor: colors.primary,
                          boxShadow: `0 4px 15px ${colors.shadow}`
                        }}>
                  {riskInfo.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskGaugeChart;