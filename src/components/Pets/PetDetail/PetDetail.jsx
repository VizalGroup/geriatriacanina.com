import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPetDetail, GetVetRecords, GetUsers, GetPrescriptionMedications } from "../../../redux/actions";
import NavBar from "../../NavBar";
import BackButton from "../../BackButton";
import { Card, Row, Col, Button, Modal, Collapse } from "react-bootstrap";
import {
  FaPaw,
  FaDog,
  FaCat,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaCheckCircle,
  FaFileMedical,
  FaArrowLeft,
  FaWeight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";
import {
  getSexName,
  calculateAge,
  calculateAgeAtDate,
  formatDateTime,
  formatDate,
  isClient,
} from "../../../utils";
import AddVetRecord from "./AddVetRecord";
import AddPetMedicalDocuments from "./AddPetMedicalDocuments";
import PetMedicalDocumentsSection from "./PetMedicalDocumentsSection";
import PetPrescriptionsSection from "./PetPrescriptionsSection";
import VetRecordsTimeline from "./VetRecordsTimeline";
import { selectVetRecordsByDate } from "../../../redux/selectors/selectors";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  const petDetail = useSelector((state) => state.petDetail);
  const vetRecords = useSelector(selectVetRecordsByDate);
  console.log(vetRecords);
  
  const [showImageModal, setShowImageModal] = useState(false);
  const [isVetRecordsOpen, setIsVetRecordsOpen] = useState(false);

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/");
      return;
    }

    dispatch(GetPetDetail(id));
    dispatch(GetVetRecords());
    dispatch(GetUsers());
    dispatch(GetPrescriptionMedications());

  }, [dispatch, id, authenticatedUser, navigate]);

  // Filtrar historias clínicas de esta mascota
  const petVetRecords = vetRecords.filter(
    (record) => parseInt(record.pet_id) === parseInt(id)
  );

  if (!petDetail || !petDetail.id) {
    return (
      <>
        <NavBar />
        <div className="container" style={{ marginTop: "100px" }}>
          <BackButton />
          <div
            className="text-center"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
            }}
          >
            <div
              style={{
                animation: "pulse 1.5s ease-in-out infinite",
                marginBottom: "20px",
              }}
            >
              <FaPaw color="#2858BF" size={80} />
            </div>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#103585",
                fontWeight: "500",
              }}
            >
              Cargando información de la mascota...
            </p>
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.6;
              }
            }
          `}</style>
        </div>
      </>
    );
  }

  const getSpeciesIcon = (species) => {
    if (parseInt(species) === 0) return <FaDog color="#ffffffff" size={40} />;
    if (parseInt(species) === 1) return <FaCat color="#ffffffff" size={40} />;
    return <FaPaw color="#2858BF" size={40} />;
  };

 // Función para obtener el último peso registrado
  const getLastWeight = () => {
    const recordsWithWeight = petVetRecords.filter((record) => record.weight);
    console.log(recordsWithWeight);
    
    if (recordsWithWeight.length === 0) {
      return null;
    }
    
    return recordsWithWeight[0]; // Ya viene ordenado por fecha descendente
  };
  return (
    <>
      <NavBar />
      <div
        className="container"
        style={{ marginTop: "100px", marginBottom: "50px" }}
      >
        {isClient(authenticatedUser?.user_role) ? (
          <Button
            variant="primary"
            onClick={() => navigate('/inicio')}
            
          >
            <FaArrowLeft /> Volver 
          </Button>
        ) : (
          <BackButton />
        )}
        {!isClient(authenticatedUser?.user_role) && <AddVetRecord />}
        <AddPetMedicalDocuments />

        <Row className="mt-4">
          <Col lg={4} md={12} className="mb-4">
            {/* Card principal con foto y datos básicos */}
            <Card
              className="shadow-lg"
              style={{ borderRadius: "15px", border: "2px solid #2858BF" }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#2858BF",
                  color: "white",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                {getSpeciesIcon(petDetail.species)}
              </Card.Header>

              <Card.Body className="text-center">
                {petDetail.profile_picture_url ? (
                  <img
                    src={petDetail.profile_picture_url}
                    alt={petDetail.pet_name}
                    onClick={() => setShowImageModal(true)}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "5px solid #2858BF",
                      marginBottom: "20px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      border: "5px solid #2858BF",
                    }}
                  >
                    <FaPaw color="#ccc" size={80} />
                  </div>
                )}

                <h2
                  style={{
                    color: "#103585",
                    fontWeight: "700",
                    marginBottom: "20px",
                  }}
                >
                  {petDetail.pet_name}
                </h2>

                <hr style={{ margin: "20px 0" }} />

                {/* Información del sistema */}
                <div style={{ textAlign: "left", padding: "0 15px" }}>
                  <h6
                    style={{
                      color: "#103585",
                      fontWeight: "600",
                      marginBottom: "15px",
                      textAlign: "center",
                    }}
                  >
                    <FaCalendarEdit /> Información del Sistema
                  </h6>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    <FaCalendarPlus color="#6c757d" size={12} />{" "}
                    <strong>Registrado:</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginLeft: "20px",
                      marginBottom: "15px",
                    }}
                  >
                    {formatDateTime(petDetail.created_at)}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    <FaCalendarEdit color="#6c757d" size={12} />{" "}
                    <strong>Última actualización:</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginLeft: "20px",
                      marginBottom: "0",
                    }}
                  >
                    {formatDateTime(petDetail.updated_at)}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} md={12}>
            {/* Información detallada */}
            <Card className="shadow mb-4" style={{ borderRadius: "15px" }}>
              <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
                <h5 style={{ margin: "0", color: "#103585" }}>
                  <FaPaw /> Información General
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaBirthdayCake color="#2858BF" /> <strong>Edad:</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        marginLeft: "25px",
                      }}
                    >
                      {calculateAge(petDetail.birth_date)}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaCalendarPlus color="#2858BF" />{" "}
                      <strong>Fecha de Nacimiento:</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        marginLeft: "25px",
                      }}
                    >
                      {formatDate(petDetail.birth_date)}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaDog color="#2858BF" /> <strong>Raza:</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        marginLeft: "25px",
                      }}
                    >
                      {petDetail.breed}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaScissors color="#2858BF" />{" "}
                      <strong>Fecha de Castración:</strong>
                    </p>
                    {petDetail.castration_date &&
                    petDetail.castration_date !== "0000-00-00" ? (
                      <div style={{ marginLeft: "25px" }}>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            marginBottom: "5px",
                          }}
                        >
                          {formatDate(petDetail.castration_date)}
                        </p>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#999",
                          marginLeft: "25px",
                          fontStyle: "italic",
                        }}
                      >
                        No hay fecha de castración registrada
                      </p>
                    )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaVenusMars color="#2858BF" /> <strong>Sexo:</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        marginLeft: "25px",
                      }}
                    >
                      {getSexName(parseInt(petDetail.sex))}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p style={{ marginBottom: "5px", color: "#666" }}>
                      <FaWeight color="#2858BF" /> <strong>Último Peso:</strong>
                    </p>
                    {getLastWeight() ? (
                      <div style={{ marginLeft: "25px" }}>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            marginBottom: "5px",
                          }}
                        >
                          {`${getLastWeight().weight} kg`}
                        </p>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            fontStyle: "italic",
                            marginBottom: "0",
                          }}
                        >
                          ({formatDate(getLastWeight().event_date)})
                        </p>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#999",
                          marginLeft: "25px",
                          fontStyle: "italic",
                        }}
                      >
                        Sin registro
                      </p>
                    )}
                  </Col>
                  {petDetail.owner && (
                    <Col md={6} className="mb-3">
                      <p style={{ marginBottom: "5px", color: "#666" }}>
                        <FaUser color="#2858BF" /> <strong>Tutor/a:</strong>
                      </p>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          color: "#333",
                          marginLeft: "25px",
                        }}
                      >
                        {petDetail.owner.first_name} {petDetail.owner.lastname}
                      </p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>

            {/* Historial clínico - Solo visible para administradores/veterinarios */}
            {!isClient(authenticatedUser?.user_role) && (
              <Card className="shadow mb-4" style={{ borderRadius: "15px" }}>
                <Card.Header
                  style={{
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsVetRecordsOpen(!isVetRecordsOpen)}
                >
                  <h5 style={{ margin: "0", color: "#103585" }}>
                    <FaFileMedical /> Historial Clínico ({petVetRecords.length})
                  </h5>
                  <Button
                    variant="link"
                    style={{ color: "#103585", textDecoration: "none", padding: "0" }}
                  >
                    {isVetRecordsOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                  </Button>
                </Card.Header>
                <Collapse in={isVetRecordsOpen}>
                  <Card.Body>
                    <VetRecordsTimeline vetRecords={petVetRecords} />
                  </Card.Body>
                </Collapse>
              </Card>
            )}

            {/* Documentos Médicos */}
            <PetMedicalDocumentsSection petId={id} />

            {/* Indicaciones Médicas */}
            <PetPrescriptionsSection petId={id} />
          </Col>
        </Row>
      </div>

      {/* Modal para expandir imagen */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="lg"
        centered
      >
        {petDetail.profile_picture_url && (
          <img src={petDetail.profile_picture_url} alt={petDetail.pet_name} />
        )}
      </Modal>
    </>
  );
}
