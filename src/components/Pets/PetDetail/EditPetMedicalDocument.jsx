import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import { getCurrentDateTime, sanitizeFormData, guardarArchivo, isClient } from "../../../utils";
import { updatePetMedicalDocument, GetPetMedicalDocuments } from "../../../redux/actions";
import {
  FaEdit,
  FaFileAlt,
  FaUpload,
  FaCheckCircle,
  FaCalendarAlt,
  FaToggleOn,
} from "react-icons/fa";

export default function EditPetMedicalDocument({ document }) {
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ...document,
    document_date: document.document_date,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newFileSelected, setNewFileSelected] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({
      ...document,
      document_date: document.document_date,
    });
    setNewFileSelected(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFile(true);
      try {
        const fileUrl = await guardarArchivo(e);
        setFormData({ ...formData, document_url: fileUrl });
        setNewFileSelected(true);
      } catch (error) {
        console.error("Error al subir el archivo: ", error);
        alert("Error al subir el archivo. Por favor, intente nuevamente.");
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentDateTime = getCurrentDateTime();

      const sanitizedData = sanitizeFormData({
        ...formData,
        updated_at: currentDateTime,
      });

      await dispatch(updatePetMedicalDocument(document.id, sanitizedData));
      await dispatch(GetPetMedicalDocuments());

      setIsLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error al actualizar el documento médico: ", error);
      alert("Error al actualizar el documento. Por favor, intente nuevamente.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="warning"
        size="sm"
        onClick={handleShow}
        style={{ flex: 1 }}
        title="Editar documento"
      >
        <FaEdit />
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Documento Médico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="document_type">
              <Form.Label>
                <FaFileAlt /> Tipo de Documento
              </Form.Label>
              <Form.Control
                as="select"
                name="document_type"
                value={formData.document_type}
                onChange={handleInputChange}
                required
                disabled={isLoading || uploadingFile}
              >
                <option value="0">Análisis</option>
                <option value="11">Anatomía Patológica</option>
                <option value="7">Cuestionario</option>
                <option value="1">Ecografías</option>
                <option value="8">Electrocardiograma</option>
                <option value="3">Endoscopías</option>
                <option value="9">Fotos</option>
                <option value="10">Informe médico</option>
                <option value="6">Otros</option>
                <option value="2">Radiografías</option>
                <option value="4">RM</option>
                <option value="5">TAC</option>
              </Form.Control>
              <Form.Text className="text-muted">
                Puede recategorizar el documento si fue clasificado incorrectamente
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="document_title">
              <Form.Label>
                <FaFileAlt /> Título del Documento
              </Form.Label>
              <Form.Control
                type="text"
                name="document_title"
                value={formData.document_title}
                onChange={handleInputChange}
                placeholder="Ej: Análisis de sangre, Indicación de fármaco, Radiografía de cráneo..."
                required
                disabled={isLoading || uploadingFile}
              />
            </Form.Group>
            <br />

            <Form.Group controlId="document_date">
              <Form.Label>
                <FaCalendarAlt /> Fecha del Documento
              </Form.Label>
              <Form.Control
                type="date"
                name="document_date"
                value={formData.document_date}
                onChange={handleInputChange}
                required
                disabled={isLoading || uploadingFile}
              />
              <Form.Text className="text-muted">
                Fecha en que se realizó el estudio o análisis
              </Form.Text>
            </Form.Group>
            <br />

            {/* Solo mostrar el selector de aprobación para administradores/veterinarios */}
            {!isClient(authenticatedUser?.user_role) && (
              <>
                <Form.Group controlId="is_approved">
                  <Form.Label>
                    <FaToggleOn /> Estado de Aprobación
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="is_approved"
                    value={formData.is_approved}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || uploadingFile}
                  >
                    <option value={0}>Pendiente de revisar</option>
                    <option value={1}>Aprobado</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Cambia a "Aprobado" para validar el documento
                  </Form.Text>
                </Form.Group>
                <br />
              </>
            )}

            {/* Mostrar documento actual */}
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
                marginBottom: "15px",
              }}
            >
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                <strong>Documento actual:</strong>
              </p>
              <a
                href={document.document_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.85rem" }}
              >
                Ver documento actual
              </a>
            </div>

            <Form.Group controlId="document_file">
              <Form.Label>
                <FaUpload /> Reemplazar Archivo (Opcional)
              </Form.Label>
              <Form.Control
                type="file"
                name="document_file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                disabled={isLoading || uploadingFile}
              />
              <Form.Text className="text-muted">
                Solo seleccione un archivo si desea reemplazar el documento actual
              </Form.Text>
            </Form.Group>
            <br />

            {uploadingFile && (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Subiendo nuevo archivo...</p>
              </div>
            )}

            {newFileSelected && !uploadingFile && (
              <div style={{ color: "#2858BF", marginBottom: "15px" }}>
                <FaCheckCircle /> Nuevo archivo cargado correctamente
              </div>
            )}

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isLoading || uploadingFile}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || uploadingFile}
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
    </>
  );
}
