import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import BackButton from "../BackButton";
import AddPet from "./AddPet";
import PetsContainer from "./PetsContainer";
import { useDispatch, useSelector } from "react-redux";
import { GetPetMedicalDocuments, GetPets, GetUsers, GetVetRecords, LogoutUser } from "../../redux/actions";
import { normalizeText, canManageSystem } from "../../utils";
import SearchBar from "../SearchBar";
import { selectSortedPets } from "../../redux/selectors/selectors";
import { Button } from "react-bootstrap";
import { FaClock, FaCheckCircle } from "react-icons/fa";

export default function Pets() {
  document.title = "Mascotas - Geriatría Canina";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const pets = useSelector(selectSortedPets);

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

    dispatch(GetPets());
    dispatch(GetUsers());
    dispatch(GetVetRecords());
    dispatch(GetPetMedicalDocuments());
  }, [dispatch, authenticatedUser, navigate]);

  // Contar mascotas pendientes de validar
  const pendingPetsCount = pets.filter(
    (pet) => parseInt(pet.current_state) === 0
  ).length;

  const filteredPets = pets.filter((pet) => {
    const normalizedSearch = normalizeText(searchTerm);

    // Filtrar por búsqueda
    const matchesSearch =
      normalizeText(pet.pet_name).includes(normalizedSearch) ||
      normalizeText(pet.breed).includes(normalizedSearch) ||
      (pet.owner &&
        (normalizeText(pet.owner.first_name).includes(normalizedSearch) ||
          normalizeText(pet.owner.lastname).includes(normalizedSearch)));

    // Filtrar por estado pendiente si está activo
    const matchesPendingFilter = showPendingOnly
      ? parseInt(pet.current_state) === 0
      : true;

    return matchesSearch && matchesPendingFilter;
  });

  if (!authenticatedUser || !canManageSystem(authenticatedUser.user_role)) {
    return null;
  }

  return (
    <div className="watermark-background">
      <NavBar />
      <div className="container" style={{ marginTop: "100px" }}>
        <BackButton />
        <AddPet />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por nombre de mascota, dueño o raza..."
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <Button
            variant={showPendingOnly ? "secondary" : "outline-secondary"}
            onClick={() => setShowPendingOnly(!showPendingOnly)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              fontWeight: "600",
              borderRadius: "25px",
              transition: "all 0.3s ease",
            }}
          >
            {showPendingOnly ? (
              <>
                <FaCheckCircle /> Mostrar todas
              </>
            ) : (
              <>
                <FaClock /> Pendientes de validar ({pendingPetsCount})
              </>
            )}
          </Button>
        </div>

        <PetsContainer pets={filteredPets} />
      </div>
    </div>
  );
}
