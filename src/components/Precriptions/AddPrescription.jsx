import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Alert, Modal, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getCurrentDateTime, capitalizeName, normalizeText, getTodayDate } from "../../utils";
import { PostPrescription, PostPrescriptionMedication, GetPrescriptions, GetPrescriptionMedications, GetPets } from "../../redux/actions";
import {
  FaPlus,
  FaPaw,
  FaListAlt,
  FaHeading,
  FaFileAlt,
  FaExclamationTriangle,
  FaStickyNote,
  FaCalendarDay,
  FaPills,
  FaDna,
  FaSyringe,
  FaClock,
  FaPrescription,
  FaTrash,
  FaSearch,
  FaBoxes,
  FaTint,
  FaHeartbeat,
  FaVial,
  FaMicroscope,
} from "react-icons/fa";



const prescriptionFormData = {
  pet_id: "",
  vet_id: "",
  prescription_type: "",
  title: "",
  content: "",
  prescription_date: getTodayDate(),
  warnings: "",
  notes: "",
  created_at: "",
  updated_at: "",
};

const medicationFormData = {
  medication_name: "",
  presentation: "",
  active_ingredient: "",
  dosage: "",
  duration: "",
  administration_route: "",
  instructions: "",
};

export default function AddPrescription() {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets);
  const authenticatedUser = useSelector((state) => state.authenticatedUser);
  
  const [formData, setFormData] = useState(prescriptionFormData);
  const [medications, setMedications] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el buscador de mascotas
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPets, setFilteredPets] = useState([]);
  const dropdownRef = useRef(null);

  // Cargar mascotas al montar el componente
  useEffect(() => {
    dispatch(GetPets());
  }, [dispatch]);

  // Memoizar las mascotas aprobadas para evitar recálculos innecesarios
  const approvedPets = useMemo(() => {
    return pets.filter((pet) => pet.current_state === 1);
  }, [pets]);

  // Encontrar la mascota seleccionada actual
  const selectedPet = useMemo(() => {
    return approvedPets.find((pet) => pet.id === parseInt(formData.pet_id));
  }, [approvedPets, formData.pet_id]);

  useEffect(() => {
    // Si hay una mascota seleccionada, mostrar su nombre
    if (selectedPet) {
      setSearchTerm(`${capitalizeName(selectedPet.pet_name)} - ${capitalizeName(selectedPet.owner?.first_name)} ${capitalizeName(selectedPet.owner?.lastname)}`);
    }
  }, [selectedPet]);

  useEffect(() => {
    // Filtrar mascotas según el término de búsqueda
    if (searchTerm.trim() === "") {
      setFilteredPets([]);
    } else {
      const normalized = normalizeText(searchTerm);
      const filtered = approvedPets.filter((pet) => {
        const petName = normalizeText(pet.pet_name);
        const ownerName = normalizeText(`${pet.owner?.first_name} ${pet.owner?.lastname}`);
        return petName.includes(normalized) || ownerName.includes(normalized);
      });
      setFilteredPets(filtered);
    }
  }, [searchTerm, approvedPets]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePetSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handlePetSelect = (pet) => {
    setSearchTerm(`${capitalizeName(pet.pet_name)} - ${capitalizeName(pet.owner?.first_name)} ${capitalizeName(pet.owner?.lastname)}`);
    setFormData({ ...formData, pet_id: pet.id });
    setShowDropdown(false);
  };

  const handlePetSearchFocus = () => {
    setShowDropdown(true);
  };

  const addMedication = () => {
    setMedications([...medications, { ...medicationFormData, id: Date.now() }]);
  };

  const removeMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleMedicationChange = (id, field, value) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      const currentDateTime = getCurrentDateTime();

      // Validar que se haya seleccionado una mascota
      if (!formData.pet_id) {
        setErrorMessage("Debe seleccionar una mascota");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // Si es tipo 0 (Medicación/Receta), validar que haya al menos un medicamento
      if (formData.prescription_type === "0" && medications.length === 0) {
        setErrorMessage("Debe agregar al menos un medicamento para las recetas");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // Validar campos de medicamentos si hay alguno
      if (medications.length > 0) {
        for (const med of medications) {
          if (!med.medication_name || !med.dosage || !med.duration || !med.administration_route) {
            setErrorMessage("Complete todos los campos obligatorios de los medicamentos");
            setShowError(true);
            setIsLoading(false);
            return;
          }
        }
      }

      const formDataToSubmit = {
        ...formData,
        vet_id: authenticatedUser.id,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      };

      // Crear la prescripción
      const prescriptionResult = await dispatch(PostPrescription(formDataToSubmit));
      
      // Si es tipo 0 (Medicación/Receta), agregar los medicamentos
      if (formData.prescription_type === "0" && medications.length > 0) {
        const prescriptionId = prescriptionResult.payload.id;
        
        // Agregar cada medicamento
        for (const med of medications) {
          // Concatenar medication_name con presentation si existe
          const fullMedicationName = med.presentation 
            ? `${med.medication_name} (${med.presentation})`
            : med.medication_name;
          
          const medicationData = {
            prescription_id: prescriptionId,
            medication_name: fullMedicationName,
            active_ingredient: med.active_ingredient || "",
            dosage: med.dosage,
            duration: med.duration,
            administration_route: med.administration_route,
            instructions: med.instructions || "",
          };
          
          await dispatch(PostPrescriptionMedication(medicationData));
        }
      }

      // Recargar las listas
      await dispatch(GetPrescriptions());
      if (formData.prescription_type === "0") {
        await dispatch(GetPrescriptionMedications());
      }

      setShowSuccess(true);
      setFormData(prescriptionFormData);
      setMedications([]);
      setSearchTerm("");
      setShowModal(false);
      setIsLoading(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error al registrar la prescripción: ", error);
      setErrorMessage("Ha ocurrido un error al registrar la prescripción");
      setShowError(true);
      setIsLoading(false);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(prescriptionFormData);
    setMedications([]);
    setSearchTerm("");
    setShowError(false);
  };

  const handleShowModal = () => setShowModal(true);

  const quickWarnings = {
    bloodTest: "Indicaciones de ayuno para los ANÁLISIS: Traerlo con (mínimo) 10hs de ayuno de comida. Dejarle agua a disposición hasta el momento de la visita. Tratar que no orine desde dos horas antes de venir (para toma de muestra de orina). Venir acompañado para poder sujetar a su mascota en el momento de la extracción",
    ultrasound: "Para la ECOGRAFÍA: Llevarlo con (mínimo) 10hs de ayuno de comida. Dejarle agua a disposición hasta el momento de la visita. Hacerlo caminar 2 ó 4 horas antes del estudio, para que defeque. Tratar (en lo posible) que no orine desde mínimo 1 hora antes del estudio.",
    urinaryCortisol: "Toma de muestra de orina para determinación de cortisol urinario de 24hs: Tomar 3 a 5 muestras de orina, desde la 2da micción del primer día; más una muestra de la 1er micción del segundo día. Juntar todas las muestras en un mismo frasco limpio y seco y conservar siempre en heladera, hasta llevar a la veterinaria (entregar dentro de las 24hs de haber tomado la última muestra).",
    stoolTest: "Para análisis coproparasitológico seriado: juntar una muestra del tamaño de una almendra, de CADA deposición durante 5 días CONSECUTIVOS. Poner todas las muestras en el MISMO frasco con FORMOL. Guardar el frasco en lugar fresco y al abrigo de la luz hasta el momento de entregarlo para el análisis."
  };

  const handleQuickWarning = (warningType) => {
    const currentContent = formData.content || "";
    const newContent = quickWarnings[warningType];
    
    // Si ya hay contenido, agregar con salto de línea
    const updatedContent = currentContent.trim() 
      ? `${currentContent}\n\n${newContent}` 
      : newContent;
    
    setFormData({ ...formData, content: updatedContent });
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleShowModal}>
        <FaPlus /> Agregar Indicación
      </button>

      <br />

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Indicación Médica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showError && (
            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
              {errorMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Buscador de Mascota */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <Form.Group controlId="pet_search">
                <Form.Label>
                  <FaPaw /> Mascota *
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handlePetSearchChange}
                    onFocus={handlePetSearchFocus}
                    placeholder="Buscar mascota por nombre o tutor..."
                    style={{ paddingRight: "35px" }}
                    required
                  />
                  <FaSearch
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <Form.Text className="text-muted">
                  Escribe el nombre de la mascota o su tutor/a
                </Form.Text>
              </Form.Group>

              {showDropdown && searchTerm.trim() !== "" && filteredPets.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: "white",
                    border: "1px solid #ced4da",
                    borderRadius: "0.25rem",
                    zIndex: 1050,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredPets.map((pet) => (
                    <div
                      key={pet.id}
                      onClick={() => handlePetSelect(pet)}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor:
                          formData.pet_id === pet.id ? "#e7f3ff" : "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                      onMouseEnter={(e) => {
                        if (formData.pet_id !== pet.id) {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.pet_id !== pet.id) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      <img
                        src={pet.profile_picture_url || "https://via.placeholder.com/40"}
                        alt={pet.pet_name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {capitalizeName(pet.pet_name)}
                        </div>
                        <small style={{ color: "#6c757d" }}>
                          Tutor/a: {capitalizeName(pet.owner?.first_name)}{" "}
                          {capitalizeName(pet.owner?.lastname)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <br />

            <Form.Group controlId="prescription_type">
              <Form.Label>
                <FaListAlt /> Tipo de Indicación *
              </Form.Label>
              <Form.Control
                as="select"
                name="prescription_type"
                value={formData.prescription_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="0">Medicación/Receta</option>
                <option value="1">Solicitud de Estudios</option>
                <option value="2">Indicaciones</option>
              </Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="title">
              <Form.Label>
                <FaHeading /> Título
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Receta para tratamiento de dolor"
              />
              <Form.Text className="text-muted">
                Campo opcional. Si se deja vacío se usará el tipo de indicación como título
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="prescription_date">
              <Form.Label>
                <FaCalendarDay /> Fecha *
              </Form.Label>
              <Form.Control
                type="date"
                name="prescription_date"
                value={formData.prescription_date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <br />

            {/* Ocultar contenido si es tipo 0 (Medicación/Receta) */}
            {formData.prescription_type !== "0" && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <Form.Label style={{ margin: 0 }}>
                    <FaFileAlt /> Contenido
                  </Form.Label>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Análisis de sangre</Tooltip>}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleQuickWarning("bloodTest")}
                        style={{ padding: "4px 8px" }}
                      >
                        <FaTint />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Ecografía</Tooltip>}
                    >
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleQuickWarning("ultrasound")}
                        style={{ padding: "4px 8px" }}
                      >
                        <FaHeartbeat />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Cortisol urinario</Tooltip>}
                    >
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleQuickWarning("urinaryCortisol")}
                        style={{ padding: "4px 8px" }}
                      >
                        <FaVial />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Coproparasitológico</Tooltip>}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleQuickWarning("stoolTest")}
                        style={{ padding: "4px 8px" }}
                      >
                        <FaMicroscope />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>

                <Form.Group controlId="content">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Descripción detallada de la indicación"
                  />
                  <Form.Text className="text-muted">
                    Campo opcional. Use los botones rápidos para agregar texto predefinido
                  </Form.Text>
                </Form.Group>
                <br />
              </>
            )}

            <Form.Group controlId="warnings">
              <Form.Label>
                <FaExclamationTriangle /> Advertencias
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="warnings"
                value={formData.warnings}
                onChange={handleInputChange}
                placeholder="Advertencias o precauciones especiales"
              />
              <Form.Text className="text-muted">
                Campo opcional
              </Form.Text>
            </Form.Group>
            <br />

            <Form.Group controlId="notes">
              <Form.Label>
                <FaStickyNote /> Notas Internas
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ej: Citar a control después de 10 días, seguimiento de evolución, etc."
                maxLength={255}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '5px'
              }}>
                <Form.Text className="text-muted">
                  Notas internas para uso del veterinario. No aparecerán en el documento impreso.
                </Form.Text>
                <Form.Text className="text-muted" style={{ fontWeight: '500' }}>
                  {formData.notes.length}/255
                </Form.Text>
              </div>
            </Form.Group>
            <br />

            {/* Sección de Medicamentos - Solo si es tipo 0 */}
            {formData.prescription_type === "0" && (
              <>
                <hr />
                <h5>
                  <FaPills /> Medicamentos de la Receta
                </h5>
                <p className="text-muted">
                  Agregue los medicamentos que se recetan en esta indicación
                </p>

                {medications.map((med, index) => (
                  <div
                    key={med.id}
                    style={{
                      border: "1px solid #dee2e6",
                      borderRadius: "0.25rem",
                      padding: "15px",
                      marginBottom: "15px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h6>Medicamento {index + 1}</h6>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                      >
                        <FaTrash /> Eliminar
                      </Button>
                    </div>

                    <Form.Group controlId={`medication_name_${med.id}`}>
                      <Form.Label>
                        <FaPills /> Nombre del Medicamento *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={med.medication_name}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "medication_name",
                            e.target.value
                          )
                        }
                        placeholder="Ej: Carprofeno"
                        required
                      />
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`presentation_${med.id}`}>
                      <Form.Label>
                        <FaBoxes /> Presentación
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={med.presentation}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "presentation",
                            e.target.value
                          )
                        }
                        placeholder="Ej: Comprimidos, Jarabe, Inyectable"
                      />
                      <Form.Text className="text-muted">
                        Campo opcional. Se mostrará entre paréntesis junto al nombre
                      </Form.Text>
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`active_ingredient_${med.id}`}>
                      <Form.Label>
                        <FaDna /> Principio Activo
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={med.active_ingredient}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "active_ingredient",
                            e.target.value
                          )
                        }
                        placeholder="Ej: Carprofeno"
                      />
                      <Form.Text className="text-muted">
                        Campo opcional
                      </Form.Text>
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`dosage_${med.id}`}>
                      <Form.Label>
                        <FaSyringe /> Dosificación *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(med.id, "dosage", e.target.value)
                        }
                        placeholder="Ej: 1 comprimido cada 12 horas"
                        required
                      />
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`duration_${med.id}`}>
                      <Form.Label>
                        <FaClock /> Duración *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={med.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="Ej: 7 días"
                        required
                      />
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`administration_route_${med.id}`}>
                      <Form.Label>
                        <FaPrescription /> Vía de Administración *
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={med.administration_route}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "administration_route",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="0">Oral</option>
                        <option value="1">Tópico</option>
                        <option value="2">Inyectable subcutáneo</option>
                        <option value="3">Inyectable intramuscular</option>
                        <option value="4">Intravenoso</option>
                        <option value="5">Oftálmico</option>
                        <option value="6">Ótico</option>
                        <option value="7">Otro</option>
                      </Form.Control>
                    </Form.Group>
                    <br />

                    <Form.Group controlId={`instructions_${med.id}`}>
                      <Form.Label>
                        <FaFileAlt /> Instrucciones
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={med.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="Instrucciones adicionales para la administración"
                      />
                      <Form.Text className="text-muted">
                        Campo opcional
                      </Form.Text>
                    </Form.Group>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  onClick={addMedication}
                  className="mb-3"
                >
                  <FaPlus /> Agregar Medicamento
                </Button>
                <br />
              </>
            )}

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Registrando...
                  </>
                ) : (
                  <>
                    <FaPlus /> Registrar Indicación
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {showSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowSuccess(false)}
          dismissible
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          ¡Indicación registrada exitosamente!
        </Alert>
      )}
    </>
  );
}
