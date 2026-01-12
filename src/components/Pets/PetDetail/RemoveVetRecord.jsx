import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Toast, Spinner } from "react-bootstrap";
import { FaTrash, FaUserMd, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { DeleteVetRecord, GetVetRecords } from "../../../redux/actions";
import { formatDateTime } from "../../../utils";

export default function RemoveVetRecord({ vetRecord }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await dispatch(DeleteVetRecord(vetRecord.id));
      await dispatch(GetVetRecords());
      
      // Resetear estado de loading
      setIsDeleting(false);
      
      // Notificación de éxito
      setToastVariant("success");
      setToastMessage("¡Evolución eliminada con éxito!");
      setShowToast(true);
      
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la evolución: ", error);
      
      // Notificación de error
      setToastVariant("danger");
      setToastMessage("Error al eliminar la evolución. Por favor, intente nuevamente.");
      setShowToast(true);
      
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="link"
        size="sm"
        onClick={handleShow}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginLeft: "5px",
        }}
      >
        <FaTrash /> Eliminar
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Evolución</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "1.1rem", textAlign: "center", marginBottom: "20px" }}>
            ¿Estás seguro de que deseas eliminar esta evolución?
          </p>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "0.95rem", color: "#555" }}>
              <p style={{ marginBottom: "12px" }}>
                <strong>ID de Evolución:</strong> #{vetRecord.id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <FaUserMd color="#2858BF" />{" "}
                <strong>Registrada por:</strong>{" "}
                {vetRecord.user
                  ? `Dr/a. ${vetRecord.user.first_name} ${vetRecord.user.lastname}`
                  : "No especificado"}
              </p>
              <p style={{ marginBottom: "0" }}>
                <FaClock color="#2858BF" />{" "}
                <strong>Última actualización:</strong>{" "}
                {formatDateTime(vetRecord.updated_at)}
              </p>
            </div>
          </div>

          <div
            style={{
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
              Toda la información de la evolución será eliminada permanentemente.
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
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
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

      {/* Toast de notificación */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? (
                <>
                  <FaCheckCircle /> Éxito
                </>
              ) : (
                <>
                  <FaExclamationTriangle /> Error
                </>
              )}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
}
