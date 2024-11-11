import { useState } from 'react';
import axios from 'axios';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    gender: '',
    medicalHistory: '',
    location: ''
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
    const dataToSubmit = {
      ...formData,
      medicalHistory: formData.medicalHistory.split(',').map((item) => item.trim())
    };

    try {
      const response = await axios.post('https://microland-hackaton-backend.onrender.com/api/patients', dataToSubmit);
      console.log('Patient added:', response.data);
      alert('Patient added successfully');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Add Patient</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="id" placeholder="ID" onChange={handleChange} required />
        <input style={styles.input} type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input style={styles.input} type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input style={styles.input} type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input style={styles.input} type="text" name="gender" placeholder="Gender" onChange={handleChange} required />
        <input style={styles.input} type="text" name="medicalHistory" placeholder="Medical History (comma-separated)" onChange={handleChange} required />
        <input style={styles.input} type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <button style={styles.button} type="submit">Add Patient</button>
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
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  }
};

export default AddPatient;
