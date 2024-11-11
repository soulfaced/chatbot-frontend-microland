// src/app/page.js
"use client";

import { useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import ChatBot from './components/ChatBot.jsx';

export default function Home() {
  const [patient, setPatient] = useState(null);

  const handleLoginSuccess = (patientData) => {
    setPatient(patientData);
  };

  return (
    <div className="home-container">
      {!patient ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatBot patient={patient} />
      )}

      <style jsx>{`
        .home-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f7fa, #fff);
          padding: 20px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
