import { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import { FaUser, FaSearch } from "react-icons/fa";
import { capitalizeName, normalizeText } from "../utils";

export default function UserSearchSelect({ users, selectedUserId, onUserSelect, disabled = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dropdownRef = useRef(null);

  // Encontrar el usuario seleccionado actual
  const selectedUser = users.find((user) => user.id === parseInt(selectedUserId));

  useEffect(() => {
    // Si hay un usuario seleccionado, mostrar su nombre
    if (selectedUser) {
      setSearchTerm(`${capitalizeName(selectedUser.lastname)}, ${capitalizeName(selectedUser.first_name)}`);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const normalized = normalizeText(searchTerm);
      const filtered = users.filter((user) => {
        const fullName = normalizeText(`${user.first_name} ${user.lastname}`);
        const reverseName = normalizeText(`${user.lastname} ${user.first_name}`);
        return fullName.includes(normalized) || reverseName.includes(normalized);
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleUserSelect = (user) => {
    setSearchTerm(`${capitalizeName(user.lastname)}, ${capitalizeName(user.first_name)}`);
    onUserSelect(user.id);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <Form.Group controlId="owner_search">
        <Form.Label>
          <FaUser /> Tutor/a
        </Form.Label>
        <div style={{ position: "relative" }}>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Buscar por nombre o apellido..."
            disabled={disabled}
            style={{ paddingRight: "35px" }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
              pointerEvents: "none",
            }}
          />
        </div>
        <Form.Text className="text-muted">
          Escribe el nombre o apellido del tutor/a
        </Form.Text>
      </Form.Group>

      {showDropdown && filteredUsers.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            marginTop: "5px",
          }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <div style={{ fontWeight: "600", color: "#103585" }}>
                {capitalizeName(user.lastname)}, {capitalizeName(user.first_name)}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                {user.email}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchTerm && filteredUsers.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            marginTop: "5px",
            padding: "15px",
            textAlign: "center",
            color: "#6c757d",
          }}
        >
          No se encontraron tutores con ese nombre
        </div>
      )}
    </div>
  );
}
