import { Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      margin: '20px 0' 
    }}>
      <Button 
        variant="primary" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        style={{ marginRight: '10px' }}
      >
        <FaChevronLeft />
      </Button>
      <span style={{ 
        margin: '0 15px',
        fontWeight: '600',
        color: '#103585'
      }}>
        Página {currentPage} de {totalPages}
      </span>
      <Button 
        variant="primary" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        style={{ marginLeft: '10px' }}
      >
        <FaChevronRight />
      </Button>
    </div>
  )
}
