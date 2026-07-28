// Formatear fechas con el formato dd/mm/aaaa
export const formatDate = (dateString) => {
  if (!dateString || dateString === "0000-00-00") {
    return "No se registra fecha";
  }

  // Dividir la fecha manualmente para evitar problemas con zonas horarias
  const [year, month, day] = dateString.split("-");

  // Verificar que tenemos valores válidos
  if (!year || !month || !day) {
    return "Fecha inválida";
  }

  // Convertir a números y formatear
  const formattedDay = String(parseInt(day, 10)).padStart(2, "0");
  const formattedMonth = String(parseInt(month, 10)).padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
};

// Formatea un número decimal como dinero.
export function formatCurrency(amount) {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount)) {
    return "";
  }

  // Convierte el número a una cadena con dos decimales.
  const formattedAmount = amount.toFixed(2);

  // Separa la parte entera y la parte decimal.
  const [integerPart, decimalPart] = formattedAmount.split(".");

  // Agrega puntos como separadores de miles.
  const integerWithThousandSeparator = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  // Devuelve el formato final con coma para los decimales.
  return `$${integerWithThousandSeparator},${decimalPart}`;
}

//obtener datetime actual

export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Funcion para calcular la edad en años y meses, el parametro que recibe es forma "yyyy-mm-dd"
export const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }
  }

  return `${years} años, ${months} meses`;
};

// Función para obtener el tipo de prescripción
export const getPrescriptionType = (type) => {
  const types = {
    0: "Medicación/Receta",
    1: "Solicitud de Estudios",
    2: "Indicaciones"
  };
  return types[type] || "Desconocido";
};

// Función para obtener la vía de administración
export const getAdministrationRoute = (route) => {
  const routes = {
    0: "Oral",
    1: "Tópico",
    2: "Inyectable subcutáneo",
    3: "Inyectable intramuscular",
    4: "Intravenoso",
    5: "Oftálmico",
    6: "Ótico",
    7: "Otro"
  };
  return routes[route] || "Desconocido";
};

// Función para calcular la edad en una fecha específica
// Con onlyYears en true devuelve solo los años cumplidos (ej: "5 años")
export const calculateAgeAtDate = (birthdate, targetDate, onlyYears = false) => {
  if (!birthdate || !targetDate || targetDate === "0000-00-00" || birthdate === "0000-00-00") {
    return null;
  }

  const birth = new Date(birthdate);
  const target = new Date(targetDate);

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (target.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }
  }

  if (onlyYears) {
    return `${years} ${years === 1 ? "año" : "años"}`;
  }

  return `${years} años, ${months} meses`;
};

// Funcion que obtiene el nombre del dia

export const getDayName = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(date);
};

export const capitalizeName = (name) => {
  if (!name) return ""; // Maneja valores nulos o vacíos
  return name
    .trim() // Elimina espacios extra al inicio y al final
    .split(/\s+/) // Divide en palabras (maneja múltiples espacios)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palabra
    .join(" "); // Une las palabras nuevamente
};

// Función para obtener el nombre del rol según el número
export const getUserRoleName = (userRole) => {
  const roles = {
    0: "Programador",
    1: "Administración",
    2: "Veterinario/a",
    3: "Tutor/a",
  };

  return roles[userRole] || "Rol desconocido";
};

// Función para obtener el nombre de la especie según el número
export const getSpeciesName = (species) => {
  const speciesNames = {
    0: "Canino",
    1: "Felino",
    2: "Otro",
  };

  return speciesNames[species] || "Especie desconocida";
};

// Función para obtener el nombre del sexo según el número
export const getSexName = (sex) => {
  const sexNames = {
    1: "Hembra",
    2: "Macho",
    3: "Hembra castrada",
    4: "Macho castrado",
  };

  return sexNames[sex] || "No especificado";
};

// Función para obtener el tipo de documento médico según el número
export const getPetMedicalDocumentType = (type) => {
  const documentTypes = {
    0: "Análisis",
    1: "Ecografías",
    2: "Radiografías",
    3: "Endoscopías",
    4: "RM",
    5: "TAC",
    6: "Otros",
    7: "Cuestionario",
    8: "Electrocardiograma",
    9: "Fotos",
    10: "Informe médico",
  };

  return documentTypes[type] || "No especificado";
};

// Función para obtener la fecha actual en formato YYYY-MM-DD
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Función para normalizar texto (sin acentos, minúsculas, sin espacios extras)
export const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// Verifica si una fecha entra dentro de un rango "desde / hasta".
// Trabaja con cadenas en formato ISO (aaaa-mm-dd), que se pueden comparar
// alfabéticamente sin necesidad de construir objetos Date.
export const isDateInRange = (date, dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return true;
  if (!date) return false;

  const day = date.toString().slice(0, 10); // descarta la hora si el valor es un datetime

  if (dateFrom && day < dateFrom) return false;
  if (dateTo && day > dateTo) return false;

  return true;
};

// Función para calcular el tiempo restante de sesión
export const getSessionTimeRemaining = (expiresAt) => {
  if (!expiresAt) return "Sesión no válida";

  const now = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
  const secondsRemaining = expiresAt - now;

  if (secondsRemaining <= 0) {
    return "Sesión expirada";
  }

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes} minutos`;
  }
};

// Función para formatear timestamp Unix a fecha legible
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "No disponible";

  const date = new Date(timestamp * 1000); // Convertir a milisegundos
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Función para formatear datetime de MySQL (YYYY-MM-DD HH:MM:SS) a formato legible
export const formatDateTime = (datetimeString) => {
  if (!datetimeString) return "No disponible";

  // Dividir la fecha y hora
  const [datePart, timePart] = datetimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart ? timePart.split(":") : ["00", "00"];

  // Formatear como dd/mm/yyyy HH:mm
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const uploadMediaToCloudinary = async (file) => {
  console.log(file);
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_API_UPLOAD_PRESET);

  // For videos, you might want to add some specific options
  if (file.type.startsWith("video/")) {
    // Optional: Add video-specific parameters
    data.append("resource_type", "video");
  }

  const response = await fetch(
    file.type.startsWith("video/")
      ? `${import.meta.env.VITE_API_CLOUDINARY_URL.replace(
          "/image/",
          "/video/"
        )}`
      : import.meta.env.VITE_API_CLOUDINARY_URL,
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to upload ${
        file.type.startsWith("video/") ? "video" : "image"
      } to Cloudinary`
    );
  }

  const result = await response.json();
  console.log(result);

  return result.secure_url;
};

// Función para sanitizar texto antes de enviarlo al backend
export const sanitizeText = (text) => {
  if (!text) return text;

  // Reemplazar caracteres problemáticos
  return text
    .replace(/'/g, "''") // Escapar comillas simples duplicándolas (estándar SQL)
    .replace(/\\/g, "\\\\") // Escapar backslashes
    .trim();
};

// Función para sanitizar objeto completo (todos los campos de texto)
export const sanitizeFormData = (formData) => {
  const sanitized = { ...formData };

  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeText(sanitized[key]);
    }
  });

  return sanitized;
};

// Función para verificar si el usuario tiene permiso para acceder a una ruta
export const hasPermission = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(parseInt(userRole));
};

// Función para verificar si es cliente (rol 3)
export const isClient = (userRole) => {
  return parseInt(userRole) === 3;
};

// Función para verificar si es veterinario/a (rol 2)
export const isVeterinarian = (userRole) => {
  return parseInt(userRole) === 2;
};

// Función para verificar si puede gestionar usuarios y mascotas (roles 0, 1, 2)
export const canManageSystem = (userRole) => {
  const role = parseInt(userRole);
  return role === 0 || role === 1 || role === 2;
};

// Función para guardar los archivos en el drive 

export function guardarArchivo(e) {
    return new Promise((resolve, reject) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      var rawLog = reader.result.split(",")[1];
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      };
      fetch(
        "https://script.google.com/macros/s/AKfycbwPlOuEg100UNCGmwW11TWZg1Oj8Icjsgw0OTg7UQWmLg1lfVqlrFrHaJ8k4cp80pI/exec",
        { method: "POST", body: JSON.stringify(dataSend) }
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.url) {
            resolve(response.url);
          } else {
            reject(new Error("Failed to upload file"));
            console.log(response);
          }
        })
        .catch((e) => reject(e));
    };
  });
}
