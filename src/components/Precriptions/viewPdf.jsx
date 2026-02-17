import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import jsPDF from "jspdf";
import {
  formatDate,
  getSpeciesName,
  getSexName,
  getPrescriptionType,
  getAdministrationRoute,
} from "../../utils";
import firmaDigital from "../../assets/firma_digital_betina.jpg";
import logoVeterinaria from "../../assets/pictures/Logo_white_background.jpg"; // Agregar el logo
import { useSelector } from "react-redux";

export default function ViewPdf({ prescription }) {
  const pets = useSelector((state) => state.pets);
  const prescriptionMedications = useSelector(
    (state) => state.prescriptionMedications
  );
  const vetRecords = useSelector((state) => state.vetRecords);

  // Buscar el pet completo con owner
  const pet = pets.find(p => p.id === prescription.pet_id);
  const owner = pet?.owner;

  // Función para obtener el último peso registrado
  const getLastWeight = () => {
    const petVetRecords = vetRecords.filter(
      (record) => parseInt(record.pet_id) === parseInt(prescription.pet_id)
    );
    const recordsWithWeight = petVetRecords.filter((record) => record.weight);
    
    if (recordsWithWeight.length === 0) {
      return null;
    }
    
    return recordsWithWeight[0]; // Ya viene ordenado por fecha descendente
  };

  // Filtrar medicamentos de esta prescripción
  const medications = prescriptionMedications.filter(
    (med) => med.prescription_id === prescription.id
  );

  // No mostrar el botón si es tipo 0 (Receta) y no hay medicamentos
  if (prescription.prescription_type === 0 && medications.length === 0) {
    return null;
  }

  const generatePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Configuración de márgenes
    const marginLeft = 20;
    const marginRight = 20;
    const maxWidth = pageWidth - marginLeft - marginRight;
    let yPosition = 20;

    // Fondo blanco
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Extraer solo la fecha del datetime
    const dateOnly = prescription.created_at.split(" ")[0];

    // TÍTULO O TIPO DE INDICACIÓN
    const displayTitle =
      prescription.title && prescription.title.trim() !== ""
        ? prescription.title
        : getPrescriptionType(prescription.prescription_type);

    // ENCABEZADO CON LOGO
    // Sin fondo de color
    
    // Cargar y agregar el logo
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoVeterinaria;

    await new Promise((resolve) => {
      logoImg.onload = function () {
        // Logo en la esquina superior derecha con proporciones correctas
        // Dimensiones originales: 2266x1468, relación ≈ 1.54:1
        const logoWidth = 40;
        const logoHeight = logoWidth / 1.543; // Mantener proporción
        const logoX = pageWidth - marginRight - logoWidth;
        pdf.addImage(logoImg, "PNG", logoX, 5, logoWidth, logoHeight);
        resolve();
      };
      logoImg.onerror = function () {
        console.log("No se pudo cargar el logo");
        resolve();
      };
    });

    // Subtítulo del tipo de documento
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(displayTitle, pageWidth / 2, 20, { align: "center" });

    yPosition = 35;

    // Restablecer color de texto a negro
    pdf.setTextColor(0, 0, 0);

    // Número de solicitud y fecha en un recuadro
    pdf.setFillColor(240, 240, 240);
    pdf.rect(marginLeft, yPosition, maxWidth, 10, "F");
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Solicitud Nro: ${prescription.id}`, marginLeft + 2, yPosition + 6);
    pdf.text(
      `Fecha: ${formatDate(dateOnly)}`,
      pageWidth - marginRight - 2,
      yPosition + 6,
      { align: "right" }
    );
    yPosition += 15;

    // INFORMACIÓN DE LA MASCOTA sin fondo ni borde
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(23, 57, 128);
    pdf.text("DATOS DE LA MASCOTA", marginLeft, yPosition);
    yPosition += 7;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);

    const petName = prescription.pet?.pet_name || "No especificado";
    const species =
      prescription.pet?.species !== undefined
        ? getSpeciesName(prescription.pet.species)
        : "No especificado";
    const sex =
      prescription.pet?.sex !== undefined
        ? getSexName(prescription.pet.sex)
        : "No especificado";
    const breed = prescription.pet?.breed || "No especificada";
    const birthDate = prescription.pet?.birth_date 
      ? formatDate(prescription.pet.birth_date) 
      : "No especificada";

    // Primera columna - Datos de la mascota
    pdf.setFont("helvetica", "bold");
    pdf.text("Nombre:", marginLeft, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(petName, marginLeft + pdf.getTextWidth("Nombre: "), yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Especie:", marginLeft, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(species, marginLeft + pdf.getTextWidth("Especie: "), yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Sexo:", marginLeft, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(sex, marginLeft + pdf.getTextWidth("Sexo: "), yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Fecha de Nacimiento:", marginLeft, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(birthDate, marginLeft + pdf.getTextWidth("Fecha de Nacimiento:   "), yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Raza:", marginLeft, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(breed, marginLeft + pdf.getTextWidth("Raza: "), yPosition);

    // Segunda columna - Datos del tutor/a (al lado derecho)
    if (owner) {
      const columnX = pageWidth / 2 + 10;
      let tutorY = yPosition - 20; // Ajustado para compensar la nueva línea

      pdf.setFont("helvetica", "bold");
      pdf.text("Tutor/a:", columnX, tutorY);
      pdf.setFont("helvetica", "normal");
      const ownerName = `${owner.first_name} ${owner.lastname}`;
      pdf.text(ownerName, columnX + pdf.getTextWidth("Tutor/a:   "), tutorY);
      tutorY += 5;
      
      if (owner.phone) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Teléfono:", columnX, tutorY);
        pdf.setFont("helvetica", "normal");
        pdf.text(owner.phone, columnX + pdf.getTextWidth("Teléfono:   "), tutorY);
        tutorY += 5;
      }

      // Agregar último peso - siempre mostrar
      const lastWeight = getLastWeight();
      pdf.setFont("helvetica", "bold");
      pdf.text("Último Peso:", columnX, tutorY);
      pdf.setFont("helvetica", "normal");
      const weightText = lastWeight 
        ? `${lastWeight.weight} kg (${formatDate(lastWeight.event_date)})` 
        : "Sin registros";
      pdf.text(weightText, columnX + pdf.getTextWidth("Último Peso:   "), tutorY);
    }

    yPosition += 7;

    // CONTENIDO (si no es null)
    if (prescription.content && prescription.content.trim() !== "") {
      // Título de sección
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(23, 57, 128);
      pdf.text("INDICACIONES:", marginLeft, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);

      const contentLines = pdf.splitTextToSize(prescription.content, maxWidth);

      contentLines.forEach((line) => {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageWidth, pageHeight, "F");
          yPosition = 30;
        }

        pdf.text(line, marginLeft, yPosition);
        yPosition += 5;
      });

      yPosition += 8;
    }

    // MEDICAMENTOS INDICADOS (solo si el tipo es 0 - Medicación/Receta)
    if (prescription.prescription_type === 0) {
      // Filtrar medicamentos de esta prescripción
      const medications = prescriptionMedications.filter(
        (med) => med.prescription_id === prescription.id
      );

      if (medications.length > 0) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageWidth, pageHeight, "F");
          yPosition = 30;
        }

        // Título de sección
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(23, 57, 128);
        pdf.text("MEDICAMENTOS INDICADOS:", marginLeft, yPosition);
        yPosition += 8;
        pdf.setTextColor(0, 0, 0);

        // Mostrar cada medicamento
        medications.forEach((medication, index) => {
          // Verificar si hay espacio suficiente para el medicamento
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pageWidth, pageHeight, "F");
            yPosition = 30;
          }

          // Nombre del medicamento como título con fondo
          pdf.setFillColor(250, 250, 250);
          pdf.rect(marginLeft, yPosition - 4, maxWidth, 7, "F");
          
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          const medicationName = medication.medication_name || "No especificado";
          pdf.text(medicationName, marginLeft, yPosition);
          yPosition += 6;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");

          // Principio activo
          const activeIngredient = medication.active_ingredient || "No especificado";
          pdf.text(activeIngredient, marginLeft, yPosition);
          yPosition += 5;

          // Dosificación
          pdf.setFont("helvetica", "bold");
          pdf.text("Dosis:", marginLeft, yPosition);
          pdf.setFont("helvetica", "normal");
          const dosageText = medication.dosage || "No especificado";
          const dosageLines = pdf.splitTextToSize(
            dosageText,
            maxWidth - pdf.getTextWidth("Dosis:  ")
          );
          let dosageX = marginLeft + pdf.getTextWidth("Dosis:  ");
          dosageLines.forEach((line, idx) => {
            if (yPosition > pageHeight - 80) {
              pdf.addPage();
              pdf.setFillColor(255, 255, 255);
              pdf.rect(0, 0, pageWidth, pageHeight, "F");
              yPosition = 30;
            }
            if (idx === 0) {
              pdf.text(line, dosageX, yPosition);
            } else {
              pdf.text(line, marginLeft, yPosition);
            }
            yPosition += 5;
          });

          // Duración
          pdf.setFont("helvetica", "bold");
          pdf.text("Duración:", marginLeft, yPosition);
          pdf.setFont("helvetica", "normal");
          const durationText = medication.duration || "No especificado";
          const durationLines = pdf.splitTextToSize(
            durationText,
            maxWidth - pdf.getTextWidth("Duración:  ")
          );
          let durationX = marginLeft + pdf.getTextWidth("Duración:  ");
          durationLines.forEach((line, idx) => {
            if (yPosition > pageHeight - 80) {
              pdf.addPage();
              pdf.setFillColor(255, 255, 255);
              pdf.rect(0, 0, pageWidth, pageHeight, "F");
              yPosition = 30;
            }
            if (idx === 0) {
              pdf.text(line, durationX, yPosition);
            } else {
              pdf.text(line, marginLeft, yPosition);
            }
            yPosition += 5;
          });

          // Vía de administración
          const route =
            medication.administration_route !== undefined
              ? getAdministrationRoute(medication.administration_route)
              : "No especificado";
          pdf.setFont("helvetica", "bold");
          pdf.text("Vía de administración:", marginLeft, yPosition);
          pdf.setFont("helvetica", "normal");
          pdf.text(route, marginLeft + pdf.getTextWidth("Vía de administración:   "), yPosition);
          yPosition += 5;

          // Instrucciones
          if (
            medication.instructions &&
            medication.instructions.trim() !== ""
          ) {
            pdf.setFont("helvetica", "bold");
            pdf.text("Instrucciones:", marginLeft, yPosition);
            pdf.setFont("helvetica", "normal");
            const instructionsLines = pdf.splitTextToSize(
              medication.instructions,
              maxWidth - pdf.getTextWidth("Instrucciones:   ")
            );
            let instructionsX = marginLeft + pdf.getTextWidth("Instrucciones:   ");
            instructionsLines.forEach((line, idx) => {
              if (yPosition > pageHeight - 80) {
                pdf.addPage();
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pageWidth, pageHeight, "F");
                yPosition = 30;
              }
              if (idx === 0) {
                pdf.text(line, instructionsX, yPosition);
              } else {
                pdf.text(line, marginLeft, yPosition);
              }
              yPosition += 5;
            });
          }

          // Separador entre medicamentos
          if (index < medications.length - 1) {
            yPosition += 4;
            pdf.setDrawColor(220, 220, 220);
            pdf.setLineWidth(0.2);
            pdf.line(
              marginLeft,
              yPosition,
              pageWidth - marginRight,
              yPosition
            );
            yPosition += 8;
          } else {
            yPosition += 8;
          }
        });
      }
    }

    // ADVERTENCIAS (mostrar siempre que existan)
    if (
      prescription.warnings &&
      prescription.warnings.trim() !== ""
    ) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
        yPosition = 30;
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(220, 53, 69); // Rojo para advertencias
      pdf.text("ADVERTENCIAS:", marginLeft, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);

      const warningsLines = pdf.splitTextToSize(
        prescription.warnings,
        maxWidth
      );

      warningsLines.forEach((line) => {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageWidth, pageHeight, "F");
          yPosition = 30;
        }

        pdf.text(line, marginLeft, yPosition);
        yPosition += 5;
      });

      yPosition += 8;
    }

    // FIRMA Y DATOS DEL VETERINARIO
    // Asegurar que haya espacio suficiente para la firma
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      yPosition = 30;
    } else {
      yPosition = pageHeight - 70; // Posicionar la firma en la parte inferior
    }

    // Cargar y agregar la imagen de la firma
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      // Agregar imagen de firma (alineada a la derecha)
      const imgWidth = 50;
      const imgHeight = 25;
      const imgX = pageWidth - marginRight - imgWidth;

      pdf.addImage(img, "JPEG", imgX, yPosition, imgWidth, imgHeight);

      // Información del veterinario debajo de la firma (alineado a la derecha)
      yPosition += imgHeight + 5;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const textX = pageWidth - marginRight;
      pdf.text("Betina van Muylem", textX, yPosition, { align: "right" });
      yPosition += 5;

      pdf.setFont("helvetica", "normal");
      pdf.text("Médica Veterinaria", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("M.P. 2502", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("Teléfono (WhatsApp)", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("+5493512472384", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("Córdoba, Argentina", textX, yPosition, { align: "right" });

      // Abrir el PDF en una nueva pestaña
      const pdfData = pdf.output('dataurlstring');
      window.open(pdfData, '_blank');
    };

    img.onerror = function () {
      console.log(
        "No se pudo cargar la imagen de la firma, continuando sin ella"
      );

      // Continuar sin la imagen
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const textX = pageWidth - marginRight;
      pdf.text("Betina van Muylem", textX, yPosition, { align: "right" });
      yPosition += 5;

      pdf.setFont("helvetica", "normal");
      pdf.text("Médica Veterinaria", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("M.P. 2502", textX, yPosition, { align: "right" });
      yPosition += 5;
      pdf.text("Teléfono (WhatsApp) +5493512472384", textX, yPosition, {
        align: "right",
      });
      yPosition += 5;
      pdf.text("Córdoba, Argentina", textX, yPosition, { align: "right" });

      // Abrir el PDF en una nueva pestaña
      const pdfData = pdf.output('dataurlstring');
      window.open(pdfData, '_blank');
    };

    // Cargar la imagen
    img.src = firmaDigital;
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-pdf-${prescription.id}`}>Visualizar PDF</Tooltip>
      }
    >
      <Button
        className="button"
        variant="danger"
        onClick={generatePDF}
        style={{ marginRight: "2px" }}
      >
        <FaEye />
      </Button>
    </OverlayTrigger>
  );
}
