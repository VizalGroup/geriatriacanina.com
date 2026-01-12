import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCog,
  FaDog,
  FaCat,
  FaUser,
  FaClock,
  FaPaw,
  FaPrescriptionBottleAlt,
  FaStickyNote,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { GetPets, GetUserDetail, LogoutUser } from "../../redux/actions";
import {
  getSessionTimeRemaining,
  isClient,
  canManageSystem,
} from "../../utils";
import ClientAddPet from "./Client/ClientAddPet";
import ClientPetsContainer from "./Client/ClientPetsContainer";

export default function Dashboard() {
  document.title = "Inicio - Geriatría Canina";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);

  const userDetail = useSelector((state) => state.userDetail);
  const pets = useSelector((state) => state.pets);
  const [timeRemaining, setTimeRemaining] = useState("");

  // Filtrar mascotas aprobadas del cliente autenticado
  const approvedClientPets = pets.filter(
    (pet) => pet.owner_id === authenticatedUser?.id && pet.current_state === 1
  );

  useEffect(() => {
    // Verificar si hay un usuario autenticado
    if (!authenticatedUser) {
      navigate("/");
      return;
    }

    // Verificar si la sesión ha expirado
    const now = Math.floor(Date.now() / 1000);
    if (authenticatedUser.expires_at && now > authenticatedUser.expires_at) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      dispatch(LogoutUser());
      navigate("/");
      return;
    }

    // Obtener los detalles del usuario autenticado
    if (authenticatedUser.id) {
      dispatch(GetUserDetail(authenticatedUser.id));
      dispatch(GetPets());
    }
  }, [authenticatedUser, dispatch, navigate]);

  // Actualizar el tiempo restante cada minuto
  useEffect(() => {
    if (!authenticatedUser?.expires_at) return;

    const updateTime = () => {
      const remaining = getSessionTimeRemaining(authenticatedUser.expires_at);
      setTimeRemaining(remaining);

      // Si la sesión expiró, cerrar sesión
      if (remaining === "Sesión expirada") {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        dispatch(LogoutUser());
        navigate("/");
      }
    };

    updateTime(); // Actualizar inmediatamente
    const interval = setInterval(updateTime, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [authenticatedUser, dispatch, navigate]);

  // Función para obtener el color según el índice
  const getButtonColor = (index) => {
    const colors = ["btn-primary-custom", "btn-secondary-custom", "btn-light"];
    return colors[index % colors.length];
  };

  // Array de módulos según el rol (ordenados alfabéticamente, excepto Notas del Sistema al final)
  const modules = canManageSystem(authenticatedUser?.user_role)
    ? [
        {
          key: "prescriptions",
          path: "/inicio/indicaciones",
          icon: FaPrescriptionBottleAlt,
          text: "Indicaciones",
        },
        {
          key: "pets",
          path: "/inicio/mascotas",
          icon: () => (
            <span>
              <FaDog /> Mascotas <FaCat />
            </span>
          ),
          text: "",
        },
        {
          key: "configUsers",
          path: "/inicio/usuarios",
          icon: FaUserCog,
          text: "Usuarios",
        },
        {
          key: "systemNotes",
          path: "/inicio/notas-del-sistema",
          icon: FaStickyNote,
          text: `Notas del Sistema ${import.meta.env.VITE_APP_VERSION}`,
        },
      ]
    : [];

  if (!authenticatedUser) {
    return null;
  }

  return (
    <div className="watermark-background" style={{ marginTop: "80px" }}>
      <NavBar />
      <div className="text-center">
        <h3 className="user-text">
          <FaUser /> {userDetail?.first_name || authenticatedUser.first_name}{" "}
          {userDetail?.lastname || authenticatedUser.lastname}
        </h3>
        <p className="session-info">
          <FaClock /> Sesión expira en: <strong>{timeRemaining}</strong>
        </p>
      </div>
      <div className="container">
        {isClient(authenticatedUser.user_role) ? (
          // Vista para tutores
          <div>
            {approvedClientPets.length > 0 ? (
              // Mostrar mascotas aprobadas
              <>
                <ClientPetsContainer pets={approvedClientPets} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <ClientAddPet />
                </div>
              </>
            ) : (
              // Mostrar mensaje de bienvenida
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                  padding: "40px",
                }}
              >
                <FaPaw
                  size={120}
                  color="#2858BF"
                  style={{
                    marginBottom: "30px",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <h2
                  style={{
                    color: "#103585",
                    fontWeight: "700",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Portal del Tutor/a
                </h2>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#666",
                    textAlign: "center",
                    maxWidth: "600px",
                    marginBottom: "30px",
                  }}
                >
                  Próximamente tendrás acceso a las fichas médicas de tus
                  mascotas y podrás acceder a sus documentos desde aquí.
                </p>
                <ClientAddPet />
              </div>
            )}
          </div>
        ) : (
          // Vista para administradores/veterinarios
          <div className="admin-panel">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={module.key} className="admin-button-container">
                  <Link to={module.path} className="module-link">
                    <button
                      className={`btn ${getButtonColor(
                        index
                      )} btn-lg admin-button`}
                    >
                      <IconComponent />
                      <span> {module.text} </span>
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
