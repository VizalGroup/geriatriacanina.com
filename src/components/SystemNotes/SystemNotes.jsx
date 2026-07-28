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
                <span className="timeline-date">28 de Julio de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Corrección en los PDF de indicaciones: el peso que se muestra ahora es siempre el último registrado en la historia clínica. Antes, en algunos casos, aparecía el peso anterior
                  </li>
                  <li className="update-item">
                    En los PDF de indicaciones, la franja gris superior ahora muestra el título de la indicación en negrita junto a la fecha. Se quitó el número de solicitud
                  </li>
                  <li className="update-item">
                    En los PDF de indicaciones, el título de la indicación se agrandó un 30% para que se lea con mayor claridad al abrir o imprimir el documento
                  </li>
                  <li className="update-item">
                    En los PDF de indicaciones, al lado de la fecha de nacimiento de la mascota ahora se muestra su edad en años. La edad se calcula según la fecha del documento, por lo que en las indicaciones antiguas se sigue viendo la edad que tenía la mascota en ese momento
                  </li>
                  <li className="update-item">
                    En los PDF de indicaciones, los títulos "Datos de la mascota" y "Medicamentos indicados" se muestran en azul, en negrita y del mismo tamaño que el texto que aparece debajo. Se aplicó el mismo criterio a los títulos "Indicaciones" y "Advertencias" para mantener el mismo estilo en todo el documento
                  </li>
                  <li className="update-item">
                    En el listado de indicaciones, el buscador ahora permite buscar por mascota o por tutor/a. Se quitaron las búsquedas por veterinario/a y por notas internas
                  </li>
                  <li className="update-item">
                    En el listado de indicaciones se agregó un filtro de fechas "Desde" y "Hasta" con calendario, para no tener que escribir la fecha a mano. Se puede combinar con el buscador de mascota o tutor/a y limpiar con un botón
                  </li>
                  <li className="update-item">
                    Se agregó el campo "Barrio" a los usuarios. Se pide al registrar un usuario nuevo, tanto desde el sistema como desde el enlace público de registro, y se puede completar o corregir desde la edición del usuario. El barrio se ve en la tabla de usuarios debajo de la dirección y también se puede buscar por él desde el buscador. Los usuarios cargados antes de esta actualización aparecen con el barrio vacío hasta que se complete
                  </li>
                  <li className="update-item">
                    En el formulario de registro de una nueva mascota, los campos se reordenaron para completarlos con mayor comodidad: Nombre, Fecha de nacimiento, Especie, Raza, Sexo, Fecha de castración y Tutor/a. El cambio se aplicó tanto al formulario de la veterinaria como al que utilizan los tutores desde su panel
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">1 de Julio de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Al editar una evolución clínica, la etiqueta "Motivo de Consulta" fue reemplazada por "Tipo de consulta" para que coincida con el formulario de registro de evoluciones
                  </li>
                  <li className="update-item">
                    En el formulario de edición de evoluciones, la etiqueta "Anamnesis" ahora se muestra como "Detalle de consulta"
                  </li>
                  <li className="update-item">
                    En la visualización de las evoluciones clínicas, la palabra "Anamnesis" fue cambiada por "Detalle de consulta"
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">25 de Junio de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Configuración de permisos para el rol Veterinario/a: ya no puede ver ni utilizar los botones de acciones (perfil de mascota, WhatsApp, editar y eliminar) en la tabla de usuarios
                  </li>
                  <li className="update-item">
                    El rol Veterinario/a solo puede ver la fecha de última actualización de las evoluciones clínicas que registró él mismo; en las evoluciones cargadas por otro profesional, esa fecha permanece oculta
                  </li>
                  <li className="update-item">
                    En la tabla de indicaciones médicas, el rol Veterinario/a solo puede editar y eliminar las indicaciones que registró él mismo; en las indicaciones de otro profesional esos botones no se muestran (la generación del PDF sigue disponible)
                  </li>
                  <li className="update-item">
                    El rol Veterinario/a ya no puede editar los datos de las mascotas desde las tarjetas del listado: el botón "Editar" deja de mostrarse para este rol
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">13 de Abril de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Visualización del peso del paciente al final del label de selección de mascota en el formulario de indicaciones médicas
                  </li>
                  <li className="update-item">
                    Mejora en el selector de mascota del formulario de indicaciones médicas: al seleccionar una mascota se reemplaza el buscador por una tarjeta con el nombre, tutor/a, peso y botón para cambiar la selección
                  </li>
                  <li className="update-item">
                    Nuevos tipos de documentos médicos: Cuestionario, Electrocardiograma, Fotos e Informe médico. Renombrado "Otros informes" a "Otros". Las secciones de documentos ahora se ordenan alfabéticamente
                  </li>
                  <li className="update-item">
                    Indicador visual de mascota fallecida: cuando current_state es 2, el encabezado de las cards y la vista de detalle cambia de azul a gris oscuro, se muestra la etiqueta "Fallecido/a" y se agrega la opción correspondiente al selector de estado en el formulario de edición
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">13 de Marzo de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Reconfiguración del script de Google Drive para la subida de archivos. Se desconoce la causa exacta del error que interrumpió el funcionamiento, pero tras reconfigurar el deployment del script el servicio volvió a operar con normalidad
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">6 de Marzo de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Implementación de modal con opciones al generar PDFs de indicaciones médicas: ahora se puede elegir entre previsualizar en una nueva pestaña o descargar el documento directamente
                  </li>
                  <li className="update-item">
                    Corrección del botón de acceso a mascotas en tabla de usuarios: ahora solo se muestra cuando el usuario tiene mascotas vinculadas y muestra un badge con la cantidad si tiene más de una
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">17 de Febrero de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Visualización del peso del paciente al momento de crear indicaciones médicas
                  </li>
                  <li className="update-item">
                    Posibilidad de visualizar y abrir el perfil de mascotas directamente desde la tabla de usuarios
                  </li>
                  <li className="update-item">
                    Alerta en el panel de administración para usuarios pendientes de validación
                  </li>
                  <li className="update-item">
                    Ocultamiento de la edad de castración en el perfil del paciente
                  </li>
                  <li className="update-item">
                    Reordenamiento de secciones: evolución clínica se muestra antes que informes e indicaciones
                  </li>
                  <li className="update-item">
                    Cambio de etiqueta "Motivo de Consulta" por "Tipo de Consulta"
                  </li>
                  <li className="update-item">
                    Cambio de etiqueta "Anamnesis" por "Detalle de Consulta"
                  </li>
                </ul>
              </li>
              <li className="timeline-item">
                <span className="timeline-date">27 de Enero de 2026</span>
                <ul className="timeline-updates">
                  <li className="update-item">
                    Corrección de errores al editar indicaciones médicas con medicamentos asociados
                  </li>
                  <li className="update-item">
                    Agregado del último peso registrado del paciente en los PDFs de indicaciones médicas (con fecha correspondiente o mensaje "Sin registros" si no existe)
                  </li>
                </ul>
              </li>

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
