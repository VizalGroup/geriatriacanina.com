import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import AddUser from "./AddUser";
import UsersTable from "./UsersTable";
import { useDispatch, useSelector } from "react-redux";
import { GetPets, GetUsers, LogoutUser } from "../../redux/actions";
import BackButton from "../BackButton";
import { selectSortedUsers } from "../../redux/selectors/selectors";
import { normalizeText, canManageSystem } from "../../utils";
import SearchBar from "../SearchBar";
import { FaCopy, FaCheck } from "react-icons/fa";
import { Button } from "react-bootstrap";

export default function Users() {
  document.title = "Usuarios - Geriatría Canina";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const users = useSelector(selectSortedUsers);
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const registrationLink = "https://geriatriacanina.com/registro_de_usuarios";
    navigator.clipboard
      .writeText(registrationLink)
      .then(() => {
        setLinkCopied(true);
        alert("Enlace copiado en portapapeles");
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar el enlace: ", err);
        alert("Error al copiar el enlace");
      });
  };

  useEffect(() => {
    // Verificar autenticación
    if (!authenticatedUser) {
      navigate("/");
      return;
    }

    // Verificar que no sea cliente (rol 3)
    if (!canManageSystem(authenticatedUser.user_role)) {
      alert("No tienes permisos para acceder a esta sección.");
      dispatch(LogoutUser());
      navigate("/");
      return;
    }

    dispatch(GetUsers());
    dispatch(GetPets());
  }, [dispatch, authenticatedUser, navigate]);

  const filteredUsers = users.filter((user) => {
    const normalizedSearch = normalizeText(searchTerm);

    return (
      normalizeText(user.first_name).includes(normalizedSearch) ||
      normalizeText(user.lastname).includes(normalizedSearch) ||
      normalizeText(user.email).includes(normalizedSearch) ||
      normalizeText(user.phone).includes(normalizedSearch) ||
      normalizeText(user.street_address).includes(normalizedSearch)
    );
  });

  if (!authenticatedUser || !canManageSystem(authenticatedUser.user_role)) {
    return null;
  }

  return (
    <div className="watermark-background">
      <NavBar />
      <div className="container" style={{ marginTop: "100px" }}>
        <BackButton />

        <Button
          variant="primary"
          style={{ margin: "5px" }}
          onClick={handleCopyLink}
        >
          <FaCopy /> Copiar enlace de registro
        </Button>

        <AddUser />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por nombre, email, teléfono o dirección..."
        />

        <UsersTable users={filteredUsers} />
      </div>
    </div>
  );
}
