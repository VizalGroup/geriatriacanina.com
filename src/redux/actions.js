import axios from "axios";

export const GET_USERS = "GET_USERS";
export const GET_ID_USER = "GET_ID_USER";
export const POST_USER = "POST_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";
export const AUTHENTICATE_USER = "AUTHENTICATE_USER";
export const SET_AUTHENTICATED_USER = "SET_AUTHENTICATED_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const GET_PETS = "GET_PETS";
export const GET_ID_PET = "GET_ID_PET";
export const POST_PET = "POST_PET";
export const UPDATE_PET = "UPDATE_PET";
export const DELETE_PET = "DELETE_PET";

export const GET_VET_RECORDS = "GET_VET_RECORDS";
export const GET_ID_VET_RECORD = "GET_ID_VET_RECORD";
export const POST_VET_RECORD = "POST_VET_RECORD";
export const UPDATE_VET_RECORD = "UPDATE_VET_RECORD";
export const DELETE_VET_RECORD = "DELETE_VET_RECORD";

export const GET_PET_MEDICAL_DOCUMENTS = "GET_PET_MEDICAL_DOCUMENTS";
export const GET_ID_PET_MEDICAL_DOCUMENT = "GET_ID_PET_MEDICAL_DOCUMENT";
export const POST_PET_MEDICAL_DOCUMENT = "POST_PET_MEDICAL_DOCUMENT";
export const UPDATE_PET_MEDICAL_DOCUMENT = "UPDATE_PET_MEDICAL_DOCUMENT";
export const DELETE_PET_MEDICAL_DOCUMENT = "DELETE_PET_MEDICAL_DOCUMENT";

export const REQUEST_PASSWORD_RESET = "REQUEST_PASSWORD_RESET";
export const VERIFY_RESET_TOKEN = "VERIFY_RESET_TOKEN";
export const GET_PASSWORD_RESET_TOKENS = "GET_PASSWORD_RESET_TOKENS";

export const GET_PRESCRIPTIONS = "GET_PRESCRIPTIONS";
export const GET_ID_PRESCRIPTION = "GET_ID_PRESCRIPTION";
export const POST_PRESCRIPTION = "POST_PRESCRIPTION";
export const UPDATE_PRESCRIPTION = "UPDATE_PRESCRIPTION";
export const DELETE_PRESCRIPTION = "DELETE_PRESCRIPTION";

export const GET_PRESCRIPTION_MEDICATIONS = "GET_PRESCRIPTION_MEDICATIONS";
export const GET_ID_PRESCRIPTION_MEDICATION = "GET_ID_PRESCRIPTION_MEDICATION";
export const POST_PRESCRIPTION_MEDICATION = "POST_PRESCRIPTION_MEDICATION";
export const UPDATE_PRESCRIPTION_MEDICATION = "UPDATE_PRESCRIPTION_MEDICATION";
export const DELETE_PRESCRIPTION_MEDICATION = "DELETE_PRESCRIPTION_MEDICATION";

// url base de la API
const usersURL = import.meta.env.VITE_API_USERS_URL;
const authUserURL = import.meta.env.VITE_API_AUTH_USERS_URL;
const petsURL = import.meta.env.VITE_API_PETS_URL;
const vetRecordsURL = import.meta.env.VITE_API_VET_RECORDS_URL;
const petMedicalDocumentsURL = import.meta.env.VITE_API_PET_MEDICAL_DOCUMENTS_URL;
const passwordResetURL = import.meta.env.VITE_API_PASSWPORD_RESET_TOKENS_URL;
const prescriptionsURL = import.meta.env.VITE_API_PRESCRIPTIONS_URL;
const prescriptionMedicationsURL = import.meta.env.VITE_API_PRESCRIPTION_MEDICATIONS_URL;

// actions de usuarios

export const GetUsers = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(usersURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_USERS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_USERS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetUserDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${usersURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_USER,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_ID_USER,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles del usuario: ", err);
      throw err;
    }
  };
};

export const PostUser = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("first_name", atributos.first_name);
      form.append("lastname", atributos.lastname);
      form.append("user_role", atributos.user_role);
      form.append("email", atributos.email);
      form.append("clue", atributos.clue);
      form.append("phone", atributos.phone);
      form.append("is_activate", atributos.is_activate);
      form.append("street_address", atributos.street_address);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(usersURL, form);
      console.log("Usuario creado, respuesta:", response.data);
      return dispatch({
        type: POST_USER,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      // Verificar si es un error 409 (Conflict) - email duplicado
      if (err.response && err.response.status === 409) {
        const errorData = err.response.data;
        throw new Error(errorData.message || "Este email ya está registrado");
      }

      // Para otros errores
      throw new Error("Ha ocurrido un error al registrar el cliente");
    }
  };
};

export const updateUser = (id, atributos) => {
  
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("first_name", atributos.first_name);
      form.append("lastname", atributos.lastname);
      form.append("user_role", atributos.user_role);
      form.append("email", atributos.email);
      form.append("clue", atributos.clue);
      form.append("phone", atributos.phone);
      form.append("is_activate", atributos.is_activate);
      form.append("street_address", atributos.street_address);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(usersURL, form, { params: { id } });
      console.log("Usuario actualizado, respuesta:", response.data);
      return dispatch({
        type: UPDATE_USER,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeleteUser = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(usersURL, form, { params: { id } });
      return dispatch({
        type: DELETE_USER,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

// Función para verificar si la sesión ha expirado
export const CheckSessionExpiration = () => {
  return function (dispatch) {
    try {
      const authenticatedUser = localStorage.getItem("authenticatedUser");
      if (authenticatedUser) {
        const user = JSON.parse(authenticatedUser);
        const currentTime = Math.floor(Date.now() / 1000);

        if (user.expires_at && currentTime > user.expires_at) {
          console.log("Sesión expirada - cerrando sesión automáticamente.");
          dispatch(LogoutClient());
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al verificar la expiración de la sesión:", error);
      return false;
    }
  };
};

export const authenticateUser = (email, clue) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "LOGIN_USER");
      form.append("email", email);
      form.append("clue", clue);

      const response = await axios.post(authUserURL, form);

      if (response.data && !response.data.error) {
         console.log(
          "✅ Usuario logueado:",
          `${response.data.first_name} ${response.data.lastname}`
        );

         localStorage.setItem("authenticatedUserId", response.data.id);
        localStorage.setItem(
          "authenticatedUser",
          JSON.stringify(response.data)
        );
         return dispatch({
          type: AUTHENTICATE_USER,
          payload: response.data,
        });

      } else {
        throw new Error(response.data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error completo:", err);
      
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 401) {
          throw new Error(errorData.error || "Email o contraseña incorrectos");
        } else if (status === 403) {
          throw new Error(errorData.error || "Esta cuenta ha sido desactivada. Contacte al administrador.");
        } else if (status === 500) {
          throw new Error("Error en el servidor. Intente nuevamente más tarde.");
        } else {
          throw new Error(errorData.error || "Error al iniciar sesión");
        }
      } else if (err.request) {
        // La petición se hizo pero no se recibió respuesta
        throw new Error("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        // Algo sucedió al configurar la petición
        throw new Error(err.message || "Error inesperado al iniciar sesión");
      }
    }
  };
};


export const SetAuthenticatedUser = (user) => {
  return function (dispatch) {
    try {
      localStorage.setItem("authenticatedUserId", user.id);
      localStorage.setItem("authenticatedUser", JSON.stringify(user));
      return dispatch({
        type: SET_AUTHENTICATED_USER,
        payload: user,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const LogoutUser = () => {
  return function (dispatch) {
    try {
      console.log("🚪 Cerrando sesión");
      localStorage.removeItem("authenticatedUserId");
      localStorage.removeItem("authenticatedUser");
      return dispatch({
        type: LOGOUT_USER,
        payload: null,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

// Actions para las mascotas

export const GetPets = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(petsURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_PETS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_PETS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetPetDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${petsURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_PET,
          payload: response.data,
        });
      }
      else {
        return dispatch({
          type: GET_ID_PET,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles de la mascota: ", err);
      throw err;
    } 
  };
};

export const PostPet = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("profile_picture_url", atributos.profile_picture_url || "");
      form.append("species", atributos.species);
      form.append("pet_name", atributos.pet_name);
      form.append("birth_date", atributos.birth_date);
      form.append("breed", atributos.breed);
      form.append("sex", atributos.sex);
      form.append("castration_date", atributos.castration_date || "");
      form.append("owner_id", atributos.owner_id);
      form.append("current_state", atributos.current_state);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(petsURL, form);
      console.log("Mascota creada, respuesta:", response.data);
      return dispatch({
        type: POST_PET,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw new Error("Ha ocurrido un error al registrar la mascota");
    }
  };
};

export const updatePet = (id, atributos) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("profile_picture_url", atributos.profile_picture_url || "");
      form.append("species", atributos.species);
      form.append("pet_name", atributos.pet_name);
      form.append("birth_date", atributos.birth_date);
      form.append("breed", atributos.breed);
      form.append("sex", atributos.sex);
      form.append("castration_date", atributos.castration_date || "");
      form.append("owner_id", atributos.owner_id);
      form.append("current_state", atributos.current_state);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(petsURL, form, { params: { id } });
      console.log("Mascota actualizada, respuesta:", response.data);
      return dispatch({
        type: UPDATE_PET,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeletePet = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(petsURL, form, { params: { id } });
      return dispatch({
        type: DELETE_PET,
        payload: id,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

// Actions para las historias clínicas veterinarias

export const GetVetRecords = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(vetRecordsURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_VET_RECORDS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_VET_RECORDS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetVetRecordDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${vetRecordsURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_VET_RECORD,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_ID_VET_RECORD,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles de la historia clínica: ", err);
      throw err;
    }
  };
};

export const PostVetRecord = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("pet_id", atributos.pet_id);
      form.append("consultation_reason", atributos.consultation_reason);
      form.append("anamnesis", atributos.anamnesis || "");
      form.append("diagnosis", atributos.diagnosis || "");
      form.append("weight", atributos.weight || "");
      form.append("event_date", atributos.event_date);
      form.append("user_id", atributos.user_id);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(vetRecordsURL, form);
      console.log("Historia clínica creada, respuesta:", response.data);
      return dispatch({
        type: POST_VET_RECORD,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw new Error("Ha ocurrido un error al registrar la historia clínica");
    }
  };
};

export const updateVetRecord = (id, atributos) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("pet_id", atributos.pet_id);
      form.append("consultation_reason", atributos.consultation_reason);
      form.append("anamnesis", atributos.anamnesis || "");
      form.append("diagnosis", atributos.diagnosis || "");
      form.append("weight", atributos.weight || "");
      form.append("event_date", atributos.event_date);
      form.append("user_id", atributos.user_id);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(vetRecordsURL, form, { params: { id } });
      console.log("Historia clínica actualizada, respuesta:", response.data);
      return dispatch({
        type: UPDATE_VET_RECORD,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeleteVetRecord = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(vetRecordsURL, form, { params: { id } });
      return dispatch({
        type: DELETE_VET_RECORD,
        payload: id,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

// Actions para los archivos médicos

export const GetPetMedicalDocuments = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(petMedicalDocumentsURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_PET_MEDICAL_DOCUMENTS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_PET_MEDICAL_DOCUMENTS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetPetMedicalDocumentDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${petMedicalDocumentsURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_PET_MEDICAL_DOCUMENT,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_ID_PET_MEDICAL_DOCUMENT,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles del documento médico: ", err);
      throw err;
    }
  };
};

export const PostPetMedicalDocument = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("pet_id", atributos.pet_id);
      form.append("document_url", atributos.document_url);
      form.append("document_type", atributos.document_type);
      form.append("document_title", atributos.document_title);
      form.append("document_date", atributos.document_date);
      form.append("uploaded_by", atributos.uploaded_by);
      form.append("is_approved", atributos.is_approved);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(petMedicalDocumentsURL, form);
      console.log("Documento médico creado, respuesta:", response.data);
      return dispatch({
        type: POST_PET_MEDICAL_DOCUMENT,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw new Error("Ha ocurrido un error al registrar el documento médico");
    }
  };
};

export const updatePetMedicalDocument = (id, atributos) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("pet_id", atributos.pet_id);
      form.append("document_url", atributos.document_url);
      form.append("document_type", atributos.document_type);
      form.append("document_title", atributos.document_title);
      form.append("document_date", atributos.document_date);
      form.append("uploaded_by", atributos.uploaded_by);
      form.append("is_approved", atributos.is_approved);
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(petMedicalDocumentsURL, form, { params: { id } });
      console.log("Documento médico actualizado, respuesta:", response.data);
      return dispatch({
        type: UPDATE_PET_MEDICAL_DOCUMENT,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeletePetMedicalDocument = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(petMedicalDocumentsURL, form, { params: { id } });
      return dispatch({
        type: DELETE_PET_MEDICAL_DOCUMENT,
        payload: id,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

// Actions para recuperación de contraseña

export const RequestPasswordReset = (user_id) => {
  return async function (dispatch) {
    try {
      var f = new FormData();
      f.append("METHOD", "POST");
      f.append("user_id", user_id);

      var response = await axios.post(passwordResetURL, f);
      console.log("Token de reseteo creado:", response.data);

      return dispatch({
        type: REQUEST_PASSWORD_RESET,
        payload: response.data,
      });
    } catch (err) {
      console.error("Error al solicitar reseteo:", err);
      
      if (err.response && err.response.data) {
        throw new Error(err.response.data.message || "Error al enviar el email de recuperación");
      }
      
      throw new Error("Error al solicitar recuperación de contraseña");
    }
  };
};

export const VerifyPasswordResetToken = (token) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${passwordResetURL}?verify_token=${token}`);

      return dispatch({
        type: VERIFY_RESET_TOKEN,
        payload: response.data,
      });
    } catch (err) {
      console.error("Error al verificar token:", err);
      
      return dispatch({
        type: VERIFY_RESET_TOKEN,
        payload: { valid: false, message: "Token inválido o expirado" },
      });
    }
  };
};

export const GetPasswordResetTokens = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(passwordResetURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_PASSWORD_RESET_TOKENS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_PASSWORD_RESET_TOKENS,
          payload: [],
        });
      }
    } catch (err) {
      console.error("Error al obtener tokens:", err);
      throw err;
    }
  };
};

// Actions para las prescripciones

export const GetPrescriptions = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(prescriptionsURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_PRESCRIPTIONS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_PRESCRIPTIONS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetPrescriptionDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${prescriptionsURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_PRESCRIPTION,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_ID_PRESCRIPTION,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles de la prescripción: ", err);
      throw err;
    }
  };
};

export const PostPrescription = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("pet_id", atributos.pet_id);
      form.append("vet_id", atributos.vet_id);
      form.append("prescription_type", atributos.prescription_type);
      form.append("title", atributos.title);
      form.append("content", atributos.content || "");
      form.append("prescription_date", atributos.prescription_date);
      form.append("warnings", atributos.warnings || "");
      form.append("notes", atributos.notes || "");
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(prescriptionsURL, form);
      console.log("Prescripción creada, respuesta:", response.data);
      return dispatch({
        type: POST_PRESCRIPTION,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw new Error("Ha ocurrido un error al registrar la prescripción");
    }
  };
};

export const updatePrescription = (id, atributos) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("pet_id", atributos.pet_id);
      form.append("vet_id", atributos.vet_id);
      form.append("prescription_type", atributos.prescription_type);
      form.append("title", atributos.title);
      form.append("content", atributos.content || "");
      form.append("prescription_date", atributos.prescription_date);
      form.append("warnings", atributos.warnings || "");
      form.append("notes", atributos.notes || "");
      form.append("created_at", atributos.created_at);
      form.append("updated_at", atributos.updated_at);

      var response = await axios.post(prescriptionsURL, form, { params: { id } });
      console.log("Prescripción actualizada, respuesta:", response.data);
      return dispatch({
        type: UPDATE_PRESCRIPTION,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeletePrescription = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(prescriptionsURL, form, { params: { id } });
      return dispatch({
        type: DELETE_PRESCRIPTION,
        payload: id,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

// Actions para los medicamentos de prescripciones

export const GetPrescriptionMedications = () => {
  return async function (dispatch) {
    try {
      var response = await axios.get(prescriptionMedicationsURL);
      if (response.data !== null) {
        return dispatch({
          type: GET_PRESCRIPTION_MEDICATIONS,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_PRESCRIPTION_MEDICATIONS,
          payload: [],
        });
      }
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const GetPrescriptionMedicationDetail = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${prescriptionMedicationsURL}?id=${id}`);
      if (response.data) {
        return dispatch({
          type: GET_ID_PRESCRIPTION_MEDICATION,
          payload: response.data,
        });
      } else {
        return dispatch({
          type: GET_ID_PRESCRIPTION_MEDICATION,
          payload: {},
        });
      }
    } catch (err) {
      console.error("Error al obtener detalles del medicamento: ", err);
      throw err;
    }
  };
};

export const PostPrescriptionMedication = (atributos) => {
  console.log(atributos);
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "POST");
      form.append("prescription_id", atributos.prescription_id);
      form.append("medication_name", atributos.medication_name);
      form.append("active_ingredient", atributos.active_ingredient || "");
      form.append("dosage", atributos.dosage);
      form.append("duration", atributos.duration);
      form.append("administration_route", atributos.administration_route);
      form.append("instructions", atributos.instructions || "");

      var response = await axios.post(prescriptionMedicationsURL, form);
      console.log("Medicamento de prescripción creado, respuesta:", response.data);
      return dispatch({
        type: POST_PRESCRIPTION_MEDICATION,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw new Error("Ha ocurrido un error al registrar el medicamento");
    }
  };
};

export const updatePrescriptionMedication = (id, atributos) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "PUT");
      form.append("prescription_id", atributos.prescription_id);
      form.append("medication_name", atributos.medication_name);
      form.append("active_ingredient", atributos.active_ingredient || "");
      form.append("dosage", atributos.dosage);
      form.append("duration", atributos.duration);
      form.append("administration_route", atributos.administration_route);
      form.append("instructions", atributos.instructions || "");

      var response = await axios.post(prescriptionMedicationsURL, form, { params: { id } });
      console.log("Medicamento de prescripción actualizado, respuesta:", response.data);
      return dispatch({
        type: UPDATE_PRESCRIPTION_MEDICATION,
        payload: response.data,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};

export const DeletePrescriptionMedication = (id) => {
  return async function (dispatch) {
    try {
      var form = new FormData();
      form.append("METHOD", "DELETE");
      var response = await axios.post(prescriptionMedicationsURL, form, { params: { id } });
      return dispatch({
        type: DELETE_PRESCRIPTION_MEDICATION,
        payload: id,
      });
    } catch (err) {
      alert("Ha ocurrido un error: ", err);
      throw err;
    }
  };
};
