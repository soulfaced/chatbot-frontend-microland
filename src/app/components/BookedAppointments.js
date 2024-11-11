// components/BookedAppointments.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const BookedAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('https://microland-hackaton-backend.onrender.com/get-appointments', {
          withCredentials: true
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Booked Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            <p>Doctor: {appointment.doctorName}</p>
            <p>Specialty: {appointment.speciality}</p>
            <p>Time Slot: {appointment.timeSlot}</p>
            <p>Patient: {appointment.patientName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookedAppointments;
