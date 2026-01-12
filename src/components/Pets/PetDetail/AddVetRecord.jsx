import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Button, Modal, Spinner, Toast } from "react-bootstrap";
import { getCurrentDateTime, sanitizeFormData } from "../../../utils";
import { PostVetRecord, GetVetRecords } from "../../../redux/actions";
import {
  FaPlus,
  FaStethoscope,
  FaNotesMedical,
  FaWeight,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// Función para obtener datetime actual en formato para datetime-local
const getCurrentDateTimeForInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const vetRecordFormData = {
  pet_id: "",
  consultation_reason: "",
  anamnesis: "",
  diagnosis: "",
  weight: "",
  event_date: getCurrentDateTimeForInput(),
  user_id: "",
  created_at: "",
  updated_at: "",
};

export default function AddVetRecord() {
  const { id } = useParams(); // Obtener el id de la mascota de los params
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const [formData, setFormData] = useState({
    ...vetRecordFormData,
    pet_id: id,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        pet_id: id,
        user_id: authenticatedUser.id,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      });

      await dispatch(PostVetRecord(sanitizedData));
      await dispatch(GetVetRecords());

      // Resetear estado de loading
      setIsLoading(false);

      // Notificación de éxito
      setToastVariant("success");
      setToastMessage("¡Evolución registrada con éxito!");
      setShowToast(true);

      // Resetear formulario
      setFormData({
        ...vetRecordFormData,
        pet_id: id,
        event_date: getCurrentDateTimeForInput(),
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error al registrar la Evolución: ", error);
      
      // Notificación de error
      setToastVariant("danger");
      setToastMessage("Error al registrar la evolución. Por favor, intente nuevamente.");
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    // NO resetear el formData al cerrar para evitar pérdida de datos
    setShowModal(false);
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <button className="btn btn-primary" onClick={handleShowModal}>
        <FaPlus /> Registrar Evolución
      </button>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Evolución</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="consultation_reason">
              <Form.Label>
                <FaStethoscope /> Motivo de Consulta
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
                <FaNotesMedical /> Anamnesis (Opcional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="anamnesis"
                value={formData.anamnesis}
                onChange={handleInputChange}
                placeholder="Describa la Evolución, síntomas, antecedentes..."
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
                value={formData.diagnosis}
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
                value={formData.weight}
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
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Registrando...
                  </>
                ) : (
                  "Registrar"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancelar
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
          <Toast.Body className={toastVariant === "success" ? "text-white" : "text-white"}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
}
