import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-4">
        Revolutionize Your AI Quality Assurance in Minutes!
      </h1>
      <p className="text-lg text-center mb-8">
        Streamlined quality assurance for AI interactions, designed for developers and QA teams.
      </p>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">MVP Features</h2>
        <ul className="list-disc list-inside">
          <li>Automated testing scripts generation for specific AI interactions</li>
          <li>User-friendly interface for non-technical QA team members</li>
          <li>Integration with popular AI platforms (e.g., Dialogflow, Rasa)</li>
          <li>Real-time performance metrics and reports</li>
          <li>Collaboration tools for feedback and issue tracking among team members</li>
        </ul>
      </div>
    </main>
  );
};

export default LandingPage;