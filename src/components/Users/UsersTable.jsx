import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaWhatsapp,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaPaw,
  FaExclamationTriangle,
  FaFilter,
  FaClock,
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "../Pagination";
import { getUserRoleName, formatDateTime, capitalizeName } from "../../utils";
import EditUser from "./EditUser";
import RemoveUser from "./RemoveUser";
import UserPetsModal from "./UserPetsModal";

export default function UsersTable({ users }) {
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pets);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPetsModal, setShowPetsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterPending, setFilterPending] = useState(false);
  const itemsPerPage = 10;

  // Filtrar usuarios según el estado de filtro
  const filteredUsers = filterPending
    ? users.filter((user) => user.is_activate === 2)
    : users;

  // Contar usuarios pendientes de validar
  const pendingValidationCount = users.filter(
    (user) => user.is_activate === 2
  ).length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Resetear a página 1 cuando cambien los usuarios (búsqueda) o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterToggle = () => {
    setFilterPending(!filterPending);
    setCurrentPage(1);
  };
  //IMPORTANTE: Este método maneja la lógica para mostrar las mascotas del usuario. 
  // Si el usuario tiene una sola mascota, redirige directamente a su perfil. 
  // Si tiene múltiples mascotas, muestra un modal con la lista de ellas para seleccionar la correcta.
  const handleViewPets = (userId) => {
    const userPets = pets.filter((pet) => parseInt(pet.owner_id) === parseInt(userId));

    if (userPets.length === 0) {
      alert("Este usuario no tiene mascotas registradas.");
      return;
    }

    if (userPets.length === 1) {
      // Si tiene una sola mascota, ir directamente
      window.scrollTo(0, 0);
      navigate(`/inicio/mascotas/${userPets[0].id}`);
      return;
    }

    // Si tiene múltiples, mostrar modal
    setSelectedUserId(userId);
    setShowPetsModal(true);
  };

  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      style={{
        marginBottom: "12vh",
        backgroundColor: "#ffffffa9",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <div className="pet-pending-status">
        <Button
          variant={filterPending ? "secondary" : "outline-secondary"}
          onClick={handleFilterToggle}
        >
          {filterPending ? "Ver Todos" : "Pendientes por Validar"}
          {pendingValidationCount > 0 && (
            <>
              <FaClock style={{ marginLeft: "5px" }} />
              <span
                style={{
                  fontSize: "0.85rem",
                  marginLeft: "5px",
                }}
              >
                {pendingValidationCount}
              </span>
            </>
          )}
        </Button>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center p-4">
          <p>
            {filterPending
              ? "No hay usuarios pendientes de validar."
              : "No hay usuarios que coincidan con la búsqueda."}
          </p>
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          style={{ textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>
                <FaUser /> Usuario
              </th>
              <th>
                <FaEnvelope /> Email
              </th>
              <th>
                <FaPhone /> Teléfono
              </th>
              <th>
                <RiUserSettingsLine /> Rol
              </th>
              <th>
                <FaHome /> Dirección
              </th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: "600", color: "#103585" }}>
                    {capitalizeName(user.lastname)},{" "}
                    {capitalizeName(user.first_name)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6c757d",
                      marginTop: "5px",
                    }}
                  >
                    <div style={{ marginBottom: "2px" }}>
                      <FaCalendarPlus
                        size={10}
                        style={{ marginRight: "5px" }}
                      />
                      Creado: {formatDateTime(user.created_at)}
                    </div>
                    <div>
                      <FaCalendarEdit
                        size={10}
                        style={{ marginRight: "5px" }}
                      />
                      Actualizado: {formatDateTime(user.updated_at)}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "No suministrado"}</td>
                <td>{getUserRoleName(parseInt(user.user_role))}</td>
                <td>{user.street_address || "No suministrado"}</td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      backgroundColor:
                        user.is_activate == 1
                          ? "#d4edda"
                          : user.is_activate == 2
                            ? "#fff3cd"
                            : "#f8d7da",
                      color:
                        user.is_activate == 1
                          ? "#155724"
                          : user.is_activate == 2
                            ? "#856404"
                            : "#721c24",
                    }}
                  >
                    {user.is_activate == 1
                      ? "Activo"
                      : user.is_activate == 2
                        ? "Pendiente de validar"
                        : "Inactivo"}
                  </span>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewPets(user.id)}
                    style={{ margin: "2px" }}
                    title="Perfil de Mascota"
                  >
                    <FaPaw />
                  </Button>
                  {user.phone && (
                    <a
                      href={`https://wa.me/549${user.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success"
                      style={{ margin: "2px" }}
                      title="Contactar por WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>
                  )}
                  <EditUser user={user} />
                  <RemoveUser user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <UserPetsModal
        show={showPetsModal}
        onHide={() => setShowPetsModal(false)}
        userId={selectedUserId}
      />
    </div>
  );
}
