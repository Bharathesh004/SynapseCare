import React from 'react';
import { 
  ArrowRight, 
  Heart, 
  Brain, 
  Activity, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const services = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Heart Disease Risk Assessment",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      title: "Diabetes Prediction",
      description: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: "Neurological Health Screening",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Preventive Care Planning",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Real-time Health Monitoring",
      description: "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Family Health Tracking",
      description: "Ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione."
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "HIPAA Compliant",
      description: "Your data is secure and private"
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      title: "Instant Results",
      description: "Get predictions in seconds"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      title: "Medically Validated",
      description: "Approved by healthcare professionals"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. SynapseCare has revolutionized how we approach preventive care.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "Ut enim ad minim veniam, quis nostrud exercitation. The early detection saved my life. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Family Physician",
      content: "Duis aute irure dolor in reprehenderit. This tool has become essential in my practice for risk assessment.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Health,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Predicted</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Harness the power of AI to predict health risks before they become problems. 
                Get personalized insights and take control of your wellness journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/predict"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
                >
                  Start Risk Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-all">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Health Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm font-medium">Heart Health</span>
                    </div>
                    <span className="text-green-600 font-bold">Low Risk</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-yellow-500 mr-3" />
                      <span className="text-sm font-medium">Diabetes Risk</span>
                    </div>
                    <span className="text-yellow-600 font-bold">Medium Risk</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-sm font-medium">Overall Score</span>
                    </div>
                    <span className="text-blue-600 font-bold">85/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered health assessments designed to keep you ahead of potential health issues.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <button className="mt-6 text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SynapseCare?</h2>
            <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust SynapseCare for their health predictions and preventive care.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all inline-flex items-center">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;