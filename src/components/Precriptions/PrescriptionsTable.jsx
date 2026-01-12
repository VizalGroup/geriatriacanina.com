import { useState, useEffect } from "react";
import { capitalizeName, getSexName, getPrescriptionType, formatDateTime, formatDate } from "../../utils";
import EditPrescription from "./EditPrescription";
import GeneratePrescriptionPDF from "./GeneratePrescriptionPDF";
import RemovePrescription from "./RemovePrescription";
import Pagination from "../Pagination";
import { FaCalendarPlus, FaEdit as FaCalendarEdit, FaUser } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function PrescriptionsTable({ prescriptions }) {
  console.log(prescriptions);
  
  const pets = useSelector((state) => state.pets);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  // Resetear a página 1 cuando cambien las prescripciones (búsqueda)
  useEffect(() => {
    setCurrentPage(1);
  }, [prescriptions.length]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentItems = prescriptions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
     style={{
        marginBottom: "12vh",
        backgroundColor: "#ffffffa9",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {prescriptions.length === 0 ? (
        <div className="text-center p-4">
          <p>No hay indicaciones que coincidan con la búsqueda.</p>
        </div>
      ) : (
         <Table striped bordered hover responsive style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>Solicitó</th>
                <th>Mascota y Tutor/a</th>
                <th>Título / Tipo</th>
                <th>Notas Internas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((prescription) => {
                // Buscar el owner desde pets
                const pet = pets.find(p => p.id === prescription.pet_id);
                const owner = pet?.owner;
                
                return (
                <tr key={prescription.id}>
                  {/* Columna Solicitó */}
                  <td>
                    <div style={{ fontWeight: "600", color: "#103585", marginBottom: "5px" }}>
                      Dr/a {capitalizeName(prescription.vet?.lastname)}{" "}
                      {capitalizeName(prescription.vet?.first_name)}
                    </div>
                    <div className="text-muted small" style={{ marginBottom: "5px" }}>
                      Solicitud N° {prescription.id}
                    </div>
                    <div className="text-muted small" style={{ marginBottom: "5px" }}>
                      Fecha: {formatDate(prescription.prescription_date)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "5px" }}>
                      <div style={{ marginBottom: "2px" }}>
                        <FaCalendarPlus size={10} style={{ marginRight: "5px" }} />
                        Creado: {formatDateTime(prescription.created_at)}
                      </div>
                      <div>
                        <FaCalendarEdit size={10} style={{ marginRight: "5px" }} />
                        Actualizado: {formatDateTime(prescription.updated_at)}
                      </div>
                    </div>
                  </td>

                  {/* Columna Mascota y Tutor */}
                  <td>
                    <div style={{ fontWeight: "600", color: "#103585", marginBottom: "5px" }}>
                      {capitalizeName(prescription.pet?.pet_name)}
                    </div>
                    <div className="text-muted small" style={{ marginBottom: "5px" }}>
                      {getSexName(prescription.pet?.sex)} - {capitalizeName(prescription.pet?.breed)}
                    </div>
                    {owner && (
                      <div style={{ fontSize: "0.85rem", color: "#555", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #eee" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                          <FaUser size={12} color="#103585" />
                          <strong>Tutor/a:</strong>
                        </div>
                        <div style={{ marginTop: "3px" }}>
                          {capitalizeName(owner.first_name)} {capitalizeName(owner.lastname)}
                        </div>
                        {owner.phone && (
                          <div className="text-muted" style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                            Tel: {owner.phone}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Columna Título / Tipo */}
                  <td>
                    <div style={{ marginBottom: "8px" }}>
                      {prescription.title && prescription.title.trim() !== "" ? (
                        <strong>{prescription.title}</strong>
                      ) : (
                        <span className="text-muted fst-italic" style={{ fontSize: "0.9rem" }}>
                          Sin título
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        backgroundColor: "#e7f3ff",
                        color: "#103585",
                      }}
                    >
                      {getPrescriptionType(prescription.prescription_type)}
                    </span>
                  </td>

                  {/* Columna Notas Internas */}
                  <td>
                    {prescription.notes && prescription.notes.trim() !== "" ? (
                      <div className="text-muted small" style={{ maxWidth: "250px", margin: "0 auto" }}>
                        {prescription.notes}
                      </div>
                    ) : (
                      <span className="text-muted fst-italic">Sin notas</span>
                    )}
                  </td>

                  {/* Columna Acciones */}
                  <td>
                    <GeneratePrescriptionPDF prescription={prescription} />
                    <EditPrescription prescription={prescription} />
                    <RemovePrescription prescription={prescription} />
                  </td>
                </tr>
              )})}
            </tbody>
          </Table>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
