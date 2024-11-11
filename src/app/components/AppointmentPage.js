// components/AppointmentPage.js
import { useState } from 'react';
import axios from 'axios';

const AppointmentPage = ({ availableDoctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState('');

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor to book an appointment.");
      return;
    }

    try {
      const response = await axios.post('https://microland-hackaton-backend.onrender.com/book-appointment', {
        doctorId: selectedDoctor.id,
        timeSlot: selectedDoctor.timeSlot
      }, { withCredentials: true });

      setAppointmentStatus(response.data.message);
    } catch (error) {
      setAppointmentStatus('Error booking appointment. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="appointment-page">
      <h2>Available Doctors</h2>
      <ul>
        {availableDoctors.map((doctor) => (
          <li key={doctor.id} onClick={() => handleSelectDoctor(doctor)} className="doctor-item">
            <p><strong>Doctor:</strong> {doctor.name}</p>
            <p><strong>Specialty:</strong> {doctor.speciality}</p>
            <p><strong>Time Slot:</strong> {doctor.timeSlot}</p>
          </li>
        ))}
      </ul>
      {selectedDoctor && (
        <div>
          <h3>Selected Doctor: {selectedDoctor.name}</h3>
          <button onClick={handleBookAppointment} className="book-button">Confirm Appointment</button>
        </div>
      )}
      {appointmentStatus && <p>{appointmentStatus}</p>}

      <style jsx>{`
        .doctor-item {
          cursor: pointer;
          padding: 10px;
          background: #f0faff;
          margin: 5px 0;
          border-radius: 5px;
        }

        .doctor-item:hover {
          background: #e0f7f9;
        }

        .book-button {
          padding: 10px 20px;
          background-color: #4db6ac;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .book-button:hover {
          background-color: #00897b;
        }
      `}</style>
    </div>
  );
};

export default AppointmentPage;
