export const estaLogueado = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined && token !== "";
};

// Función 2: Verificar si el usuario es ADMIN
export const esAdmin = () => {
  try {
    const token = localStorage.getItem("token");

    // Si no hay token, no está logueado
    if (!token) return false;

    // Separar el JWT en sus 3 partes
    const partes = token.split(".");
    if (partes.length !== 3) return false;

    // Decodificar el payload (segunda parte)
    const payload = JSON.parse(atob(partes[1]));

    // Buscar el rol en diferentes campos posibles
    const rol =
      payload.rol || payload.role || payload.tipo || payload.tipoUsuario;

    // Verificar si es ADMIN (case insensitive)
    return rol && rol.toString().toUpperCase() === "ADMIN";
  } catch (error) {
    console.error("Error verificando rol:", error);
    return false;
  }
};
