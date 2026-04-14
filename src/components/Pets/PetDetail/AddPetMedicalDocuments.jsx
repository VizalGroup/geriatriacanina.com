import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Button, Modal, Spinner, Toast } from "react-bootstrap";
import { 
  getCurrentDateTime, 
  sanitizeFormData, 
  guardarArchivo,
  getTodayDate,
  isClient 
} from "../../../utils";
import { PostPetMedicalDocument, GetPetMedicalDocuments } from "../../../redux/actions";
import {
  FaFileUpload,
  FaFileAlt,
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaToggleOn,
} from "react-icons/fa";

const documentFormData = {
  pet_id: "",
  document_url: "",
  document_type: "",
  document_title: "",
  document_date: getTodayDate(),
  uploaded_by: "",
  is_approved: 0, // Cambiar el valor por defecto a pendiente
  created_at: "",
  updated_at: "",
};

export default function AddPetMedicalDocuments() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const [formData, setFormData] = useState({
    ...documentFormData,
    pet_id: id,
    is_approved: isClient(authenticatedUser?.user_role) ? 0 : 1,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

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
        setFileSelected(true);
        
        // Si no hay título, usar el nombre del archivo
        if (!formData.document_title) {
          setFormData(prev => ({ ...prev, document_title: file.name }));
        }
      } catch (error) {
        console.error("Error al subir el archivo: ", error);
        setToastVariant("danger");
        setToastMessage("Error al subir el archivo. Por favor, intente nuevamente.");
        setShowToast(true);
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
        pet_id: id,
        uploaded_by: authenticatedUser.id,
        is_approved: isClient(authenticatedUser?.user_role) ? 0 : 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      });

      await dispatch(PostPetMedicalDocument(sanitizedData));
      await dispatch(GetPetMedicalDocuments());

      setIsLoading(false);

      setToastVariant("success");
      setToastMessage("¡Documento médico registrado con éxito!");
      setShowToast(true);

      setFormData({
        ...documentFormData,
        pet_id: id,
        document_date: getTodayDate(),
        is_approved: isClient(authenticatedUser?.user_role) ? 0 : 1,
      });
      setFileSelected(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error al registrar el documento médico: ", error);
      
      setToastVariant("danger");
      setToastMessage("Error al registrar el documento. Por favor, intente nuevamente.");
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <button className="btn btn-primary" style={{marginLeft: "5px"}} onClick={handleShowModal}>
        <FaFileUpload /> Agregar Documento Médico
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Documento Médico</Modal.Title>
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
                <option value="">Seleccione el tipo de documento</option>
                <option value="0">Análisis</option>
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
                placeholder="Ej: Análisis de sangre, Indicación de farmaco, Radiografía de cráneo..."
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
                    Los documentos pendientes deben ser revisados antes de ser visibles
                  </Form.Text>
                </Form.Group>
                <br />
              </>
            )}

            <Form.Group controlId="document_file">
              <Form.Label>
                <FaUpload /> Seleccionar Archivo
              </Form.Label>
              <Form.Control
                type="file"
                name="document_file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
                disabled={isLoading || uploadingFile}
              />
              <Form.Text className="text-muted">
                Formatos permitidos: PDF, imágenes (JPG, PNG), documentos de Word
              </Form.Text>
            </Form.Group>
            <br />

            {uploadingFile && (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Subiendo archivo...</p>
              </div>
            )}

            {fileSelected && !uploadingFile && (
              <div style={{ color: "#2858BF" }}>
                <FaCheckCircle /> Archivo cargado correctamente
              </div>
            )}

            <br />

            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || uploadingFile || !fileSelected}
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
                  "Guardar Documento"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isLoading || uploadingFile}
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
          style={{
            backgroundColor: toastVariant === "success" ? "#2858BF" : "#dc3545",
            color: "white",
            border: "none",
          }}
        >
          <Toast.Header
            style={{
              backgroundColor: toastVariant === "success" ? "#103585" : "#a71d2a",
              color: "white",
              borderBottom: "none",
            }}
            closeButton={false}
          >
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
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowToast(false)}
            ></button>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>
    </>
  )
}
