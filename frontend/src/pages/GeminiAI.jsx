import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const GeminiAI = () => {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseHistory, setResponseHistory] = useState([]);

  const { backendUrl, token } = useContext(AppContext); 

  const generateAI = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!prompt.trim()) {
      return toast.error('Please enter your health concern');
    }

    // ✅ Cek apakah token tersedia
    if (!token) {
      return toast.error('Please login first');
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await axios.post(`${backendUrl}/api/user/generate-ai`, {
        prompt: prompt.trim()
      }, {
        headers: { 
          token: token, 
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data); 

      if (response.data.success) {
        setAiResponse(response.data.data);
        
        // Add to history
        const newEntry = {
          id: Date.now(),
          question: prompt,
          answer: response.data.data,
          timestamp: new Date().toLocaleString()
        };
        setResponseHistory(prev => [newEntry, ...prev]);
        
        toast.success('AI recommendation generated successfully!');
        setPrompt(''); // Clear input after successful generation
      } else {
        toast.error(response.data.message || 'Failed to generate AI content');
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error('API endpoint not found. Please check backend configuration.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setResponseHistory([]);
    setAiResponse('');
    toast.info('History cleared');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏥 AI Health Specialist Advisor
          </h1>
          <p className="text-gray-600 text-lg">
            Get AI-powered recommendations for medical specialists based on your health concerns
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your health concern or symptoms:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I have been experiencing chest pain and shortness of breath during exercise..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                generateAI();
              }}
              disabled={isLoading || !prompt.trim() || !token} // ✅ Disable jika tidak ada token
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                isLoading || !prompt.trim() || !token
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                '🤖 Get AI Recommendation'
              )}
            </button>
            
            {responseHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {/* ✅ Tambahkan status login */}
          {!token && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Please login to use AI recommendations
              </p>
            </div>
          )}
        </div>

        {/* Current Response */}
        {aiResponse && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                🎯 AI Recommendation
              </h3>
              <button
                onClick={() => copyToClipboard(aiResponse)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {responseHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📚 Previous Consultations
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {responseHistory.map((entry) => (
                <div key={entry.id} className="border-l-4 border-indigo-200 pl-4 py-2">
                  <div className="mb-2">
                    <p className="font-medium text-gray-700">Question:</p>
                    <p className="text-gray-600 text-sm mb-2">{entry.question}</p>
                    <p className="font-medium text-gray-700">AI Response:</p>
                    <p className="text-gray-600 text-sm">{entry.answer.substring(0, 200)}...</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{entry.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(entry.answer)}
                      className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Copy Full Response
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Medical Disclaimer:</strong> This AI-generated advice is for informational purposes only and should not replace professional medical consultation. Always consult with qualified healthcare professionals for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default GeminiAI;