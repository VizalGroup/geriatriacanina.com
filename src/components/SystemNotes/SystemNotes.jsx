import NavBar from "../NavBar";
import BackButton from "../BackButton";
import { FaStickyNote } from "react-icons/fa";

export default function SystemNotes() {
  document.title = "Notas del Sistema - Geriatría Canina";

  return (
    <>
      <NavBar />
      <div className="watermark-background" style={{ marginTop: "100px" }}>
        <div className="container system-notes-container">
          <BackButton />
          
          <div className="text-center mb-4">
            <h1 className="system-notes-main-title">
              <FaStickyNote /> Notas del Sistema {import.meta.env.VITE_APP_VERSION}
            </h1>
            <p className="system-notes-subtitle">
              Historial de actualizaciones y mejoras del sistema de gestión veterinaria
            </p>
          </div>

          {/* Sección de Actualizaciones */}
          <section className="system-notes-section">
            <h2 className="system-notes-title">Registro de Actualizaciones</h2>
            <ul className="notes-timeline">
              <li className="timeline-item">
                <span className="timeline-date">23 de Enero de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Visualización en la información general del paciente el último peso de la mascota y su fecha correspondiente
                  </li>
                  <li className="update-item">
                    Corrección en la visualización del botón de indicaciones de medicamentos para el tutor
                  </li>
                </ul>
              </li>

              <li className="timeline-item">
                <span className="timeline-date">9 de Enero de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Campo de teléfono ampliado a 13 caracteres para todos los formularios de usuarios (registro, creación y edición)
                  </li>
                  <li className="update-item">
                    Corrección del error al eliminar indicaciones médicas de tipo medicación: ahora se eliminan primero todos los medicamentos asociados antes de eliminar la indicación
                  </li>
                  <li className="update-item">
                    Botones rápidos para agregar contenido predefinido en indicaciones médicas: Análisis de sangre, Ecografía, Cortisol urinario y Coproparasitológico
                  </li>
                  <li className="update-item">
                    Incremento del tamaño del campo de contenido en indicaciones médicas de 3 a 6 filas para mejor visualización
                  </li>
                  <li className="update-item">
                    Eliminación de la leyenda automática de ayuno para análisis en PDFs de tipo "Solicitud de Estudios"
                  </li>
                </ul>
              </li>

              <li className="timeline-item">
                <span className="timeline-date">27 de Diciembre de 2025</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Mejoras en formularios de usuarios: campos separados de dirección (calle, número, ciudad, provincia, país) en AddUser.
                  </li>
                  <li className="update-item">
                    Campo de presentación en medicamentos (Comprimidos, Jarabe, Inyectable, etc.) que se guarda entre paréntesis junto al nombre del medicamento
                  </li>
                  <li className="update-item">
                    Parseo automático de presentación al editar medicamentos existentes
                  </li>
                  <li className="update-item">
                    Agregado de fecha de nacimiento en PDF de indicaciones médicas
                  </li>
                  <li className="update-item">
                    Corrección del logo con fondo blanco en PDFs de indicaciones médicas
                  </li>
                  <li className="update-item">
                    Agregado de datos del tutor/a (nombre y teléfono) en los PDFs de indicaciones médicas
                  </li>
                </ul>
              </li>

              <li className="timeline-item">
                <span className="timeline-date">26 de Diciembre de 2025</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Módulo de indicaciones médicas para generar PDF con recetas, medicaciones, indicaciones y solicitudes de estudios
                  </li>
                  <li className="update-item">
                    Integración del módulo de indicaciones médicas en la vista detallada de las mascotas
                  </li>
                </ul>
              </li>

              <li className="timeline-item">
                <span className="timeline-date">18 de Diciembre de 2025</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Formulario externo para registro de mascotas y usuarios
                  </li>
                  <li className="update-item">
                    Sistema de cambio de contraseña por email
                  </li>
                  <li className="update-item">
                    Gestión de archivos adjuntos
                  </li>
                  <li className="update-item">
                    Funcionalidad para cambiar credenciales de usuario
                  </li>
                </ul>
              </li>

              <li className="timeline-item">
                <span className="timeline-date">12 de Diciembre de 2025</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Sistema de Login y autenticación de usuarios
                  </li>
                  <li className="update-item">
                    Módulo de gestión de usuarios
                  </li>
                  <li className="update-item">
                    Módulo de gestión de mascotas
                  </li>
                  <li className="update-item">
                    Vista detallada de la mascota
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Sección de Tecnologías */}
          <section className="system-notes-section">
            <h2 className="system-notes-title">Stack Tecnológico</h2>
            <ul className="timeline-updates">
              <li className="update-item">
                <strong>Frontend:</strong> React.js con React Router para navegación
              </li>
              <li className="update-item">
                <strong>Estado Global:</strong> Redux para gestión centralizada del estado
              </li>
              <li className="update-item">
                <strong>UI Framework:</strong> React Bootstrap para componentes de interfaz
              </li>
              <li className="update-item">
                <strong>Iconos:</strong> React Icons (Font Awesome)
              </li>
              <li className="update-item">
                <strong>Generación de PDF:</strong> jsPDF para exportación de documentos
              </li>
              <li className="update-item">
                <strong>Estilos:</strong> CSS personalizado con sistema de colores de marca
              </li>
              <li className="update-item">
                <strong>Servidor:</strong> PHP
              </li>
              <li className="update-item">
                <strong>Base de Datos:</strong> MySQL
              </li>
              <li className="update-item">
                <strong>Hosting:</strong> Hostinger
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
