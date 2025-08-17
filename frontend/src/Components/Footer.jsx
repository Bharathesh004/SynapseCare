import React from 'react';
import { Brain, Mail, Phone, MapPin, Heart, Shield, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SynapseCare</h1>
                <p className="text-sm text-gray-400">AI-Powered Healthcare</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering individuals with AI-driven health insights and personalized risk assessments. 
              Our mission is to make healthcare more accessible and preventive through cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Award className="w-4 h-4 mr-2" />
                FDA Approved
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">support@synapsecare.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">123 Health Street, Medical City, MC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SynapseCare. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center text-sm text-gray-400">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              Made with care for better health
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;