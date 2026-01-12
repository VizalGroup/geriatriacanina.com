import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs";
import { Form, Button, Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  FaUser,
  FaUserEdit,
  FaAt,
  FaLock,
  FaPhone,
  FaHome,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCity,
  FaMapMarked,
  FaGlobe,
} from "react-icons/fa";
import { getCurrentDateTime } from "../../utils";
import { PostUser, GetUsers } from "../../redux/actions";
import Logo from "../../assets/pictures/logo.png";

const userFormData = {
  first_name: "",
  lastname: "",
  user_role: 3, // Por defecto Tutor/a
  email: "",
  clue: "",
  phone: "",
  is_activate: 1, // Por defecto ACTIVO
  street_name: "",
  street_number: "",
  city: "",
  province: "",
  country: "", // Por defecto Argentina
  created_at: "",
  updated_at: "",
};

export default function UserRegistration() {
  document.title = "Registro de Usuario - Geriatría Canina";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(userFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "clue") {
      const contieneMayuscula = /[A-Z]/.test(value);
      const contieneNumero = /[0-9]/.test(value);
      setPasswordValid(contieneMayuscula && contieneNumero);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const hashedPassword = await bcrypt.hash(formData.clue, 10);
      const currentDateTime = getCurrentDateTime();

      // Construir la dirección completa
      const street_address = `${formData.street_name} ${formData.street_number}, ${formData.city}, ${formData.province}, ${formData.country}`;

      const dataToSubmit = {
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

      await dispatch(PostUser(dataToSubmit));
      await dispatch(GetUsers());

      setShowSuccess(true);
      setFormData(userFormData);
      setIsLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error al registrar el usuario: ", error);
      
      if (error.message.includes("email ya está registrado")) {
        setErrorMessage("Este email ya está registrado. Por favor, utilice otro.");
      } else {
        setErrorMessage("Ocurrió un error al registrar el usuario. Por favor, intente nuevamente.");
      }
      
      setShowError(true);
      setIsLoading(false);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  return (
    <div className="login-container">
      <Container fluid className="login-wrapper">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img src={Logo} alt="Logo Geriatría Canina" className="login-logo mb-3" />
                  <h4 className="login-title" style={{ color: '#103585' }}>
                    Registro de Usuario
                  </h4>
                
                </div>

                {showSuccess && (
                  <Alert variant="success" className="mb-3">
                    ¡Registro exitoso! Será redirigido al inicio de sesión...
                  </Alert>
                )}

                {showError && (
                  <Alert variant="danger" className="mb-3">
                    {errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="first_name" className="mb-3">
                        <Form.Label>
                          <FaUser /> Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="Ingrese su nombre"
                          required
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="lastname" className="mb-3">
                        <Form.Label>
                          <FaUserEdit /> Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          placeholder="Ingrese su apellido"
                          required
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>
                      <FaAt /> Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="correo@ejemplo.com"
                      required
                      disabled={isLoading}
                      className="login-input"
                    />
                  </Form.Group>

                  <Form.Group controlId="clue" className="mb-3">
                    <Form.Label>
                      <FaLock /> Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="clue"
                      value={formData.clue}
                      onChange={handleInputChange}
                      placeholder="Ingrese su contraseña"
                      required
                      disabled={isLoading}
                      className="login-input"
                    />
                    {formData.clue && !passwordValid && (
                      <Form.Text className="text-danger">
                        La contraseña debe contener al menos una mayúscula y un número
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="phone" className="mb-3">
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
                      placeholder="Ej: 3512472384"
                      required
                      disabled={isLoading}
                      className="login-input"
                    />
                    <Form.Text className="text-muted">
                      Máximo 13 caracteres. Solo números.
                    </Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={8}>
                      <Form.Group controlId="street_name" className="mb-3">
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
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="street_number" className="mb-3">
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
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="city" className="mb-3">
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
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="province" className="mb-3">
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
                          disabled={isLoading}
                          className="login-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="country" className="mb-4">
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
                      disabled={isLoading}
                      className="login-input"
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="login-submit-btn"
                      disabled={isLoading || (formData.clue && !passwordValid)}
                      style={{ backgroundColor: '#2858BF', borderColor: '#2858BF' }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </Button>

                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/")}
                      disabled={isLoading}
                      style={{ 
                        borderColor: '#103585', 
                        color: '#103585',
                        fontWeight: '600'
                      }}
                    >
                      <FaArrowLeft /> Volver al inicio de sesión
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
