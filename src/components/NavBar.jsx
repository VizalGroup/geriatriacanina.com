import {
  FaHome,
  FaDoorOpen,
  FaUserCog,
  FaDog,
  FaCat,
  FaAddressCard,
  FaPrescriptionBottleAlt,
  FaStickyNote,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../redux/actions";
import { canManageSystem } from "../utils";

export default function NavBar() {
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);

  const handleLogout = () => {
    dispatch(LogoutUser());
    window.location.href = "/";
  };

  // Verificar si el usuario puede gestionar el sistema
  const canAccessManagement =
    authenticatedUser && canManageSystem(authenticatedUser.user_role);

  return (
    <nav className="navbar navbar-dark navbar-custom fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand navbar-title" href="/inicio">
          Geriatría Canina
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end offcanvas-custom"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menú Principal
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/inicio"
                >
                  <FaHome /> Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/inicio/actualizar_credenciales">
                  <FaAddressCard /> Actualizar credenciales de usuario
                </a>
              </li>

              {/* Solo mostrar estas opciones si NO es cliente (rol 3) */}
              {canAccessManagement && (
                <>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/inicio/indicaciones">
                      <FaPrescriptionBottleAlt /> Indicaciones
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/inicio/mascotas">
                      <FaDog /> Mascotas <FaCat />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/inicio/usuarios">
                      <FaUserCog /> Usuarios
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/inicio/notas-del-sistema">
                      <FaStickyNote /> Notas del Sistema {import.meta.env.VITE_APP_VERSION}
                    </a>
                  </li>
                </>
              )}

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <FaDoorOpen /> Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
