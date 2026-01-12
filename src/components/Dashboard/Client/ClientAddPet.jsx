import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { getCurrentDateTime, uploadMediaToCloudinary } from "../../../utils";
import { PostPet, GetPets } from "../../../redux/actions";
import {
  FaDog,
  FaCat,
  FaBirthdayCake,
  FaPaw,
  FaVenusMars,
  FaPlus,
  FaFileImage,
  FaCalendarDay,
} from "react-icons/fa";

const petFormData = {
  profile_picture_url: "",
  species: "",
  pet_name: "",
  birth_date: "",
  breed: "",
  sex: "",
  castration_date: "",
  owner_id: "",
  current_state: 0,
  created_at: "",
  updated_at: "",
};

export default function ClientAddPet() {
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const pets = useSelector((state) => state.pets);
  const [formData, setFormData] = useState(petFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Obtener mascotas pendientes del usuario
  const pendingPets = pets.filter(
    (pet) => pet.owner_id === authenticatedUser?.id && pet.current_state === 0
  );

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture_url") {
      const file = files[0];
      if (file) {
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadMediaToCloudinary(file);
          setPictureUrl(uploadedUrl);
          setFormData({ ...formData, profile_picture_url: uploadedUrl });
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error al subir la imagen. Intente nuevamente.");
        } finally {
          setUploadingImage(false);
        }
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

      const formDataToSubmit = {
        ...formData,
        owner_id: authenticatedUser.id,
        current_state: 0,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      };

      await dispatch(PostPet(formDataToSubmit));
      await dispatch(GetPets());

      setShowSuccess(true);
      setFormData(petFormData);
      setPictureUrl(null);
      setShowModal(false);
      setIsLoading(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error al registrar la mascota: ", error);
      setShowError(true);
      setIsLoading(false);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(petFormData);
    setPictureUrl(null);
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%'
    }}>
      <Button 
        variant="primary" 
        size="lg"
        onClick={handleShowModal}
        style={{
          padding: '15px 30px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <FaPlus /> Registrar Mi Mascota
      </Button>

      {/* Mensaje de mascotas pendientes */}
      {pendingPets.length > 0 && (
        <Alert 
          variant="primary" 
          style={{ 
            marginTop: '20px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <strong>Mascotas pendientes de aprobación:</strong>
          <ul style={{ marginTop: '10px', marginBottom: '0' }}>
            {pendingPets.map((pet) => (
              <li key={pet.id}>{pet.pet_name} ({pet.breed})</li>
            ))}
          </ul>
          <p style={{ marginTop: '10px', marginBottom: '0', fontSize: '0.95rem' }}>
            Cuando {pendingPets.length === 1 ? 'esta mascota sea admitida' : 'estas mascotas sean admitidas'} por un administrador, podrás visualizar sus datos junto a su documentación.
          </p>
        </Alert>
      )}

      <br />

      <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Nota:</strong> Tu mascota será registrada y estará pendiente de aprobación por la veterinaria.
          </Alert>
          <Form onSubmit={handleSubmit}>
            {/* Vista previa de imagen circular centrada */}
            <div className="text-center mb-4">
              <div className="pet-image-preview-container">
                {uploadingImage ? (
                  <div className="pet-image-placeholder">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Subiendo imagen...</p>
                  </div>
                ) : pictureUrl ? (
                  <img
                    src={pictureUrl}
                    alt="Preview"
                    className="pet-image-preview"
                  />
                ) : (
                  <div className="pet-image-placeholder">
                    <FaPaw size={50} color="#ccc" />
                    <p className="mt-2 text-muted">Sin imagen</p>
                  </div>
                )}
              </div>
            </div>

            <Form.Group controlId="profile_picture_url">
              <Form.Label>
               <FaFileImage /> Foto de la Mascota
              </Form.Label>
              <Form.Control
                type="file"
                name="profile_picture_url"
                onChange={handleInputChange}
                accept="image/*"
                disabled={uploadingImage}
              />
              <Form.Text className="text-muted">
                La imagen debe ser clara y mostrar bien a la mascota.
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="species">
              <Form.Label>
                <FaDog /> Especie <FaCat />
              </Form.Label>
              <Form.Control
                as="select"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value={0}>Canino</option>
                <option value={1}>Felino</option>
                <option value={2}>Otro</option>
              </Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="pet_name">
              <Form.Label>
                <FaPaw /> Nombre de la Mascota
              </Form.Label>
              <Form.Control
                type="text"
                name="pet_name"
                value={formData.pet_name}
                onChange={handleInputChange}
                placeholder="Nombre de la mascota"
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="birth_date">
              <Form.Label>
                <FaBirthdayCake /> Fecha de Nacimiento
              </Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="breed">
              <Form.Label>
                <FaDog /> Raza
              </Form.Label>
              <Form.Control
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Ej: Labrador, Persa, Mestizo..."
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="sex">
              <Form.Label>
                <FaVenusMars /> Sexo
              </Form.Label>
              <Form.Control
                as="select"
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value={1}>Hembra</option>
                <option value={2}>Macho</option>
                <option value={3}>Hembra castrada</option>
                <option value={4}>Macho castrado</option>
              </Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="castration_date">
              <Form.Label>
                <FaCalendarDay /> Fecha de Castración (Opcional)
              </Form.Label>
              <Form.Control
                type="date"
                name="castration_date"
                value={formData.castration_date}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                Dejar vacío si no está castrado/a
              </Form.Text>
            </Form.Group>
            <br />

            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || uploadingImage}
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
                disabled={isLoading || uploadingImage}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <br />

      {showSuccess && (
        <Alert variant="success">
          ¡Mascota registrada con éxito! Estará pendiente de aprobación.
        </Alert>
      )}
      {showError && (
        <Alert variant="danger">
          Ocurrió un error al registrar la mascota. Por favor, intente
          nuevamente más tarde.
        </Alert>
      )}
    </div>
  );
}
