import { useState } from "react";
import { useDispatch } from "react-redux";
import { GetUsers, updateUser } from "../../redux/actions";
import { Button, Form, Modal } from "react-bootstrap";
import { FaEdit, FaUser, FaUserEdit, FaAt, FaPhone, FaHome, FaToggleOn, FaMapPin } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { getCurrentDateTime } from "../../utils";
import bcrypt from "bcryptjs";

export default function EditUser({ user }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(user);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setChangePassword(false);
    setNewPassword("");
    setPasswordValid(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    const contieneMayuscula = /[A-Z]/.test(value);
    const contieneNumero = /[0-9]/.test(value);
    setPasswordValid(contieneMayuscula && contieneNumero);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDateTime = getCurrentDateTime();
      let updatedData = {
        ...formData,
        updated_at: currentDateTime,
      };

      // Si se marca cambiar contraseña, hashearla
      if (changePassword && newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updatedData = {
          ...updatedData,
          clue: hashedPassword,
        };
      }

      await dispatch(updateUser(user.id, updatedData));
      await dispatch(GetUsers());
      handleClose();
    } catch (error) {
      alert("Error al actualizar el usuario: " + error.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-warning"
        onClick={handleShow}
        style={{ margin: "2px" }}
        title="Editar usuario"
      >
        <FaEdit />
      </button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
            <br />

            <Form.Group controlId="changePassword">
              <Form.Check
                type="checkbox"
                label="Cambiar contraseña"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
              />
            </Form.Group>

            {changePassword && (
              <>
                <br />
                <Form.Group controlId="newPassword">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required={changePassword}
                  />
                  {newPassword && !passwordValid && (
                    <span className="text-danger">
                      La contraseña debe contener al menos una mayúscula y un número
                    </span>
                  )}
                </Form.Group>
              </>
            )}
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

            <Form.Group controlId="street_address">
              <Form.Label>
                <FaHome /> Dirección
              </Form.Label>
              <Form.Control
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <br />

            <Form.Group controlId="neighborhood">
              <Form.Label>
                <FaMapPin /> Barrio
              </Form.Label>
              <Form.Control
                type="text"
                name="neighborhood"
                // Los usuarios anteriores a esta versión no tienen barrio cargado
                value={formData.neighborhood || ""}
                onChange={handleInputChange}
                placeholder="Ej: Las Cañitas"
              />
            </Form.Group>
            <br />

            <Form.Group controlId="is_activate">
              <Form.Label>
                <FaToggleOn /> Estado del Usuario
              </Form.Label>
              <Form.Control
                as="select"
                name="is_activate"
                value={formData.is_activate}
                onChange={handleInputChange}
                required
              >
                <option value={1}>Activo</option>
                <option value={2}>Pendiente de validar</option>
                <option value={0}>Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={changePassword && (!newPassword || !passwordValid)}
            >
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
