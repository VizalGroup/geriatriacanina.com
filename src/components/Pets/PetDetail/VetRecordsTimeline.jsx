import { useState } from "react";
import { FaStethoscope, FaUserMd, FaCalendarAlt, FaWeight, FaNotesMedical, FaClock, FaEdit } from "react-icons/fa";
import { formatDateTime } from "../../../utils";
import EditVetRecord from "./EditVetRecord";
import RemoveVetRecord from "./RemoveVetRecord";

export default function VetRecordsTimeline({ vetRecords }) {
  const [expandedRecords, setExpandedRecords] = useState(new Set());

  const toggleExpand = (recordId) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "No especificado";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (vetRecords.length === 0) {
    return (
      <p className="text-center" style={{ color: "#666", marginTop: "20px" }}>
        No hay registros clínicos para esta mascota.
      </p>
    );
  }

  return (
    <div className="timeline-container">
      {vetRecords.map((record, index) => {
        const isExpanded = expandedRecords.has(record.id);
        const isLast = index === vetRecords.length - 1;

        return (
          <div key={record.id} className="timeline-item">
            {/* Línea vertical */}
            {!isLast && <div className="timeline-line"></div>}

            {/* Círculo del timeline */}
            <div className="timeline-dot"></div>

            {/* Contenido del registro */}
            <div
              className="timeline-content"
              style={{ cursor: "pointer" }}
            >
              {/* Resumen */}
              <div className="timeline-header" onClick={() => toggleExpand(record.id)}>
                <h6 style={{ color: "#103585", fontWeight: "700", marginBottom: "10px", fontSize: "1.1rem" }}>
                  <FaStethoscope color="#2858BF" /> {record.consultation_reason}
                </h6>
              </div>

              <div className="timeline-summary" onClick={() => toggleExpand(record.id)}>
                <p style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
                  <FaUserMd color="#2858BF" /> <strong>Atendido por:</strong>{" "}
                  {record.user ? `Dr/a. ${record.user.first_name} ${record.user.lastname}` : "No especificado"}
                </p>

                <p style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
                  <FaCalendarAlt color="#2858BF" /> <strong>Fecha:</strong>{" "}
                  {formatDateTime(record.event_date)}
                </p>

                <p style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
                  <FaNotesMedical color="#2858BF" /> <strong>Diagnóstico:</strong>{" "}
                  {isExpanded ? record.diagnosis || "No especificado" : truncateText(record.diagnosis, 20)}
                </p>

                {record.weight && (
                  <p style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
                    <FaWeight color="#2858BF" /> <strong>Peso:</strong> {record.weight} kg
                  </p>
                )}
              </div>

              {/* Contenido expandido */}
              {isExpanded && (
                <div className="timeline-expanded" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "2px solid #e0e0e0" }}>
                  {record.anamnesis && (
                    <div style={{ marginBottom: "15px" }}>
                      <p style={{ fontWeight: "600", color: "#103585", marginBottom: "8px" }}>
                        <FaNotesMedical color="#2858BF" /> Anamnesis:
                      </p>
                      <p style={{ fontSize: "0.95rem", color: "#555", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                        {record.anamnesis}
                      </p>
                    </div>
                  )}

                  {record.diagnosis && (
                    <div style={{ marginBottom: "15px" }}>
                      <p style={{ fontWeight: "600", color: "#103585", marginBottom: "8px" }}>
                        <FaNotesMedical color="#2858BF" /> Diagnóstico completo:
                      </p>
                      <p style={{ fontSize: "0.95rem", color: "#555", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                        {record.diagnosis}
                      </p>
                    </div>
                  )}

                  {/* Información del sistema con botones editar y eliminar */}
                  <div
                    style={{
                      backgroundColor: "rgba(40, 88, 191, 0.05)",
                      padding: "12px",
                      borderRadius: "8px",
                      marginTop: "15px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "5px" }}>
                          <FaClock color="#6c757d" size={12} /> <strong>Registro creado:</strong>{" "}
                          {formatDateTime(record.created_at)}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0" }}>
                          <FaEdit color="#6c757d" size={12} /> <strong>Última actualización:</strong>{" "}
                          {formatDateTime(record.updated_at)}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <EditVetRecord vetRecord={record} />
                        <RemoveVetRecord vetRecord={record} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p 
                onClick={() => toggleExpand(record.id)}
                style={{ marginTop: "10px", fontSize: "0.85rem", color: "#2858BF", textAlign: "center", fontStyle: "italic" }}
              >
                {isExpanded ? "Click para colapsar" : "Click para ver más detalles"}
              </p>
            </div>
          </div>
        );
      })}

      {/* <style jsx>{`
        .timeline-container {
          position: relative;
          padding: 20px 0;
        }

        .timeline-item {
          position: relative;
          padding-left: 50px;
          margin-bottom: 30px;
        }

        .timeline-line {
          position: absolute;
          left: 19px;
          top: 40px;
          bottom: -30px;
          width: 3px;
          background: linear-gradient(to bottom, #2858BF, #103585);
        }

        .timeline-dot {
          position: absolute;
          left: 10px;
          top: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2858BF;
          border: 4px solid #ffffff;
          box-shadow: 0 0 0 4px rgba(40, 88, 191, 0.2);
          z-index: 1;
        }

        .timeline-content {
          background: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .timeline-content:hover {
          border-color: #2858BF;
          box-shadow: 0 6px 20px rgba(40, 88, 191, 0.15);
          transform: translateX(5px);
        }

        .timeline-header {
          margin-bottom: 12px;
        }

        .timeline-summary p {
          color: #555;
        }

        .timeline-expanded {
          animation: expandAnimation 0.3s ease-out;
        }

        @keyframes expandAnimation {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }

        @media (max-width: 768px) {
          .timeline-item {
            padding-left: 40px;
          }

          .timeline-dot {
            left: 5px;
            width: 18px;
            height: 18px;
          }

          .timeline-line {
            left: 14px;
          }
        }
      `}</style> */}
    </div>
  );
}
