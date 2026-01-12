import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaAt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/pictures/logo.png";

export default function ForgotPassword() {
  document.title = "Recuperar Contraseña - Geriatría Canina";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      // Primero buscar el usuario por email
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_USERS_URL}`
      );

      const users = userResponse.data;
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setErrorMessage("No existe una cuenta asociada a este email.");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // Enviar solicitud de reseteo con user_id
      const formData = new FormData();
      formData.append("METHOD", "POST");
      formData.append("user_id", user.id);

      await axios.post(
        `${import.meta.env.VITE_API_PASSWPORD_RESET_TOKENS_URL}`,
        formData
      );

      setShowSuccess(true);
      setEmail("");

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error al enviar el email de recuperación"
      );
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container fluid className="login-wrapper">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4} xl={3}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img
                    src={Logo}
                    alt="Logo Geriatría Canina"
                    className="login-logo mb-3"
                  />
                  <h4 className="login-title" style={{ color: "#103585" }}>
                    Recuperar Contraseña
                  </h4>
                  <p
                    className="login-subtitle"
                    style={{ color: "#666", fontSize: "0.9rem" }}
                  >
                    Ingresa tu email para recibir instrucciones
                  </p>
                </div>

                {showSuccess && (
                  <Alert variant="success" className="mb-3">
                    ¡Email enviado! Revisa tu bandeja de entrada y sigue las
                    instrucciones para restablecer tu contraseña.
                  </Alert>
                )}

                {showError && (
                  <Alert variant="danger" className="mb-3">
                    {errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>
                      <FaAt /> Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      disabled={isLoading}
                      style={{
                        backgroundColor: "#2858BF",
                        borderColor: "#2858BF",
                      }}
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
                          Enviando...
                        </>
                      ) : (
                        "Enviar instrucciones"
                      )}
                    </Button>

                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/")}
                      disabled={isLoading}
                      style={{
                        borderColor: "#103585",
                        color: "#103585",
                        fontWeight: "600",
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
