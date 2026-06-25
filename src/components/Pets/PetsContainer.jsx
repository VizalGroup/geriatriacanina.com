import { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  FaPaw,
  FaDog,
  FaCat,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaFileAlt,
  FaWhatsapp,
  FaClock,
  FaCalendarPlus,
  FaEdit as FaCalendarEdit,
  FaEye,
  FaPrescriptionBottleAlt,
  FaHeartBroken,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import {
  getSpeciesName,
  getSexName,
  calculateAge,
  formatDateTime,
  isVeterinarian,
} from "../../utils";
import EditPet from "./EditPet";
import RemovePet from "./RemovePet";

export default function PetsContainer({ pets }) {
  console.log(pets);
  
  const navigate = useNavigate();
  const vetRecords = useSelector((state) => state.vetRecords);
  const petMedicalDocuments = useSelector((state) => state.petMedicalDocuments);
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  // El rol veterinario no puede editar los datos de las mascotas desde las cards
  const isVet = isVeterinarian(authenticatedUser?.user_role);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(pets.length / itemsPerPage);

  // Resetear a página 1 cuando cambien los pets (búsqueda)
  useEffect(() => {
    setCurrentPage(1);
  }, [pets.length]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentItems = pets.slice(indexOfFirstItem, indexOfLastItem);

  const getSpeciesIcon = (species) => {
    if (parseInt(species) === 0) return <FaDog color="white" size={24} />;
    if (parseInt(species) === 1) return <FaCat color="white" size={24} />;
    return <FaPaw color="white" size={24} />;
  };

  // Función para verificar si una mascota tiene registros médicos
  const hasVetRecords = (petId) => {
    return vetRecords.some(
      (record) => parseInt(record.pet_id) === parseInt(petId)
    );
  };

  // Función para verificar si se puede eliminar la mascota
  const canDeletePet = (pet) => {
    const isValidated = parseInt(pet.current_state) === 1;
    const hasMedicalRecords = hasVetRecords(pet.id);
    // No se puede eliminar si está validada Y tiene registros médicos
    return !(isValidated && hasMedicalRecords);
  };

  // Función para verificar si está validada o fallecida (ambas habilitan los botones)
  const isValidated = (pet) => {
    return parseInt(pet.current_state) === 1 || parseInt(pet.current_state) === 2;
  };

  // Función para verificar si una mascota ha fallecido
  const isDeceased = (pet) => parseInt(pet.current_state) === 2;

  // Función para verificar si una mascota tiene documentos pendientes de aprobar
  const hasPendingDocuments = (petId) => {
    return petMedicalDocuments.some(
      (doc) => parseInt(doc.pet_id) === parseInt(petId) && parseInt(doc.is_approved) === 0
    );
  };

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

      {pets.length === 0 ? (
        <div className="text-center p-4">
          <p>No hay mascotas que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <Row className="justify-content-center">
          {currentItems.map((pet) => (
            <Col xs={12} sm={6} md={4} lg={3} key={pet.id} className="mb-4">
              <Card className="pet-card h-100 shadow-sm">
                <div
                  className="pet-card-header"
                  style={{
                    backgroundColor: isDeceased(pet) ? "#2d2d2d" : "#2858BF",
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

                  {/* Mostrar estado solo si es 0 (pendiente de validar) */}
                  {parseInt(pet.current_state) === 0 && (
                    <div className="pet-pending-status">
                      <FaClock color="#6c757d" />
                      <span
                        style={{
                          color: "#6c757d",
                          fontSize: "0.85rem",
                          marginLeft: "5px",
                        }}
                      >
                        Pendiente de validar
                      </span>
                    </div>
                  )}

                  {isDeceased(pet) && (
                    <div style={{ marginBottom: "8px" }}>
                      <FaHeartBroken color="#777" />
                      <span
                        style={{
                          color: "#777",
                          fontSize: "0.85rem",
                          marginLeft: "5px",
                          fontStyle: "italic",
                        }}
                      >
                        Fallecido/a
                      </span>
                    </div>
                  )}

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

                  {pet.owner && (
                    <>
                      <hr style={{ margin: "10px 0" }} />
                      <div className="pet-owner-info">
                        <FaUser color="#103585" />
                        <span style={{ marginLeft: "5px", fontSize: "0.9rem" }}>
                          {pet.owner.first_name} {pet.owner.lastname}
                        </span>
                      </div>
                    </>
                  )}

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
                    {pet.owner?.phone && (
                      <>
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
                          disabled={!isValidated(pet)}
                          title={
                            !isValidated(pet)
                              ? "La mascota debe estar validada para ver documentos"
                              : hasPendingDocuments(pet.id)
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
                          disabled={!isValidated(pet)}
                          title={
                            !isValidated(pet)
                              ? "La mascota debe estar validada para ver indicaciones"
                              : ""
                          }
                        >
                          <FaPrescriptionBottleAlt /> Indicaciones
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          href={`https://wa.me/549${pet.owner.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ margin: "5px" }}
                        >
                          <FaWhatsapp /> WhatsApp
                        </Button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/inicio/mascotas/${pet.id}`);
                      }}
                      style={{ margin: "5px" }}
                      disabled={!isValidated(pet)}
                      title={
                        !isValidated(pet)
                          ? "La mascota debe estar validada para ver su detalle"
                          : ""
                      }
                    >
                      <FaEye /> Ver Detalle
                    </Button>
                    {!isVet && <EditPet pet={pet} />}
                    {canDeletePet(pet) && <RemovePet pet={pet} />}
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
