import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Modal, Spinner, Toast } from "react-bootstrap";
import { getCurrentDateTime, sanitizeFormData } from "../../../utils";
import { updateVetRecord, GetVetRecords } from "../../../redux/actions";
import {
  FaEdit,
  FaStethoscope,
  FaNotesMedical,
  FaWeight,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// Función para formatear fecha de MySQL a datetime-local input
const formatDateTimeForInput = (mysqlDateTime) => {
  if (!mysqlDateTime) return "";
  // Convertir "2024-01-15 10:30:00" a "2024-01-15T10:30"
  return mysqlDateTime.replace(" ", "T").slice(0, 16);
};

export default function EditVetRecord({ vetRecord }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ...vetRecord,
    event_date: formatDateTimeForInput(vetRecord.event_date),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({
      ...vetRecord,
      event_date: formatDateTimeForInput(vetRecord.event_date),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Para el peso, permitir solo números y un punto decimal
    if (name === "weight") {
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentDateTime = getCurrentDateTime();
      
      // Sanitizar los datos antes de enviar
      const sanitizedData = sanitizeFormData({
        ...formData,
        updated_at: currentDateTime,
      });

      await dispatch(updateVetRecord(vetRecord.id, sanitizedData));
      await dispatch(GetVetRecords());
      
      // Resetear estado de loading
      setIsLoading(false);
      
      // Notificación de éxito
      setToastVariant("success");
      setToastMessage("¡Evolución actualizada con éxito!");
      setShowToast(true);
      
      handleClose();
    } catch (error) {
      console.error("Error al actualizar la evolución: ", error);
      
      // Notificación de error
      setToastVariant("danger");
      setToastMessage("Error al actualizar la evolución. Por favor, intente nuevamente.");
      setShowToast(true);
      
      setIsLoading(false);
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
        }}
      >
        <FaEdit /> Editar
      </Button>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Evolución</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="consultation_reason">
              <Form.Label>
                <FaStethoscope /> Tipo de consulta
              </Form.Label>
              <Form.Control
                type="text"
                name="consultation_reason"
                value={formData.consultation_reason}
                onChange={handleInputChange}
                placeholder="Ej: Control rutinario, dolor abdominal, etc."
                required
                disabled={isLoading}
              />
            </Form.Group>
            <br />

            <Form.Group controlId="anamnesis">
              <Form.Label>
                <FaNotesMedical /> Detalle de consulta (Opcional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="anamnesis"
                value={formData.anamnesis || ""}
                onChange={handleInputChange}
                placeholder="Describa la evolución, síntomas, antecedentes..."
                disabled={isLoading}
              />
            </Form.Group>
            <br />

            <Form.Group controlId="diagnosis">
              <Form.Label>
                <FaNotesMedical /> Diagnóstico (Opcional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="diagnosis"
                value={formData.diagnosis || ""}
                onChange={handleInputChange}
                placeholder="Diagnóstico presuntivo o definitivo..."
                disabled={isLoading}
              />
            </Form.Group>
            <br />

            <Form.Group controlId="weight">
              <Form.Label>
                <FaWeight /> Peso (kg) (Opcional)
              </Form.Label>
              <Form.Control
                type="text"
                name="weight"
                value={formData.weight || ""}
                onChange={handleInputChange}
                placeholder="Ej: 15.50"
                disabled={isLoading}
              />
              <Form.Text className="text-muted">
                Peso en kilogramos (hasta 2 decimales)
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="event_date">
              <Form.Label>
                <FaCalendarAlt /> Fecha y Hora del Evento
              </Form.Label>
              <Form.Control
                type="datetime-local"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <Form.Text className="text-muted">
                Fecha y hora en que ocurrió la consulta
              </Form.Text>
            </Form.Group>
            <br />

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
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
