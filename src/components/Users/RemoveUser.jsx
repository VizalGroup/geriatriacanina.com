import { useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteUser, GetUsers } from "../../redux/actions";
import { Button, Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

export default function RemoveUser({ user }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      await dispatch(DeleteUser(user.id));
      await dispatch(GetUsers());
      handleClose();
    } catch (error) {
      alert("Error al eliminar el usuario: " + error.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-danger"
        onClick={handleShow}
        style={{ margin: "2px" }}
        title="Eliminar usuario"
      >
        <FaTrash />
      </button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el usuario{" "}
          <b>{user.first_name} {user.lastname}</b>?
          <br />
          <br />
          <span className="text-muted">Email: {user.email}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
