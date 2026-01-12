import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bcrypt from "bcryptjs";
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { getCurrentDateTime } from "../../utils";
import { PostUser, GetUsers } from "../../redux/actions";
import { BsPersonPlus } from "react-icons/bs";
import {
  FaAt,
  FaLock,
  FaPhone,
  FaUser,
  FaUserEdit,
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaMapMarked,
  FaGlobe,
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";

const userFormData = {
  first_name: "",
  lastname: "",
  user_role: "",
  email: "",
  clue: "",
  phone: "",
  is_activate: 1,
  street_name: "",
  street_number: "",
  city: "",
  province: "",
  country: "",
  created_at: "",
  updated_at: "",
};

export default function AddUser() {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(userFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "clue") {
      const contieneMayuscula = /[A-Z]/.test(value);
      const contieneNumero = /[0-9]/.test(value);
      setPasswordValid(contieneMayuscula && contieneNumero);
    }

    if (name === "email") {
      setEmailExistsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (emailExists(formData.email)) {
        setEmailExistsError(true);
        setIsLoading(false);
        return;
      }

      const hashedPassword = await bcrypt.hash(formData.clue, 10);
      const currentDateTime = getCurrentDateTime();

      // Construir la dirección completa
      const street_address = `${formData.street_name} ${formData.street_number}, ${formData.city}, ${formData.province}, ${formData.country}`;

      const formDataWithHashedPassword = {
        first_name: formData.first_name,
        lastname: formData.lastname,
        user_role: formData.user_role,
        email: formData.email,
        clue: hashedPassword,
        phone: formData.phone,
        is_activate: formData.is_activate,
        street_address: street_address,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      };

      await dispatch(PostUser(formDataWithHashedPassword));
      await dispatch(GetUsers());

      setShowSuccess(true);
      setFormData(userFormData);
      setShowModal(false);
      setIsLoading(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error al registrar el usuario: ", error);
      setShowError(true);
      setIsLoading(false);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const emailExists = (email) => {
    return users.some((user) => user.email === email);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(userFormData);
    setEmailExistsError(false);
    setPasswordValid(false);
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <button className="btn btn-primary" onClick={handleShowModal}>
        <BsPersonPlus /> Registrar Usuario
      </button>

      <br />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="first_name">
              <Form.Label>
                <FaUser /> Nombre
              </Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="lastname">
              <Form.Label>
                <FaUserEdit /> Apellido
              </Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="email">
              <Form.Label>
                <FaAt /> Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {emailExistsError && (
              <Alert variant="danger" className="mt-2">
                El email ya existe en la base de datos.
              </Alert>
            )}
            <br />

            <Form.Group controlId="clue">
              <Form.Label>
                <FaLock /> Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="clue"
                value={formData.clue}
                onChange={handleInputChange}
                required
              />
              {formData.clue && !passwordValid && (
                <span className="text-danger">
                  La contraseña debe contener al menos una mayúscula y un número
                </span>
              )}
            </Form.Group>
            <br />

            <Form.Group controlId="user_role">
              <Form.Label>
                <RiUserSettingsLine /> Rol del Usuario
              </Form.Label>
              <Form.Control
                as="select"
                name="user_role"
                value={formData.user_role}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value={0}>Programador</option>
                <option value={1}>Administración</option>
                <option value={2}>Veterinario/a</option>
                <option value={3}>Tutor/a</option>
              </Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="phone">
              <Form.Label>
                <FaPhone /> Teléfono
              </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const sanitizedValue = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 13);
                  setFormData({ ...formData, phone: sanitizedValue });
                }}
                maxLength={13}
                required
              />
              <Form.Text className="text-muted">
                Máximo 13 caracteres. Solo números.
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="street_name">
              <Form.Label>
                <FaHome /> Calle
              </Form.Label>
              <Form.Control
                type="text"
                name="street_name"
                value={formData.street_name}
                onChange={handleInputChange}
                placeholder="Ej: Saavedra"
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="street_number">
              <Form.Label>
                <FaMapMarkerAlt /> Número
              </Form.Label>
              <Form.Control
                type="text"
                name="street_number"
                value={formData.street_number}
                onChange={handleInputChange}
                placeholder="Ej: 267"
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="city">
              <Form.Label>
                <FaCity /> Ciudad
              </Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ej: Villa Allende"
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="province">
              <Form.Label>
                <FaMapMarked /> Provincia
              </Form.Label>
              <Form.Control
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Ej: Córdoba"
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="country">
              <Form.Label>
                <FaGlobe /> País
              </Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Ej: Argentina"
                required
              />
            </Form.Group>
            <br />
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                style={{ margin: "10px" }}
                disabled={isLoading || (formData.clue && !passwordValid)}
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
                style={{ margin: "10px" }}
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <br />

      {showSuccess && (
        <Alert variant="success">El usuario fue creado con éxito</Alert>
      )}
      {showError && (
        <Alert variant="danger">
          Ocurrió un error al registrar el usuario. Por favor, intente
          nuevamente más tarde.
        </Alert>
      )}
    </>
  );
}
