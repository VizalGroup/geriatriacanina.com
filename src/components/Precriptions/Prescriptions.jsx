import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPets,
  GetPrescriptionMedications,
  GetPrescriptions,
} from "../../redux/actions";
import NavBar from "../NavBar";
import AddPrescription from "./AddPrescription";
import BackButton from "../BackButton";
import PrescriptionsTable from "./PrescriptionsTable";
import { selectSortedPrescriptions } from "../../redux/selectors/selectors";
import { normalizeText } from "../../utils";
import SearchBar from "../SearchBar";

export default function Prescriptions() {
  document.title = "Indicaciones - Geriatría Canina";

  const dispatch = useDispatch();
  const prescriptions = useSelector(selectSortedPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetPrescriptions());
    dispatch(GetPrescriptionMedications());
    dispatch(GetPets());
  }, [dispatch]);

  // Filtrar indicaciones según el término de búsqueda
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const normalizedSearch = normalizeText(searchTerm);

    // Buscar en nombre de mascota
    const matchesPetName = normalizeText(
      prescription.pet?.pet_name || ""
    ).includes(normalizedSearch);

    // Buscar en notas internas
    const matchesNotes = normalizeText(prescription.notes || "").includes(
      normalizedSearch
    );

    // Buscar en nombre y apellido del veterinario
    const matchesVetName =
      normalizeText(prescription.vet?.first_name || "").includes(
        normalizedSearch
      ) ||
      normalizeText(prescription.vet?.lastname || "").includes(
        normalizedSearch
      );

    return matchesPetName || matchesNotes || matchesVetName;
  });

  return (
    <div className="watermark-background" style={{ marginTop: "80px" }}>
      <NavBar />
      <div className="container" style={{ marginTop: "100px" }}>
        <BackButton />
        <AddPrescription />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por mascota, veterinario o notas internas..."
        />

        <PrescriptionsTable prescriptions={filteredPrescriptions} />
      </div>
    </div>
  );
}
