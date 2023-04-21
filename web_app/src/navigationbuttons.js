// components/NavigationButtons.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const NavigationButtons = () => {
  const history = useHistory();

  const handleClick = (path) => {
    history.push(path);
  };

  return (
    <div>
      <button onClick={() => handleClick('/first-page')}>First Page</button>
      <button onClick={() => handleClick('/doctor-dashboard')}>Doctor Dashboard</button>
      <button onClick={() => handleClick('/patient-dashboard')}>Patient Dashboard</button>
      <button onClick={() => handleClick('/doctor-dashboard/medical-assistance')}>Medical Assistance</button>
      <button onClick={() => handleClick('/doctor-dashboard/doctor-history')}>Doctor History</button>
      <button onClick={() => handleClick('/doctor-dashboard/doctor-funds')}>Doctor Funds</button>
      <button onClick={() => handleClick('/patient-dashboard/patient-medical-assistance')}>Patient Medical Assistance</button>
      <button onClick={() => handleClick('/patient-dashboard/patient-funds')}>Patient Funds</button>
      <button onClick={() => handleClick('/patient-dashboard/patient-history')}>Patient History</button>
    </div>
  );
};

export default NavigationButtons;
