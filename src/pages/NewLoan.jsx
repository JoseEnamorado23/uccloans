import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoanForm from '../components/Business/LoanForm/LoanForm';

const NewLoan = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log('Datos del préstamo:', formData);
    // Aquí guardarás en la base de datos
    // navigate('/prestamos'); // Redirigir después de guardar
  };

  const handleCancel = () => {
    // Podrías redirigir a otra página o simplemente limpiar el form
    navigate('/');
  };

  return (
    <div>
      <LoanForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default NewLoan;