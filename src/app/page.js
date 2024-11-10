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
    <div>
      {!patient ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatBot patient={patient} />
      )}
    </div>
  );
}
