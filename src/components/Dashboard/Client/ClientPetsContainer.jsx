import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  FaPaw,
  FaDog,
  FaCat,
  FaBirthdayCake,
  FaVenusMars,
  FaFileAlt,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaEye,
  FaPrescriptionBottleAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getSpeciesName,
  getSexName,
  calculateAge,
  formatDateTime,
} from "../../../utils";

export default function ClientPetsContainer({ pets }) {
  const navigate = useNavigate();
  const petMedicalDocuments = useSelector((state) => state.petMedicalDocuments);

  const getSpeciesIcon = (species) => {
    if (parseInt(species) === 0) return <FaDog color="white" size={24} />;
    if (parseInt(species) === 1) return <FaCat color="white" size={24} />;
    return <FaPaw color="white" size={24} />;
  };

  // Función para verificar si una mascota tiene documentos pendientes de aprobar
  const hasPendingDocuments = (petId) => {
    return petMedicalDocuments.some(
      (doc) => parseInt(doc.pet_id) === parseInt(petId) && parseInt(doc.is_approved) === 0
    );
  };

  return (
    <div
      style={{
        marginBottom: "4vh",
        backgroundColor: "#ffffffa9",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <h3 style={{ 
        textAlign: "center", 
        color: "#103585", 
        fontWeight: "700",
        marginBottom: "30px" 
      }}>
        Mis Mascotas
      </h3>

      {pets.length === 0 ? (
        <div className="text-center p-4">
          <p>No tienes mascotas registradas aún.</p>
        </div>
      ) : (
        <Row className="justify-content-center">
          {pets.map((pet) => (
            <Col xs={12} sm={6} md={4} lg={3} key={pet.id} className="mb-4">
              <Card className="pet-card h-100 shadow-sm">
                <div
                  className="pet-card-header"
                  style={{
                    backgroundColor: "#2858BF",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {getSpeciesIcon(pet.species)}
                  <div
                    style={{
                      color: "white",
                      fontSize: "0.9rem",
                      marginTop: "5px",
                    }}
                  >
                    {getSpeciesName(parseInt(pet.species))}
                  </div>
                </div>

                <div className="text-center" style={{ marginTop: "-40px" }}>
                  {pet.profile_picture_url ? (
                    <img
                      src={pet.profile_picture_url}
                      alt={pet.pet_name}
                      className="pet-card-image"
                    />
                  ) : (
                    <div className="pet-card-placeholder">
                      <FaPaw color="#ccc" size={50} />
                    </div>
                  )}
                </div>

                <Card.Body className="text-center">
                  <Card.Title
                    style={{
                      color: "#103585",
                      fontWeight: "700",
                      fontSize: "1.3rem",
                    }}
                  >
                    {pet.pet_name}
                  </Card.Title>

                  <div className="pet-card-info">
                    <div className="pet-info-item">
                      <FaBirthdayCake color="#2858BF" />
                      <span>{calculateAge(pet.birth_date)}</span>
                    </div>
                    <div className="pet-info-item">
                      <FaVenusMars color="#2858BF" />
                      <span>{getSexName(parseInt(pet.sex))}</span>
                    </div>
                    <div className="pet-info-item">
                      <FaDog color="#2858BF" />
                      <span>{pet.breed}</span>
                    </div>
                  </div>

                  <hr style={{ margin: "10px 0" }} />

                  <div className="pet-dates-info">
                    <div className="pet-date-item">
                      <FaCalendarPlus color="#6c757d" size={12} />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6c757d",
                          marginLeft: "5px",
                        }}
                      >
                        Creado/a: {formatDateTime(pet.created_at)}
                      </span>
                    </div>
                    <div className="pet-date-item">
                      <FaCalendarEdit color="#6c757d" size={12} />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6c757d",
                          marginLeft: "5px",
                        }}
                      >
                        Actualizado: {formatDateTime(pet.updated_at)}
                      </span>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer
                  className="text-center"
                  style={{ backgroundColor: "#f8f9fa", border: "none" }}
                >
                  <div className="pet-contact-buttons">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        navigate(`/inicio/mascotas/${pet.id}`);
                        setTimeout(() => {
                          const element = document.getElementById(
                            "documentos-medicos"
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }, 100);
                      }}
                      style={{ margin: "5px" }}
                      className={hasPendingDocuments(pet.id) ? "btn-blinking" : ""}
                      title={
                        hasPendingDocuments(pet.id)
                          ? "Tiene documentos pendientes de aprobar"
                          : ""
                      }
                    >
                      <FaFileAlt /> Documentos
                      {hasPendingDocuments(pet.id) && (
                        <span 
                          style={{
                            marginLeft: "5px",
                            fontSize: "0.7rem",
                            backgroundColor: "#dc3545",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px 5px",
                            fontWeight: "bold"
                          }}
                        >
                          !
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        navigate(`/inicio/mascotas/${pet.id}`);
                        setTimeout(() => {
                          const element = document.getElementById(
                            "indicaciones-medicas"
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }, 100);
                      }}
                      style={{ margin: "5px" }}
                    >
                      <FaPrescriptionBottleAlt /> Indicaciones
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/inicio/mascotas/${pet.id}`);
                      }}
                      style={{ margin: "5px" }}
                    >
                      <FaEye /> Ver Detalle
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
