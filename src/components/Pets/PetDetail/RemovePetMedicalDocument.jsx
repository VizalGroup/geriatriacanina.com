import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { DeletePetMedicalDocument, GetPetMedicalDocuments } from "../../../redux/actions";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { getPetMedicalDocumentType } from "../../../utils";

export default function RemovePetMedicalDocument({ document }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(DeletePetMedicalDocument(document.id));
      await dispatch(GetPetMedicalDocuments());
      handleClose();
    } catch (error) {
      console.error("Error al eliminar el documento médico: ", error);
      alert("Error al eliminar el documento. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={handleShow}
        style={{ flex: 1 }}
        title="Eliminar documento"
      >
        <FaTrash />
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#dc3545", color: "white" }}>
          <Modal.Title>
            <FaExclamationTriangle /> Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
            ¿Está seguro que desea eliminar el siguiente documento?
          </p>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              <strong>Documento:</strong> {document.document_title}
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>Tipo:</strong>{" "}
              {getPetMedicalDocumentType(parseInt(document.document_type))}
            </p>
            <p style={{ marginBottom: "0" }}>
              <strong>Cargado por:</strong> {document.user?.lastname},{" "}
              {document.user?.first_name}
            </p>
          </div>
          <p style={{ color: "#dc3545", fontWeight: "500", marginBottom: "0" }}>
            <FaExclamationTriangle /> Esta acción no se puede deshacer.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
