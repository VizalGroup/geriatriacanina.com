import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import { getCurrentDateTime, uploadMediaToCloudinary } from "../../utils";
import { updatePet, GetPets } from "../../redux/actions";
import {
  FaDog,
  FaCat,
  FaBirthdayCake,
  FaPaw,
  FaVenusMars,
  FaEdit,
  FaFileImage,
  FaCalendarDay,
  FaCheckCircle,
} from "react-icons/fa";
import { selectSortedUsers } from "../../redux/selectors/selectors";
import UserSearchSelect from "../UserSearchSelect";

export default function EditPet({ pet, fullWidth = false }) {
  const dispatch = useDispatch();
  const users = useSelector(selectSortedUsers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(pet);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState(pet.profile_picture_url);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setPictureUrl(pet.profile_picture_url);
  };

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

  const handleUserSelect = (userId) => {
    setFormData({ ...formData, owner_id: userId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentDateTime = getCurrentDateTime();
      const updatedData = {
        ...formData,
        updated_at: currentDateTime,
      };

      await dispatch(updatePet(pet.id, updatedData));
      await dispatch(GetPets());
      handleClose();
    } catch (error) {
      alert("Error al actualizar la mascota: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="warning"
        size="sm"
        onClick={handleShow}
        style={{ margin: "5px", width: fullWidth ? "100%" : "auto" }}
      >
        <FaEdit /> Editar
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
                value={formData.castration_date || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <br />

            <UserSearchSelect
              users={users}
              selectedUserId={formData.owner_id}
              onUserSelect={handleUserSelect}
              disabled={isLoading || uploadingImage}
            />
            <br />

            <Form.Group controlId="current_state">
              <Form.Label>
                <FaCheckCircle /> Estado de Validación
              </Form.Label>
              <Form.Control
                as="select"
                name="current_state"
                value={formData.current_state}
                onChange={handleInputChange}
                required
              >
                <option value={0}>Pendiente de validar</option>
                <option value={1}>Validado</option>
              </Form.Control>
              <Form.Text className="text-muted">
                Cambia a "Validado" para aprobar el registro de la mascota
              </Form.Text>
            </Form.Group>
            <br />

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
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
