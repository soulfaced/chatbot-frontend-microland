"use client";
import { useState } from 'react';
import axios from 'axios';

const ChatBot = ({ patient }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Speech recognition setup (optional)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const handleVoiceInput = () => {
    setIsListening(true);
    recognition.start();
  };

  const handleStopVoiceInput = () => {
    setIsListening(false);
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
  });

  // Function to send a message to the chatbot
  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        `https://microland-hackaton-backend.onrender.com/ask`,
        { question: message },
        { withCredentials: true } // This ensures the session cookie is sent
    );
      const answer = response.data.answer;
      
      setChatHistory([...chatHistory, { question: message, answer }]);
      setQuestion('');

      // Check if the chatbot's response includes an appointment confirmation
      if (answer.includes("appointment with")) {
        bookAppointmentFromResponse(answer);
      }

      setIsListening(false);
    } catch (error) {
      console.error('Error asking question:', error);
      setIsListening(false);
    }
  };

  // Function to parse the chatbot's response and call the booking API
  const bookAppointmentFromResponse = (answer) => {
    // Extract details from the chatbot's answer using regex or simple string parsing
    const doctorNameMatch = answer.match(/Dr\. ([A-Za-z\s]+) \((ID: MLD\d+)\)/);
    const specialityMatch = answer.match(/a ([A-Za-z]+) in Nagpur/);
    const timeSlotMatch = answer.match(/from (\d{1,2}:\d{2} (?:AM|PM) \d{1,2}:\d{2} (?:AM|PM))/);
    const conditionMatch = answer.match(/for your ([A-Za-z\s]+)/);

    if (doctorNameMatch && specialityMatch && timeSlotMatch && conditionMatch) {
      const doctorName = doctorNameMatch[1];
      const doctorID = doctorNameMatch[2];
      const speciality = specialityMatch[1];
      const timeSlot = timeSlotMatch[1];
      const condition = conditionMatch[1];
      
      const appointmentDetails = {
        patientName: patient.name,
        doctorName,
        doctorID,
        speciality,
        location: "Nagpur",
        timeSlot,
        condition
      };

      // Call the backend to save the appointment
      axios.post('https://microland-hackaton-backend.onrender.com/save-appointment', appointmentDetails)
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((error) => {
          console.error('Error saving appointment:', error);
        });
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
          <div key={index} className="message">
            {entry.question && <div className="user-message bubble"><p><strong>You:</strong> {entry.question}</p></div>}
            {entry.answer && <div className="bot-message bubble">{entry.answer}</div>}
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
      `}</style>
    </div>
  );
};

export default ChatBot;
