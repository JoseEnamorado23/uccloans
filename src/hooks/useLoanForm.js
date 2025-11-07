// hooks/useLoanForm.js - MODIFICADO
import { useState, useEffect, useCallback } from "react";
import { useProgramas } from "./useProgramas"; // ✅ NUEVO: Importar hook de programas
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const useLoanForm = () => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    cedula: "",
    telefono: "",
    programa_id: "",
    email: "", // ✅ NUEVO: Campo email
    implemento_id: "",
    hora_inicio: "",
  });

  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [implementosDisponibles, setImplementosDisponibles] = useState([]);
  const [cargandoImplementos, setCargandoImplementos] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // ✅ NUEVO: Usar hook de programas en lugar del array hardcodeado
  const { programas, loading: programasLoading } = useProgramas();

  // Cargar implementos disponibles al inicializar
  useEffect(() => {
    cargarImplementosDisponibles();
  }, []);

  const cargarImplementosDisponibles = async () => {
    try {
      setCargandoImplementos(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/implementos/disponibles`
      );
      const data = await response.json();

      if (data.success) {
        setImplementosDisponibles(data.data);
      } else {
        console.error("Error cargando implementos:", data.message);
        setImplementosDisponibles([]);
      }
    } catch (error) {
      console.error("Error cargando implementos:", error);
      setImplementosDisponibles([]);
    } finally {
      setCargandoImplementos(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Crear usuario desde admin
  const createUserFromAdmin = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            creado_por_admin: true,
          }),
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creando usuario desde admin:", error);
      return { success: false, message: "Error de conexión" };
    }
  };

  // ✅ MODIFICADO: Enviar formulario
  const submitForm = async () => {
    console.log("🚀 INICIANDO submitForm...");
    console.log("📋 Estado actual:", { isNewUser, selectedUser, formData });

    if (validateForm()) {
      try {
        let userId = selectedUser?.id;

        // Si es usuario nuevo, crearlo primero
        if (isNewUser && !selectedUser) {
          console.log("📝 Creando nuevo usuario desde admin...");

          const userResult = await createUserFromAdmin({
            nombre_completo: formData.nombre_completo.trim(),
            numero_cedula: formData.cedula,
            numero_telefono: formData.telefono,
            programa_id: formData.programa_id,
            email: formData.email.trim(),
          });

          console.log("📨 Resultado creación usuario:", userResult);

          if (userResult.success) {
            userId = userResult.data.id;
            console.log("✅ Usuario creado con ID:", userId);
          } else {
            console.log("❌ Error creando usuario:", userResult.message);
            return { success: false, error: userResult.message };
          }
        }

        // Crear préstamo
        const formDataForSubmit = getFormDataForSubmit();
        console.log("📤 Enviando préstamo:", formDataForSubmit);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prestamos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataForSubmit),
        });

        const result = await response.json();
        console.log("📨 Resultado creación préstamo:", result);

        if (result.success) {
          // ✅ RECARGAR IMPLEMENTOS DISPONIBLES DESPUÉS DE CREAR PRÉSTAMO
          await cargarImplementosDisponibles();

          // ✅ RESETEAR FORMULARIO
          resetForm();

          console.log("✅ Préstamo creado e implementos actualizados");
          return {
            success: true,
            data: result.data,
            userCreated: isNewUser && !selectedUser, // Indicar si se creó usuario
          };
        } else {
          console.log("❌ Error creando préstamo:", result.message);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error("❌ Error en submitForm:", error);
        return { success: false, error: "Error de conexión" };
      }
    } else {
      console.log("❌ Formulario inválido");
      return { success: false, error: "Formulario inválido" };
    }
  };

  // Búsqueda en tiempo real
  const searchUsers = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/buscar?q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error buscando usuarios:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Búsqueda por cédula exacta
  const searchByCedula = useCallback(async (cedula) => {
    if (!cedula || cedula.length < 6) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/cedula/${cedula}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setSearchResults([{ ...data.data, _exactMatch: true }]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error buscando por cédula:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(newFormData);

    // Limpiar errores
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Lógica de búsqueda en tiempo real
    if (field === "nombre_completo" && value.length >= 2) {
      searchUsers(value);
    } else if (field === "cedula") {
      if (value.length >= 6) {
        searchByCedula(value);
      } else {
        setSearchResults([]);
      }
    } else if (field === "nombre_completo" && value.length < 2) {
      setSearchResults([]);
    }

    // Si se modifica un campo manualmente, deseleccionar usuario y marcar como nuevo
    if (
      selectedUser &&
      ((field === "nombre_completo" &&
        value !== selectedUser.nombre_completo) ||
        (field === "cedula" && value !== selectedUser.numero_cedula) ||
        (field === "telefono" && value !== selectedUser.numero_telefono) ||
        (field === "programa_id" && value !== selectedUser.programa_id))
    ) {
      setSelectedUser(null);
      setIsNewUser(true); // ✅ Marcar como usuario nuevo
    }

    // Si se está escribiendo manualmente y no hay usuario seleccionado, es usuario nuevo
    if (
      !selectedUser &&
      (field === "nombre_completo" || field === "cedula") &&
      value.length > 0
    ) {
      setIsNewUser(true);
    }
  };

  const selectUser = (user) => {
    console.log("👤 Seleccionando usuario:", user); // ✅ DEBUG
    
    setFormData({
      nombre_completo: user.nombre_completo || "",
      cedula: user.numero_cedula || "",
      telefono: user.numero_telefono || "",
      programa_id: user.programa_id || "", // ✅ Asegurar que se asigne el programa
      email: user.email || "", // ✅ Mantener email si existe
      implemento_id: formData.implemento_id,
      hora_inicio: formData.hora_inicio,
    });
    
    setSelectedUser(user);
    setSearchResults([]);
    setErrors({});
    setIsNewUser(false);
    
    console.log("📋 FormData después de seleccionar:", { 
      programa: user.programa,
      formDataPrograma: formData.programa 
    }); // ✅ DEBUG
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "nombre_completo":
        if (!value || value === "") {
          newErrors[field] = "El nombre completo es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors[field] = "Solo se permiten letras y espacios";
        } else if (value.trim().split(" ").length < 2) {
          newErrors[field] = "Ingrese al menos nombre y apellido";
        } else {
          delete newErrors[field];
        }
        break;

      case "cedula":
        if (!/^\d{6,12}$/.test(value)) {
          newErrors[field] = "La cédula debe tener entre 6 y 12 dígitos";
        } else {
          delete newErrors[field];
        }
        break;

      case "telefono":
        if (!/^\d{10}$/.test(value)) {
          newErrors[field] = "El teléfono debe tener 10 dígitos";
        } else {
          delete newErrors[field];
        }
        break;

      case "email":
        // ✅ NUEVO: Validación de email solo para usuarios nuevos
        if (isNewUser && !selectedUser) {
          if (!value.trim()) {
            newErrors[field] = "El email es obligatorio para nuevos usuarios";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field] = "Ingrese un email válido";
          } else {
            delete newErrors[field];
          }
        } else {
          delete newErrors[field]; // No validar si no es usuario nuevo
        }
        break;

      case "programa_id":
      case "implemento_id":
      case "hora_inicio":
        if (!value || value === "") {
          newErrors[field] = "Este campo es obligatorio";
        } else {
          delete newErrors[field];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const fieldsToValidate = [
      "nombre_completo",
      "cedula",
      "telefono",
      "programa_id",
      "implemento_id",
      "hora_inicio",
    ];

    // ✅ Agregar email a la validación solo si es usuario nuevo
    if (isNewUser && !selectedUser) {
      fieldsToValidate.push("email");
    }

    let isValid = true;

    console.log("🔍 Validando formulario...");

    fieldsToValidate.forEach((field) => {
      const fieldIsValid = validateField(field, formData[field]);
      console.log(
        `📋 Campo ${field}: "${formData[field]}" - Válido: ${fieldIsValid}`
      );
      if (!fieldIsValid) {
        isValid = false;
        console.log(`❌ Error en ${field}:`, errors[field]);
      }
    });

    console.log("🎯 Formulario válido:", isValid);
    console.log("❌ Errores actuales:", errors);

    return isValid;
  };

  const resetForm = () => {
    setFormData({
      nombre_completo: "",
      cedula: "",
      telefono: "",
      programa_id: "",
      email: "",
      implemento_id: "",
      hora_inicio: "",
    });
    setErrors({});
    setSearchResults([]);
    setSelectedUser(null);
    setIsNewUser(false);
    setIsSearching(false);
  };

  const getFormDataForSubmit = () => {
    // Obtener el nombre del implemento seleccionado
    const implementoSeleccionado = implementosDisponibles.find(
      (imp) => imp.id === parseInt(formData.implemento_id)
    );

    return {
      nombre_completo: formData.nombre_completo.trim(),
      numero_cedula: formData.cedula,
      numero_telefono: formData.telefono,
      programa_id: formData.programa_id,
      implemento: implementoSeleccionado ? implementoSeleccionado.nombre : "",
      implemento_id: parseInt(formData.implemento_id),
      hora_inicio: formData.hora_inicio,
      fecha_prestamo: new Date().toISOString().split("T")[0],
      estado: "activo",
    };
  };

  return {
    formData,
    errors,
    searchResults,
    isSearching,
    selectedUser,
    implementosDisponibles,
    cargandoImplementos,
    isNewUser,
    programas, // ✅ NUEVO: Exportar programas dinámicos
    programasLoading, // ✅ NUEVO: Exportar estado de carga
    handleChange,
    validateForm,
    validateField,
    resetForm,
    getFormDataForSubmit,
    selectUser,
    setSelectedUser,
    submitForm,
    cargarImplementosDisponibles,
  };
};