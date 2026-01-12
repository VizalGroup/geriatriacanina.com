import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div className="search-container">
      <Form.Group className="search-form-group">
        <Form.Label>
          <FaSearch /> Buscar
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </Form.Group>
    </div>
  );
}
