import { createSelector } from "reselect";

// Selector general para usuarios y usuarios ordenados por user_rol y despues alfabeticamente por lastname y first_name
export const selectUsers = (state) => state.users;

export const selectSortedUsers = createSelector([selectUsers], (users) => {
  return [...users].sort((a, b) => {
    if (a.user_role === b.user_role) {
        if (a.lastname === b.lastname) {
            return a.first_name.localeCompare(b.first_name);
        }
        return a.lastname.localeCompare(b.lastname);
    }
    return a.user_role - b.user_role;
  });
});

// Selector general para mascotas ordenadas por especie y luego alfabéticamente por nombre
export const selectPets = (state) => state.pets;

export const selectSortedPets = createSelector([selectPets], (pets) => {
  return [...pets].sort((a, b) => {
    if (a.species === b.species) {
      return a.pet_name.localeCompare(b.pet_name);
    }
    return a.species - b.species;
  });
});

// Selector general para historias clínicas ordenadas por id (del mayor al menor)
export const selectVetRecords = (state) => state.vetRecords;

export const selectSortedVetRecords = createSelector([selectVetRecords], (vetRecords) => {
  return [...vetRecords].sort((a, b) => b.id - a.id);
});

// Selector para historias clínicas ordenadas por fecha de evento (más reciente primero)
export const selectVetRecordsByDate = createSelector([selectVetRecords], (vetRecords) => {
  return [...vetRecords].sort((a, b) => {
    // Normalizar formato de fecha (convertir T a espacio si existe)
    const normalizeDate = (dateStr) => {
      if (!dateStr) return null;
      return dateStr.replace('T', ' ');
    };

    const dateA = new Date(normalizeDate(a.event_date));
    const dateB = new Date(normalizeDate(b.event_date));
    
    // Verificar si las fechas son válidas
    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    
    // Si las fechas son diferentes, ordenar por fecha (más reciente primero)
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    
    // Si las fechas son iguales o inválidas, ordenar por ID (más reciente primero)
    return b.id - a.id;
  });
});

// Selector para ordenar documentos médicos por fecha (más recientes primero)
export const selectPetMedicalDocumentsByDate = createSelector(
  [(state) => state.petMedicalDocuments],
  (documents) => {
    return [...documents].sort((a, b) => {
      const dateA = new Date(a.document_date);
      const dateB = new Date(b.document_date);
      return dateB - dateA; // Orden descendente (más recientes primero)
    });
  }
);

// selector general de inidicaciones médicas ordenadas por id (del mayor al menor)
export const selectPrescriptions = (state) => state.prescriptions;

export const selectSortedPrescriptions = createSelector([selectPrescriptions], (prescriptions) => {
  return [...prescriptions].sort((a, b) => b.id - a.id);
});

// Selector para obtener el último peso de cada mascota (memoizado para eficiencia)
export const selectPetWeights = createSelector(
  [selectVetRecordsByDate],
  (vetRecords) => {
    const petWeights = {};
    
    // Crear diccionario { petId: { weight, date } }
    // Solo guarda el primer registro (más reciente) de cada mascota
    vetRecords.forEach((record) => {
      if (record.weight && !petWeights[record.pet_id]) {
        petWeights[record.pet_id] = {
          weight: record.weight,
          date: record.event_date,
        };
      }
    });
    
    return petWeights;
  }
);