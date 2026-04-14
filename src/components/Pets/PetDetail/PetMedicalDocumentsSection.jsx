import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPetMedicalDocuments } from "../../../redux/actions";
import { Card, Button, Collapse, Badge } from "react-bootstrap";
import {
  FaFileAlt,
  FaFlask,
  FaXRay,
  FaHeartbeat,
  FaFileInvoice,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaEye,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaMagnet,
  FaCamera,
  FaExclamationCircle,
  FaClipboardList,
  FaChartLine,
  FaImage,
  FaFileMedical,
} from "react-icons/fa";
import { GiMicroscope } from "react-icons/gi";
import { getPetMedicalDocumentType, formatDate, formatDateTime, isClient } from "../../../utils";
import { selectPetMedicalDocumentsByDate } from "../../../redux/selectors/selectors";
import EditPetMedicalDocument from "./EditPetMedicalDocument";
import RemovePetMedicalDocument from "./RemovePetMedicalDocument";

export default function PetMedicalDocumentsSection({ petId }) {
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const petMedicalDocuments = useSelector(selectPetMedicalDocumentsByDate);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(GetPetMedicalDocuments());
  }, [dispatch]);

  // Filtrar documentos de esta mascota
  const petDocuments = petMedicalDocuments.filter(
    (doc) => parseInt(doc.pet_id) === parseInt(petId)
  );

  // Agrupar documentos por tipo
  const groupedDocuments = petDocuments.reduce((acc, doc) => {
    const type = parseInt(doc.document_type);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {});

  // Función para obtener el icono según el tipo
  const getIconByType = (type) => {
    const icons = {
      0: <FaFlask color="#2858BF" size={20} />,          // Análisis
      1: <FaHeartbeat color="#2858BF" size={20} />,       // Ecografías
      2: <FaXRay color="#2858BF" size={20} />,            // Radiografías
      3: <GiMicroscope color="#2858BF" size={20} />,      // Endoscopías
      4: <FaMagnet color="#2858BF" size={20} />,          // RM
      5: <FaCamera color="#2858BF" size={20} />,          // TAC
      6: <FaFileInvoice color="#2858BF" size={20} />,     // Otros
      7: <FaClipboardList color="#2858BF" size={20} />,   // Cuestionario
      8: <FaChartLine color="#2858BF" size={20} />,       // Electrocardiograma
      9: <FaImage color="#2858BF" size={20} />,           // Fotos
      10: <FaFileMedical color="#2858BF" size={20} />,    // Informe médico
    };
    return icons[type] || <FaFileAlt color="#2858BF" size={20} />;
  };

  return (
    <Card className="shadow mb-4" style={{ borderRadius: "15px" }} id="documentos-medicos">
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
          <FaFileAlt /> Documentos Médicos ({petDocuments.length})
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
          {petDocuments.length === 0 ? (
            <p className="text-center text-muted">
              No hay documentos médicos registrados para esta mascota.
            </p>
          ) : (
            Object.keys(groupedDocuments)
              .sort((a, b) =>
                getPetMedicalDocumentType(parseInt(a)).localeCompare(
                  getPetMedicalDocumentType(parseInt(b)),
                  "es"
                )
              )
              .map((type) => (
                <div key={type} style={{ marginBottom: "30px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #2858BF",
                    }}
                  >
                    {getIconByType(parseInt(type))}
                    <h6 style={{ margin: "0", color: "#103585", fontWeight: "600" }}>
                      {getPetMedicalDocumentType(parseInt(type))} (
                      {groupedDocuments[type].length})
                    </h6>
                  </div>

                  {/* Contenedor con scroll horizontal */}
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      overflowX: "auto",
                      paddingBottom: "10px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#2858BF #f0f0f0",
                    }}
                  >
                    {groupedDocuments[type].map((doc) => (
                      <Card
                        key={doc.id}
                        style={{
                          minWidth: "300px",
                          maxWidth: "300px",
                          border: parseInt(doc.is_approved) === 0 
                            ? "2px solid #dc3545" 
                            : "1px solid #dee2e6",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          flexShrink: 0,
                          backgroundColor: parseInt(doc.is_approved) === 0 
                            ? "#fff5f5" 
                            : "#ffffff",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.15)";
                          e.currentTarget.style.transform = "translateY(-3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <Card.Body>
                          {parseInt(doc.is_approved) === 0 && (
                            <Badge 
                              bg="danger" 
                              style={{ 
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                width: "fit-content"
                              }}
                            >
                              <FaExclamationCircle /> Pendiente de revisar
                            </Badge>
                          )}
                          
                          <strong
                            style={{
                              fontSize: "1rem",
                              color: "#103585",
                              display: "block",
                              marginBottom: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={doc.document_title}
                          >
                            {doc.document_title}
                          </strong>

                          <div style={{ marginBottom: "12px" }}>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#333",
                                marginBottom: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Fecha del estudio: {formatDate(doc.document_date)}
                            </p>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <FaUser color="#6c757d" size={14} />
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                }}
                              >
                                {doc.user?.first_name} {doc.user?.lastname}
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#999",
                                paddingLeft: "22px",
                              }}
                            >
                              <div style={{ marginBottom: "3px" }}>
                                <FaCalendarPlus
                                  color="#999"
                                  size={10}
                                  style={{ marginRight: "5px" }}
                                />
                                Registrado: {formatDateTime(doc.created_at)}
                              </div>
                              <div>
                                <FaCalendarEdit
                                  color="#999"
                                  size={10}
                                  style={{ marginRight: "5px" }}
                                />
                                Actualizado: {formatDateTime(doc.updated_at)}
                              </div>
                            </div>
                          </div>
                        </Card.Body>

                        <Card.Footer
                          style={{
                            backgroundColor: parseInt(doc.is_approved) === 0 
                              ? "#ffe0e0" 
                              : "#f8f9fa",
                            borderTop: "1px solid #dee2e6",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                            }}
                          >
                            {parseInt(doc.is_approved) === 1 ? (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  href={doc.document_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ flex: 1 }}
                                  title="Ver documento"
                                >
                                  <FaEye />
                                </Button>
                                {/* Ocultar editar y eliminar para clientes si está aprobado */}
                                {!isClient(authenticatedUser?.user_role) && (
                                  <>
                                    <EditPetMedicalDocument document={doc} />
                                    <RemovePetMedicalDocument document={doc} />
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {/* Si está pendiente, cliente puede editar pero no aprobar */}
                                <EditPetMedicalDocument document={doc} />
                                <RemovePetMedicalDocument document={doc} />
                              </>
                            )}
                          </div>
                        </Card.Footer>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
          )}
        </Card.Body>
      </Collapse>

      {/* Estilos para el scrollbar en navegadores webkit */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #2858BF;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #103585;
        }
      `}</style>
    </Card>
  );
}
