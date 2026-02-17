import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPrescriptions } from "../../../redux/actions";
import { Card, Button, Collapse } from "react-bootstrap";
import {
  FaPrescriptionBottleAlt,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaPills,
  FaFlask,
  FaStickyNote,
} from "react-icons/fa";
import { getPrescriptionType, formatDate, formatDateTime } from "../../../utils";
import { selectSortedPrescriptions } from "../../../redux/selectors/selectors";
import GeneratePrescriptionPDF from "../../Precriptions/GeneratePrescriptionPDF";

export default function PetPrescriptionsSection({ petId }) {
  const dispatch = useDispatch();
  const prescriptions = useSelector(selectSortedPrescriptions);
  console.log(prescriptions);
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(GetPrescriptions());
  }, [dispatch]);

  // Filtrar indicaciones de esta mascota
  const petPrescriptions = prescriptions.filter(
    (prescription) => parseInt(prescription.pet_id) === parseInt(petId)
  );

  // Función para obtener el icono según el tipo
  const getIconByType = (type) => {
    const icons = {
      0: <FaPills color="#2858BF" size={20} />, // Medicación/Receta
      1: <FaFlask color="#2858BF" size={20} />, // Solicitud de Estudios
      2: <FaStickyNote color="#2858BF" size={20} />, // Indicaciones
    };
    return icons[type] || <FaPrescriptionBottleAlt color="#2858BF" size={20} />;
  };

  return (
    <Card className="shadow mb-4" style={{ borderRadius: "15px" }} id="indicaciones-medicas">
      <Card.Header
        style={{
          backgroundColor: "#f8f9fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h5 style={{ margin: "0", color: "#103585" }}>
          <FaPrescriptionBottleAlt /> Indicaciones Médicas ({petPrescriptions.length})
        </h5>
        <Button
          variant="link"
          style={{ color: "#103585", textDecoration: "none", padding: "0" }}
        >
          {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </Button>
      </Card.Header>
      <Collapse in={isOpen}>
        <Card.Body>
          {petPrescriptions.length === 0 ? (
            <p className="text-center text-muted">
              No hay indicaciones médicas registradas para esta mascota.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {petPrescriptions.map((prescription) => (
                <Card
                  key={prescription.id}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Card.Body>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                      <div style={{ flexShrink: 0 }}>
                        {getIconByType(parseInt(prescription.prescription_type))}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <div>
                        
                            <strong
                              style={{
                                fontSize: "1.1rem",
                                color: "#103585",
                                display: "block",
                              }}
                            >
                              #{prescription.id} - {prescription.title && prescription.title.trim() !== ""
                                ? prescription.title 
                                : getPrescriptionType(parseInt(prescription.prescription_type))}
                            </strong>
                          </div>
                          <GeneratePrescriptionPDF prescription={prescription} />
                        </div>

                        <p style={{ fontSize: "0.95rem", color: "#333", marginBottom: "8px" }}>
                          <strong>Fecha:</strong> {formatDate(prescription.prescription_date)}
                        </p>

                        {prescription.content && prescription.content.trim() !== "" && (
                          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
                            {prescription.content}
                          </p>
                        )}

                        {prescription.warnings && prescription.warnings.trim() !== "" && (
                          <div style={{ 
                            backgroundColor: "#fff3cd", 
                            border: "1px solid #ffc107", 
                            borderRadius: "5px", 
                            padding: "8px",
                            marginBottom: "10px"
                          }}>
                            <strong style={{ color: "#856404" }}>⚠️ Advertencias:</strong>
                            <p style={{ fontSize: "0.85rem", color: "#856404", marginBottom: "0", marginTop: "5px" }}>
                              {prescription.warnings}
                            </p>
                          </div>
                        )}

                        <div style={{ fontSize: "0.75rem", color: "#999", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                            <FaUser color="#6c757d" size={12} />
                            <span>{prescription.vet?.first_name} {prescription.vet?.lastname}</span>
                          </div>
                          <div style={{ marginBottom: "3px" }}>
                            <FaCalendarPlus color="#999" size={10} style={{ marginRight: "5px" }} />
                            Registrado: {formatDateTime(prescription.created_at)}
                          </div>
                          <div>
                            <FaCalendarEdit color="#999" size={10} style={{ marginRight: "5px" }} />
                            Actualizado: {formatDateTime(prescription.updated_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Collapse>
    </Card>
  );
}
