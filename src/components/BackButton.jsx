import React from 'react'
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    
    // Si estamos en la raíz o solo hay un segmento, ir a la raíz
    if (pathSegments.length <= 1) {
      navigate('/');
      return;
    }
    
    // Eliminar el último segmento para ir un nivel arriba
    pathSegments.pop();
    const parentPath = '/' + pathSegments.join('/');
    
    navigate(parentPath);
  };

  return (
    <Button
      variant="primary"
      onClick={handleBack}
      style={{ margin: "5px" }}
    >
      <FaArrowLeft /> Volver
    </Button>
  );
}
