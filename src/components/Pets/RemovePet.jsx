import { useState } from "react";
import { useDispatch } from "react-redux";
import { DeletePet, GetPets } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import { FaTrash, FaPaw } from "react-icons/fa";
import { getSpeciesName, getSexName, calculateAge } from "../../utils";

export default function RemovePet({ pet, fullWidth = false }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      await dispatch(DeletePet(pet.id));
      await dispatch(GetPets());
      handleClose();
    } catch (error) {
      alert("Error al eliminar la mascota: " + error.message);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={handleShow}
        style={{ margin: "5px", width: fullWidth ? "100%" : "auto" }}
        title="Eliminar mascota"
      >
        <FaTrash /> Eliminar
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            {pet.profile_picture_url ? (
              <img
                src={pet.profile_picture_url}
                alt={pet.pet_name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #dc3545",
                  marginBottom: "15px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 15px",
                  border: "3px solid #dc3545",
                }}
              >
                <FaPaw color="#ccc" size={40} />
              </div>
            )}
          </div>

          <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
            ¿Estás seguro de que deseas eliminar a:
          </p>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <h5
              style={{
                color: "#103585",
                fontWeight: "700",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {pet.pet_name}
            </h5>

            <div style={{ fontSize: "0.95rem", color: "#555" }}>
              <p style={{ marginBottom: "8px" }}>
                <strong>Especie:</strong> {getSpeciesName(parseInt(pet.species))}
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>Raza:</strong> {pet.breed}
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>Edad:</strong> {calculateAge(pet.birth_date)}
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>Sexo:</strong> {getSexName(parseInt(pet.sex))}
              </p>
              {pet.owner && (
                <p style={{ marginBottom: "0" }}>
                  <strong>Dueño/a:</strong> {pet.owner.first_name}{" "}
                  {pet.owner.lastname}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#fff3cd",
              borderLeft: "4px solid #ffc107",
              borderRadius: "5px",
            }}
          >
            <p
              style={{
                margin: "0",
                color: "#856404",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ <strong>Advertencia:</strong> Esta acción no se puede deshacer.
              Toda la información de la mascota será eliminada permanentemente.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrash /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
