import React from 'react';
import './CustomAlert.css'; // Importe le fichier CSS séparé pour le style

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  return (
    <div className="alert-box">
        <div className="load">
            <img src="../logo.png" alt="" />
        </div>
      <p>{message}</p>
      <button className="close-btn" style={{ backgroundColor: 'var(--win-color)' , fontWeight: '1000'}} onClick={onClose}>
        OK
      </button>
    </div>
  );
};

export default CustomAlert;
