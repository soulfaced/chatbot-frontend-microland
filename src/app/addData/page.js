"use client";
import { useState } from 'react';
import AddPatient from '../components/AddPatient';
import AddDoctor from '../components/AddDoctor';

const AddData = () => {
  const [formType, setFormType] = useState(null); // Track whether to show AddPatient or AddDoctor form

  const handleFormSelection = (type) => {
    setFormType(type);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add Data</h1>

      <div style={styles.buttonContainer}>
        <button
          style={formType === 'patient' ? styles.activeButton : styles.button}
          onClick={() => handleFormSelection('patient')}
        >
          Add Patient
        </button>
        <button
          style={formType === 'doctor' ? styles.activeButton : styles.button}
          onClick={() => handleFormSelection('doctor')}
        >
          Add Doctor
        </button>
      </div>

      <div style={styles.formContainer}>
        {formType === 'patient' && <AddPatient />}
        {formType === 'doctor' && <AddDoctor />}
        {!formType && (
          <p style={styles.infoText}>
            Please select an option above to add data for a patient or doctor.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  header: {
    color: '#333',
    fontSize: '24px',
    marginBottom: '30px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #007bff',
    backgroundColor: '#fff',
    color: '#007bff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  formContainer: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  infoText: {
    color: '#666',
    fontSize: '16px',
    fontStyle: 'italic'
  }
};

export default AddData;
