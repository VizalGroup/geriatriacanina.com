import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeletePrescription, DeletePrescriptionMedication, GetPrescriptions, GetPrescriptionMedications } from "../../redux/actions";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { capitalizeName, getPrescriptionType } from "../../utils";

export default function RemovePrescription({ prescription }) {
  const dispatch = useDispatch();
  const prescriptionMedications = useSelector((state) => state.prescriptionMedications);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Filtrar medicamentos asociados a esta prescripción
      const associatedMedications = prescriptionMedications.filter(
        (med) => med.prescription_id === prescription.id
      );

      // Eliminar todos los medicamentos asociados primero
      for (const medication of associatedMedications) {
        await dispatch(DeletePrescriptionMedication(medication.id));
      }

      // Luego eliminar la prescripción
      await dispatch(DeletePrescription(prescription.id));
      
      // Actualizar las listas
      await dispatch(GetPrescriptions());
      await dispatch(GetPrescriptionMedications());
      
      setIsDeleting(false);
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la indicación:", error);
      alert("Error al eliminar la indicación: " + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-delete-${prescription.id}`}>
            Eliminar indicación
          </Tooltip>
        }
      >
        <button
          className="btn btn-secondary"
          onClick={handleShow}
          style={{ margin: "2px" }}
        >
          <FaTrash />
        </button>
      </OverlayTrigger>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Indicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "1.1rem" }}>
            ¿Estás seguro de que deseas eliminar la solicitud de:
          </p>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              <strong>Veterinario/a:</strong> Dr/a{" "}
              {capitalizeName(prescription.vet?.lastname)}{" "}
              {capitalizeName(prescription.vet?.first_name)}
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>Mascota:</strong>{" "}
              {capitalizeName(prescription.pet?.pet_name)}
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>Tipo:</strong> {getPrescriptionType(prescription.prescription_type)}
            </p>
            {prescription.title && prescription.title.trim() !== "" && (
              <p style={{ marginBottom: "0" }}>
                <strong>Título:</strong> {prescription.title}
              </p>
            )}
          </div>
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
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
              {prescriptionMedications.filter((med) => med.prescription_id === prescription.id).length > 0 && (
                <> También se eliminarán todos los medicamentos asociados.</>
              )}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Eliminando...
              </>
            ) : (
              <>
                <FaTrash /> Eliminar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
