import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import bcrypt from "bcryptjs";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaUser,
  FaUserEdit,
  FaAt,
  FaLock,
  FaPhone,
  FaHome,
  FaToggleOn,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaMapPin,
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { getCurrentDateTime } from "../utils";
import { updateUser, GetUserDetail, LogoutUser } from "../redux/actions";
import NavBar from "./NavBar";
import BackButton from "./BackButton";

export default function UpdateUserCredentials() {
  document.title = "Actualizar Credenciales - Geriatría Canina";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const userDetail = useSelector((state) => state.userDetail);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/");
      return;
    }

    if (authenticatedUser.id) {
      dispatch(GetUserDetail(authenticatedUser.id));
    }
  }, [authenticatedUser, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "newPassword") {
      const contieneMayuscula = /[A-Z]/.test(value);
      const contieneNumero = /[0-9]/.test(value);
      setPasswordValid(contieneMayuscula && contieneNumero);
    }

    if (name === "confirmPassword") {
      setPasswordsMatch(formData.newPassword === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    if (!passwordValid) {
      setErrorMessage(
        "La contraseña debe contener al menos una mayúscula y un número"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
      const currentDateTime = getCurrentDateTime();

      const dataToUpdate = {
        ...userDetail,
        clue: hashedPassword,
        updated_at: currentDateTime,
      };

      await dispatch(updateUser(authenticatedUser.id, dataToUpdate));

      setShowSuccess(true);
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setIsLoading(false);

      setTimeout(() => {
        navigate("/inicio");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la contraseña: ", error);
      setErrorMessage(
        "Ocurrió un error al actualizar la contraseña. Por favor, intente nuevamente."
      );
      setShowError(true);
      setIsLoading(false);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const getUserRole = (role) => {
    const roles = {
      0: "Programador",
      1: "Administración",
      2: "Veterinario/a",
      3: "Tutor/a",
    };
    return roles[role] || "Sin rol";
  };

  if (!userDetail || !userDetail.id) {
    return (
      <>
        <NavBar />
        <Container style={{ marginTop: "100px" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando información...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="watermark-background" style={{ marginTop: '80px' }}>
        <BackButton />

        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-lg" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <h3
                  className="text-center mb-4"
                  style={{ color: "#103585", fontWeight: "700" }}
                >
                  Actualizar Credenciales de Usuario
                </h3>

                <Alert variant="info" className="mb-4">
                  <FaInfoCircle /> <strong>Información importante:</strong>
                  <br />
                  Para actualizar información personal como domicilio o número
                  de teléfono, por favor comuníquese con su veterinaria/o.
                </Alert>

                {showSuccess && (
                  <Alert
                    variant="primary"
                    className="mb-3"
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 9999,
                      minWidth: "400px",
                      textAlign: "center",
                      fontSize: "1.2rem",
                      padding: "30px",
                    }}
                  >
                    <h4 style={{ marginBottom: "15px" }}>
                      ✓ ¡Contraseña actualizada con éxito!
                    </h4>
                    <p style={{ marginBottom: 0 }}>Redirigiendo al inicio...</p>
                  </Alert>
                )}

                {showError && (
                  <Alert variant="danger" className="mb-3">
                    {errorMessage}
                  </Alert>
                )}

                {/* Información del usuario - Solo lectura */}
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                  }}
                >
                  <h5 style={{ color: "#103585", marginBottom: "20px" }}>
                    <FaUser /> Información Personal
                  </h5>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUser /> Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userDetail.first_name}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUserEdit /> Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userDetail.lastname}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaAt /> Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={userDetail.email}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaPhone /> Teléfono
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userDetail.phone}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaHome /> Dirección
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userDetail.street_address}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaMapPin /> Barrio
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userDetail.neighborhood || "No suministrado"}
                          disabled
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Formulario para cambiar contraseña */}
                <div>
                  <h5 style={{ color: "#103585", marginBottom: "20px" }}>
                    <FaLock /> Cambiar Contraseña
                  </h5>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="newPassword" className="mb-3">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Ingrese su nueva contraseña"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {formData.newPassword && !passwordValid && (
                        <Form.Text className="text-danger">
                          La contraseña debe contener al menos una mayúscula y
                          un número
                        </Form.Text>
                      )}
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mb-4">
                      <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirme su nueva contraseña"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {formData.confirmPassword && !passwordsMatch && (
                        <Form.Text className="text-danger">
                          Las contraseñas no coinciden
                        </Form.Text>
                      )}
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={
                          isLoading ||
                          !passwordValid ||
                          !passwordsMatch ||
                          !formData.newPassword ||
                          !formData.confirmPassword
                        }
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
                            Actualizando...
                          </>
                        ) : (
                          "Actualizar Contraseña"
                        )}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
