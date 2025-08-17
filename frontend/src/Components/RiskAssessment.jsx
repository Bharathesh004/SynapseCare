import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  User, 
  Weight, 
  Thermometer,
  Droplets,
  Ruler,
  Target,
  ArrowLeft,
  Send,
  RefreshCw,
  BarChart3, 
  PieChart 
} from 'lucide-react';
import RiskGaugeChart from '../Charts/RiskGaugeChart';
import HealthParametersChart from '../Charts/HealthParametersChart';

const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    gender: '',
    Age: '',
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    smoking_status: 'never',
    physical_activity: 1
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.Age || !formData.Glucose || !formData.BloodPressure || !formData.BMI) {
        throw new Error('Please fill in all required fields');
      }

      // Convert string values to appropriate types and handle empty values
      const processedData = {
        gender: formData.gender || 'Female', // Default to Female if not specified
        Age: parseInt(formData.Age) || 0,
        Pregnancies: parseInt(formData.Pregnancies) || 0,
        Glucose: parseFloat(formData.Glucose) || 0,
        BloodPressure: parseFloat(formData.BloodPressure) || 0,
        SkinThickness: parseFloat(formData.SkinThickness) || 0,
        Insulin: parseFloat(formData.Insulin) || 0,
        BMI: parseFloat(formData.BMI) || 0,
        DiabetesPedigreeFunction: parseFloat(formData.DiabetesPedigreeFunction) || 0,
        smoking_status: formData.smoking_status || 'never',
        physical_activity: parseInt(formData.physical_activity) || 1
      };

      console.log('Sending data:', processedData);

      // Replace with your actual Flask backend URL
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Prediction result:', result);
      setPrediction(result);
      setCurrentStep(4); // Move to results step
    } catch (err) {
      setError(`Failed to get prediction: ${err.message}. Please check your connection and try again.`);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      Age: '',
      Pregnancies: '',
      Glucose: '',
      BloodPressure: '',
      SkinThickness: '',
      Insulin: '',
      BMI: '',
      DiabetesPedigreeFunction: '',
      smoking_status: 'never',
      physical_activity: 1
    });
    setPrediction(null);
    setError('');
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getRiskColor = (risk) => {
    if (risk === 'High' || risk === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (risk === 'Medium' || risk === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskIcon = (risk) => {
    if (risk === 'High' || risk === 'high') return <AlertCircle className="w-8 h-8" />;
    if (risk === 'Medium' || risk === 'medium') return <Activity className="w-8 h-8" />;
    return <CheckCircle className="w-8 h-8" />;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.gender && formData.Age && formData.Glucose && formData.BloodPressure;
      case 2:
        return formData.SkinThickness !== '' && formData.Insulin !== '' && formData.BMI;
      case 3:
        return formData.DiabetesPedigreeFunction !== '' && formData.smoking_status;
      default:
        return true;
    }
  };

  // Helper function to get risk level description
  const getRiskDescription = (risk) => {
    switch (risk) {
      case 'High':
        return {
          title: 'High Risk',
          description: 'Based on your input, you have a high risk of diabetes. We strongly recommend consulting with a healthcare professional for proper evaluation and management.',
          recommendations: [
            'Schedule an appointment with your doctor immediately',
            'Monitor blood glucose levels regularly',
            'Follow a diabetes-friendly diet',
            'Engage in regular physical activity',
            'Take prescribed medications as directed'
          ]
        };
      case 'Medium':
        return {
          title: 'Medium Risk',
          description: 'You have a moderate risk of developing diabetes. Consider lifestyle changes and regular monitoring.',
          recommendations: [
            'Maintain a healthy diet low in processed sugars',
            'Exercise regularly (at least 150 minutes per week)',
            'Monitor your weight and BMI',
            'Get regular check-ups with your healthcare provider',
            'Reduce stress and get adequate sleep'
          ]
        };
      default:
        return {
          title: 'Low Risk',
          description: 'Based on your current profile, you have a low risk of diabetes. Continue maintaining healthy habits.',
          recommendations: [
            'Continue eating a balanced, nutritious diet',
            'Maintain regular physical activity',
            'Keep up with routine health screenings',
            'Stay hydrated and get enough sleep',
            'Monitor any changes in your health status'
          ]
        };
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Risk Assessment</h1>
          <p className="text-xl text-gray-600">Get AI-powered insights about your diabetes risk</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step === 4 && prediction ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-full h-1 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Medical Data</span>
            <span>Lifestyle</span>
            <span>Results</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age (years) *
                    </label>
                    <input
                      type="number"
                      name="Age"
                      value={formData.Age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 45"
                      min="1"
                      max="120"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Pregnancies
                    </label>
                    <input
                      type="number"
                      name="Pregnancies"
                      value={formData.Pregnancies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 2 (0 if male or never pregnant)"
                      min="0"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Droplets className="w-4 h-4 mr-2" />
                      Glucose Level (mg/dL) *
                    </label>
                    <input
                      type="number"
                      name="Glucose"
                      value={formData.Glucose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 120"
                      min="50"
                      max="300"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Blood Pressure (mmHg) *
                    </label>
                    <input
                      type="number"
                      name="BloodPressure"
                      value={formData.BloodPressure}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 70 (Diastolic pressure)"
                      min="40"
                      max="140"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Medical Data */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Thermometer className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Medical Measurements</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Ruler className="w-4 h-4 mr-2" />
                      Skin Thickness (mm) *
                    </label>
                    <input
                      type="number"
                      name="SkinThickness"
                      value={formData.SkinThickness}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 20"
                      min="5"
                      max="60"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Triceps skin fold thickness</p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Target className="w-4 h-4 mr-2" />
                      Insulin Level (μU/mL) *
                    </label>
                    <input
                      type="number"
                      name="Insulin"
                      value={formData.Insulin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 80"
                      min="10"
                      max="500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">2-Hour serum insulin</p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Weight className="w-4 h-4 mr-2" />
                      BMI (kg/m²) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="BMI"
                      value={formData.BMI}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 25.3"
                      min="10"
                      max="50"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Body Mass Index</p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Diabetes Pedigree Function *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="DiabetesPedigreeFunction"
                      value={formData.DiabetesPedigreeFunction}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., 0.5"
                      min="0"
                      max="2"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Family history likelihood (0.0 - 2.0)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Lifestyle Factors */}
            {currentStep === 3 && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Lifestyle Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Smoking Status *
                    </label>
                    <select
                      name="smoking_status"
                      value={formData.smoking_status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="never">Never smoked</option>
                      <option value="former">Former smoker</option>
                      <option value="current">Current smoker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Physical Activity Level *
                    </label>
                    <select
                      name="physical_activity"
                      value={formData.physical_activity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value={1}>High (Regular exercise)</option>
                      <option value={0.5}>Moderate (Some exercise)</option>
                      <option value={0}>Low (Little to no exercise)</option>
                    </select>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{formData.Age} years</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium">{formData.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">BMI:</span>
                      <span className="ml-2 font-medium">{formData.BMI}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Glucose:</span>
                      <span className="ml-2 font-medium">{formData.Glucose} mg/dL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && prediction && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Risk Assessment Results</h2>
                  <p className="text-gray-600">Based on your provided information</p>
                </div>

                <div className={`p-8 rounded-2xl border-2 ${getRiskColor(prediction.risk_level || prediction.risk || prediction.prediction)} mb-6 text-center`}>
                  <div className="flex justify-center mb-4">
                    {getRiskIcon(prediction.risk_level || prediction.risk || prediction.prediction)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {prediction.risk_level || prediction.risk || prediction.prediction || 'Unknown'} Risk
                  </h3>
                  {(prediction.risk_percentage || prediction.probability) && (
                    <p className="text-lg">
                      Risk Score: {Math.round((prediction.risk_percentage || prediction.probability * 100))}%
                    </p>
                  )}
                  {prediction.confidence && (
                    <p className="text-sm opacity-80 mt-2">Confidence: {Math.round(prediction.confidence * 100)}%</p>
                  )}
                </div>

                {/* Detailed Analysis Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center shadow-lg"
                  >
                    {showDetailedAnalysis ? (
                      <>
                        <PieChart className="w-5 h-5 mr-2" />
                        Hide Detailed Analysis
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        View Detailed Analysis
                      </>
                    )}
                  </button>
                </div>

                {/* Detailed Analysis Components */}
                {showDetailedAnalysis && (
                  <div className="space-y-8 mb-8">
                    {/* Risk Gauge Chart */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Risk Level Overview</h3>
                      <RiskGaugeChart 
                        riskPercentage={prediction.risk_percentage || prediction.probability * 100}
                        riskLevel={prediction.risk_level || prediction.risk || prediction.prediction}
                      />
                    </div>

                    {/* Health Parameters Bar Chart */}
                    <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Health Parameters Analysis</h3>
                      <HealthParametersChart 
                        formData={formData}
                        prediction={prediction}
                      />
                    </div>
                  </div>
                )}

                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      Personalized Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 mx-8 mb-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="p-8 bg-gray-50 flex justify-between items-center">
              {currentStep > 1 && currentStep < 4 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}

              <div className="flex space-x-4 ml-auto">
                {currentStep < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                  </button>
                )}

                {currentStep === 3 && (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid(currentStep)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Get Assessment
                      </>
                    )}
                  </button>
                )}

                {currentStep === 4 && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                  >
                    New Assessment
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h4>
              <p className="text-sm text-yellow-700 leading-relaxed">
                This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare providers regarding any medical condition or health concerns. 
                The predictions are based on statistical models and individual results may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;