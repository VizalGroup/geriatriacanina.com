import { useState, useEffect } from "react";
import { Modal, Button, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPaw, FaDog, FaCat } from "react-icons/fa";
import { getSpeciesName, capitalizeName } from "../../utils";

export default function UserPetsModal({ show, onHide, userId }) {
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pets);
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && userId) {
      setLoading(true);
      // Filtrar las mascotas del usuario
      const filtered = pets.filter((pet) => parseInt(pet.owner_id) === parseInt(userId));
      setUserPets(filtered);
      setLoading(false);
    }
  }, [show, userId, pets]);

  const getSpeciesIcon = (species) => {
    if (parseInt(species) === 0) return <FaDog size={18} style={{ marginRight: "8px" }} />;
    if (parseInt(species) === 1) return <FaCat size={18} style={{ marginRight: "8px" }} />;
    return <FaPaw size={18} style={{ marginRight: "8px" }} />;
  };

  const handlePetClick = (petId) => {
    window.scrollTo(0, 0);
    navigate(`/inicio/mascotas/${petId}`);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mascotas del Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : userPets.length === 0 ? (
          <p className="text-center text-muted">Este usuario no tiene mascotas registradas.</p>
        ) : (
          <ListGroup>
            {userPets.map((pet) => (
              <ListGroupItem
                key={pet.id}
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handlePetClick(pet.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {getSpeciesIcon(pet.species)}
                  <div>
                    <div style={{ fontWeight: "600", color: "#103585" }}>
                      {capitalizeName(pet.pet_name)}
                    </div>
                    <small className="text-muted">
                      {getSpeciesName(parseInt(pet.species))} - Raza: {pet.breed || "No especificada"}
                    </small>
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backgroundColor: parseInt(pet.current_state) === 1 ? "#d4edda" : "#fff3cd",
                    color: parseInt(pet.current_state) === 1 ? "#155724" : "#856404",
                  }}
                >
                  {parseInt(pet.current_state) === 1 ? "Validada" : "Pendiente"}
                </span>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
