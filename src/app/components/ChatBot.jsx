// components/ChatBot.js
"use client";
import { useState } from 'react';
import axios from 'axios';

const ChatBot = ({ patient }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const handleVoiceInput = () => {
    recognition.start();
  };

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    setQuestion(transcript);
    sendMessage(transcript);
  });

  recognition.addEventListener('error', (event) => {
    console.error("Voice recognition error:", event.error);
  });

  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ask`,
        { question: message },
        { withCredentials: true }
      );
      const answer = response.data.answer;
      setChatHistory([...chatHistory, { question: message, answer }]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const handleSendMessage = () => {
    if (!question.trim()) return;
    sendMessage(question);
  };

  return (
    <div className="chat-container">
      <h1>Healthcare Chatbot</h1>
      <div id="chat-box" className="chat-box">
        {chatHistory.map((entry, index) => (
          <div key={index} className={entry.question ? 'user-message' : 'bot-message'}>
            {entry.question && <p><strong>You:</strong> {entry.question}</p>}
            {entry.answer && (
              <div className="bot-message">
                {entry.answer.split('\n').map((line, idx) => (
                  <p key={idx}>{line.replace(/[*-]/g, '').trim()}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          id="question-input"
          placeholder="Ask a health-related question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button id="voice-button" className="icon-button" onClick={handleVoiceInput}>🎤</button>
        <button id="send-button" className="icon-button" onClick={handleSendMessage}>➤</button>
      </div>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        .chat-box {
          width: 100%;
          height: 300px;
          overflow-y: auto;
          background-color: #fff;
          border-radius: 10px;
          padding: 10px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
        }

        .user-message, .bot-message {
          margin-bottom: 10px;
        }

        .user-message {
          color: #007bff;
          text-align: right;
        }

        .bot-message {
          color: #333;
          text-align: left;
        }

        .input-container {
          display: flex;
          width: 100%;
        }

        #question-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }

        .icon-button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 0 15px;
          margin-left: 5px;
          border-radius: 5px;
          font-size: 18px;
          cursor: pointer;
        }

        .icon-button:focus {
          outline: none;
        }

        #voice-button.listening {
          background-color: #ff6b6b;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
