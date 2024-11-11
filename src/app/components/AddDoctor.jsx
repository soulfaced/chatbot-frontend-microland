import { useState } from 'react';
import axios from 'axios';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    workExperience: '',
    speciality: '',
    location: '',
    timeSlot: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://microland-hackaton-backend.onrender.com/api/doctors', formData);
      console.log('Doctor added:', response.data);
      alert('Doctor added successfully');
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Error adding doctor');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Add Doctor</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="id" placeholder="ID" onChange={handleChange} required />
        <input style={styles.input} type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input style={styles.input} type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input style={styles.input} type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input style={styles.input} type="number" name="workExperience" placeholder="Work Experience" onChange={handleChange} required />
        <input style={styles.input} type="text" name="speciality" placeholder="Speciality" onChange={handleChange} required />
        <input style={styles.input} type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input style={styles.input} type="text" name="timeSlot" placeholder="Time Slot (e.g., 10:00 AM - 1:00 PM)" onChange={handleChange} required />
        <button style={styles.button} type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonHover: {
    backgroundColor: '#218838'
  }
};

export default AddDoctor;
