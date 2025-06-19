import { useState } from 'react';
import Navbar from '@/components/Navbarcomponent/Navbar';
import Footer from '@/components/footer/Footer';

export default function AsterikIVR() {
  const [activeTab, setActiveTab] = useState('ivr-flow');
  const [voiceActor, setVoiceActor] = useState('Joanna');
  const [promptText, setPromptText] = useState('');
  const [ivrName, setIvrName] = useState('');
  const [emailNotification, setEmailNotification] = useState('');
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      date: '2025-06-15',
      rating: 5,
      transcript: 'Your service was excellent! I really appreciated the quick response.',
      audioUrl: '#'
    },
    {
      id: 2,
      date: '2025-06-14',
      rating: 4,
      transcript: 'Pretty good service overall. The system was easy to use.',
      audioUrl: '#'
    },
    {
      id: 3,
      date: '2025-06-10',
      rating: 3,
      transcript: 'Average experience. Could use some improvements in the menu options.',
      audioUrl: '#'
    }
  ]);

  const voiceOptions = [
    'Joanna', 'Matthew', 'Salli', 'Kimberly', 'Kendra', 'Joey', 'Justin', 'Amy'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="pt-[120px] pb-10 bg-gradient-to-r from-[#031f39] to-[#087da8] text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Asterisk IVR System</h1>
          <p className="text-xl max-w-3xl">
            Configure your interactive voice response system with an easy-to-use interface.
            Create custom call flows, voice prompts, and collect valuable customer feedback.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-8">
          <button 
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'ivr-flow' 
              ? 'border-b-2 border-[#087da8] text-[#087da8]' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('ivr-flow')}
          >
            IVR Configuration
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'feedback' 
              ? 'border-b-2 border-[#087da8] text-[#087da8]' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback Results
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'settings' 
              ? 'border-b-2 border-[#087da8] text-[#087da8]' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('settings')}
          >
            System Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ivr-flow' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create IVR Flow</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">IVR Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
                placeholder="Customer Feedback IVR"
                value={ivrName}
                onChange={(e) => setIvrName(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Voice Prompt</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8] h-32"
                placeholder="Thank you for calling. On a scale from 1 to 5, how would you rate your experience today?"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select Voice</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
                value={voiceActor}
                onChange={(e) => setVoiceActor(e.target.value)}
              >
                {voiceOptions.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">IVR Flow Configuration</label>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-md">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Step 1: Welcome Message</h3>
                  <div className="bg-white border border-gray-300 p-3 rounded-md flex items-center justify-between">
                    <div>Play welcome prompt</div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Step 2: Collect Feedback</h3>
                  <div className="bg-white border border-gray-300 p-3 rounded-md flex items-center justify-between">
                    <div>Request rating (1-5) via DTMF</div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Step 3: Voice Message</h3>
                  <div className="bg-white border border-gray-300 p-3 rounded-md flex items-center justify-between">
                    <div>Record caller's voice message</div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Step 4: Goodbye</h3>
                  <div className="bg-white border border-gray-300 p-3 rounded-md flex items-center justify-between">
                    <div>Play thank you message and end call</div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400">
                Preview
              </button>
              <button className="px-6 py-2 bg-[#087da8] text-white rounded-md hover:bg-[#065e7c]">
                Save IVR Flow
              </button>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Customer Feedback Results</h2>
            
            <div className="mb-6 flex items-center">
              <input 
                type="text" 
                placeholder="Search feedback..." 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8] w-64"
              />
              <div className="ml-4">
                <label className="mr-2">Filter by rating:</label>
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]">
                  <option value="">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
              <button className="ml-auto px-4 py-2 bg-[#087da8] text-white rounded-md hover:bg-[#065e7c]">
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Transcript</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData.map((feedback) => (
                    <tr key={feedback.id}>
                      <td className="border border-gray-300 px-4 py-3">{feedback.date}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex">
                          {Array.from({ length: feedback.rating }, (_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {feedback.transcript}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <button className="mr-2 text-blue-600 hover:underline">Listen</button>
                        <button className="text-gray-600 hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                Showing <span className="font-medium">1-3</span> of <span className="font-medium">3</span> results
              </div>
              <div className="flex">
                <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100">Previous</button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-[#087da8] text-white">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100">Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Email Notifications</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Notification Email
                </label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
                  placeholder="admin@example.com"
                  value={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.value)}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Receive feedback notifications at this email address
                </p>
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="includeAudio" className="mr-2" />
                <label htmlFor="includeAudio">Include audio file as attachment</label>
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="includeTranscript" className="mr-2" defaultChecked />
                <label htmlFor="includeTranscript">Include transcript in email</label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">AWS Integration Settings</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  S3 Bucket for Recordings
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
                  placeholder="ivr-recordings-bucket"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  AWS Region
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]">
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Call Handling</h3>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="transcribeAll" className="mr-2" defaultChecked />
                <label htmlFor="transcribeAll">Automatically transcribe all voice messages</label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Maximum Recording Duration (seconds)
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
                  placeholder="60"
                  min="10"
                  max="300"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400">
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#087da8] text-white rounded-md hover:bg-[#065e7c]">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}