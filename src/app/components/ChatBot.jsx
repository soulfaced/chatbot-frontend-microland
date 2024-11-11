"use client";
import { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const ChatBot = ({ patient }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const handleVoiceInput = () => {
    setIsListening(true);
    setIsRecording(true);
    recognition.start();
  };

  const handleStopVoiceInput = () => {
    setIsListening(false);
    setIsRecording(false);
    recognition.stop();
  };

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    setQuestion(transcript);
    sendMessage(transcript);
  });

  recognition.addEventListener('error', (event) => {
    console.error("Voice recognition error:", event.error);
    setIsListening(false);
    setIsRecording(false);
  });

  // Function to send a message to the chatbot
  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        `https://microland-hackaton-backend.onrender.com/ask`,
        { question: message },
        { withCredentials: true }
      );
      const answer = response.data.answer;
      
      setChatHistory([...chatHistory, { question: message, answer }]);
      setQuestion('');

      if (answer.includes("appointment with")) {
        bookAppointmentFromResponse(answer);
      }
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const handleSendMessage = () => {
    if (!question.trim()) return;
    sendMessage(question);
  };

  // Helper function to format messages with Markdown
  const renderFormattedText = (text) => {
    const html = marked(text); // Parse Markdown to HTML
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="chat-container">
      <h1>Healthcare Chatbot</h1>
      <div id="chat-box" className="chat-box">
        {chatHistory.map((entry, index) => (
          <div key={index} className="message">
            {entry.question && <div className="user-message bubble"><p><strong>You:</strong> {entry.question}</p></div>}
            {entry.answer && <div className="bot-message bubble">{renderFormattedText(entry.answer)}</div>}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ask a health-related question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="icon-button">Send</button>
        <button onClick={isListening ? handleStopVoiceInput : handleVoiceInput} className="voice-button">
          {isRecording ? <span className="recording-indicator"></span> : '🎤'}
        </button>
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
          background-color: #e0f7f9;
          border-radius: 15px;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 26px;
          color: #1d5c63;
          margin-bottom: 20px;
          animation: fadeIn 1s ease-in-out;
        }

        .chat-box {
          width: 100%;
          height: 300px;
          overflow-y: auto;
          background-color: #f0faff;
          border-radius: 10px;
          padding: 15px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
          margin-bottom: 15px;
          animation: slideIn 0.5s ease-in-out;
        }

        .message {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .user-message.bubble {
          align-self: flex-end;
          background-color: #4db6ac;
          color: #ffffff;
          padding: 10px;
          border-radius: 15px 15px 0 15px;
          max-width: 75%;
          margin: 5px 0;
          font-weight: 500;
        }

        .bot-message.bubble {
          background-color: #f1f8e9;
          color: #37474f;
          padding: 10px;
          border-radius: 15px 15px 15px 0;
          max-width: 75%;
          margin: 5px 0;
        }

        .input-container {
          display: flex;
          width: 100%;
          align-items: center;
        }

        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #cfd8dc;
          border-radius: 5px;
          font-size: 16px;
        }

        .icon-button {
          background-color: #4db6ac;
          color: #ffffff;
          border: none;
          padding: 10px 15px;
          margin-left: 5px;
          border-radius: 5px;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .icon-button:hover {
          background-color: #00897b;
        }

        .voice-button {
          background-color: ${isListening ? '#FF6B6B' : '#4db6ac'};
          color: #ffffff;
          border: none;
          padding: 10px;
          margin-left: 5px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .recording-indicator {
          width: 12px;
          height: 12px;
          background-color: #FF6B6B;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
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
