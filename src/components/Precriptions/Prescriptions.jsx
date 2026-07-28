import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPets,
  GetPrescriptionMedications,
  GetPrescriptions,
  GetVetRecords,
} from "../../redux/actions";
import NavBar from "../NavBar";
import AddPrescription from "./AddPrescription";
import BackButton from "../BackButton";
import PrescriptionsTable from "./PrescriptionsTable";
import { selectSortedPrescriptions } from "../../redux/selectors/selectors";
import { isDateInRange, normalizeText } from "../../utils";
import SearchBar from "../SearchBar";
import DateRangeFilter from "../DateRangeFilter";

export default function Prescriptions() {
  document.title = "Indicaciones - Geriatría Canina";

  const dispatch = useDispatch();
  const prescriptions = useSelector(selectSortedPrescriptions);
  const pets = useSelector((state) => state.pets);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    dispatch(GetPrescriptions());
    dispatch(GetPrescriptionMedications());
    dispatch(GetPets());
    dispatch(GetVetRecords());
  }, [dispatch]);

  // Filtrar indicaciones por mascota o tutor/a (texto) y por rango de fechas
  const normalizedSearch = normalizeText(searchTerm);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    // El rango de fechas se aplica siempre, en combinación con la búsqueda de texto
    if (!isDateInRange(prescription.prescription_date, dateFrom, dateTo)) {
      return false;
    }

    if (!normalizedSearch) return true;

    // Buscar en nombre de mascota
    const matchesPetName = normalizeText(
      prescription.pet?.pet_name || ""
    ).includes(normalizedSearch);

    // El tutor/a se obtiene desde la mascota cargada en el estado
    const owner = pets.find((pet) => pet.id === prescription.pet_id)?.owner;
    const matchesOwner = normalizeText(
      `${owner?.first_name || ""} ${owner?.lastname || ""}`
    ).includes(normalizedSearch);

    return matchesPetName || matchesOwner;
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
          placeholder="Buscar por mascota o tutor/a..."
        >
          <DateRangeFilter
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </SearchBar>

        <PrescriptionsTable prescriptions={filteredPrescriptions} />
      </div>
    </div>
  );
}
