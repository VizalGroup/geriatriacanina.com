const initialState = {
  users: [],
  userDetail: [],
  authenticatedUserId: null,
  authenticatedUser:
    JSON.parse(localStorage.getItem("authenticatedUser")) || null,
  authenticatedUserId: localStorage.getItem("authenticatedUserId") || null,
  pets: [],
  petDetail: {},
  vetRecords: [],
  vetRecordDetail: {},
  petMedicalDocuments: [],
  petMedicalDocumentDetail: {},
  prescriptions: [],
  prescriptionDetail: {},
  prescriptionMedications: [],
  prescriptionMedicationDetail: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "GET_ID_USER":
      return {
        ...state,
        userDetail: action.payload,
      };

    case "POST_USER":
      return {
        ...state,
      };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        userDetail:
          state.userDetail && state.userDetail.id === action.payload.id
            ? action.payload
            : state.userDetail,
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((item) => item.id !== action.payload),
      };

    case "AUTHENTICATE_USER":
      return {
        ...state,
        authenticatedUser: action.payload,
        authenticatedUserId: action.payload.id,
      };

    case "SET_AUTHENTICATED_USER":
      return {
        ...state,
        authenticatedUser: action.payload,
        authenticatedUserId: action.payload.id,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        authenticatedUser: null,
        authenticatedUserId: null,
      };

    case "GET_PETS":
      return {
        ...state,
        pets: action.payload,
      };

    case "GET_ID_PET":
      return {
        ...state,
        petDetail: action.payload,
      };

    case "POST_PET":
      return {
        ...state,
      };

    case "UPDATE_PET":
      return {
        ...state,
        pets: state.pets.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        petDetail:
          state.petDetail && state.petDetail.id === action.payload.id
            ? action.payload
            : state.petDetail,
      };

    case "DELETE_PET":
      return {
        ...state,
        pets: state.pets.filter((item) => item.id !== action.payload),
      };

    case "GET_VET_RECORDS":
      return {
        ...state,
        vetRecords: action.payload,
      };

    case "GET_ID_VET_RECORD":
      return {
        ...state,
        vetRecordDetail: action.payload,
      };

    case "POST_VET_RECORD":
      return {
        ...state,
      };

    case "UPDATE_VET_RECORD":
      return {
        ...state,
        vetRecords: state.vetRecords.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        vetRecordDetail:
          state.vetRecordDetail && state.vetRecordDetail.id === action.payload.id
            ? action.payload
            : state.vetRecordDetail,
      };

    case "DELETE_VET_RECORD":
      return {
        ...state,
        vetRecords: state.vetRecords.filter((item) => item.id !== action.payload),
      };

    case "GET_PET_MEDICAL_DOCUMENTS":
      return {
        ...state,
        petMedicalDocuments: action.payload,
      };

    case "GET_ID_PET_MEDICAL_DOCUMENT":
      return {
        ...state,
        petMedicalDocumentDetail: action.payload,
      };

    case "POST_PET_MEDICAL_DOCUMENT":
      return {
        ...state,
      };

    case "UPDATE_PET_MEDICAL_DOCUMENT":
      return {
        ...state,
        petMedicalDocuments: state.petMedicalDocuments.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        petMedicalDocumentDetail:
          state.petMedicalDocumentDetail && state.petMedicalDocumentDetail.id === action.payload.id
            ? action.payload
            : state.petMedicalDocumentDetail,
      };

    case "DELETE_PET_MEDICAL_DOCUMENT":
      return {
        ...state,
        petMedicalDocuments: state.petMedicalDocuments.filter((item) => item.id !== action.payload),
      };

    case "GET_PRESCRIPTIONS":
      return {
        ...state,
        prescriptions: action.payload,
      };

    case "GET_ID_PRESCRIPTION":
      return {
        ...state,
        prescriptionDetail: action.payload,
      };

    case "POST_PRESCRIPTION":
      return {
        ...state,
      };

    case "UPDATE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        prescriptionDetail:
          state.prescriptionDetail && state.prescriptionDetail.id === action.payload.id
            ? action.payload
            : state.prescriptionDetail,
      };

    case "DELETE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.filter((item) => item.id !== action.payload),
      };

    case "GET_PRESCRIPTION_MEDICATIONS":
      return {
        ...state,
        prescriptionMedications: action.payload,
      };

    case "GET_ID_PRESCRIPTION_MEDICATION":
      return {
        ...state,
        prescriptionMedicationDetail: action.payload,
      };

    case "POST_PRESCRIPTION_MEDICATION":
      return {
        ...state,
      };

    case "UPDATE_PRESCRIPTION_MEDICATION":
      return {
        ...state,
        prescriptionMedications: state.prescriptionMedications.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
        prescriptionMedicationDetail:
          state.prescriptionMedicationDetail && state.prescriptionMedicationDetail.id === action.payload.id
            ? action.payload
            : state.prescriptionMedicationDetail,
      };

    case "DELETE_PRESCRIPTION_MEDICATION":
      return {
        ...state,
        prescriptionMedications: state.prescriptionMedications.filter((item) => item.id !== action.payload),
      };

    default:
      return { ...state };
  }
};

export default rootReducer;