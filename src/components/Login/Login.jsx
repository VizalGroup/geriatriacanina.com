import { useState } from 'react';
import { FaUser, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, Spinner, Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../../redux/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/pictures/logo.png";

export default function Login() {
  document.title = "Iniciar Sesión - Geriatría Canina";
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(authenticateUser(formData.email, formData.password));
      toast.success("¡Bienvenido!");
      
      setTimeout(() => {
        window.location.href = "/inicio";
      }, 1500);
    } catch (error) {
      console.error("Error de autenticación:", error);
      toast.error(error.message || "Error al iniciar sesión");
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
                  <img src={Logo} alt="Logo Geriatría Canina" className="login-logo mb-3" />
                  <p className="login-subtitle" style={{ color: '#2858BF' }}>
                    Sistema de Gestión
                  </p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text login-input-icon" style={{ backgroundColor: '#103585', color: 'white' }}>
                        <FaUser />
                      </span>
                      <input
                        type="email"
                        className="form-control login-input"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text login-input-icon" style={{ backgroundColor: '#103585', color: 'white' }}>
                        <FaKey />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control login-input"
                        placeholder="Contraseña"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary login-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        style={{ borderColor: '#103585', color: '#103585' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 login-submit-btn"
                    disabled={isLoading}
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
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>

                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={() => (window.location.href = "/recuperar_contrasena")}
                    disabled={isLoading}
                    style={{
                      color: "#2858BF",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    ¿No tienes una cuenta?
                  </p>
                  <Button
                    variant="outline-primary"
                    onClick={() => window.location.href = "/registro_de_usuarios"}
                    disabled={isLoading}
                    style={{ 
                      borderColor: '#2858BF', 
                      color: '#2858BF',
                      fontWeight: '600',
                      width: '100%'
                    }}
                  >
                    Registrarse
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-right" />
    </div>
  );
}
