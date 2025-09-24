// Caché en memoria para el token JWT. Se borra al recargar la página.
let jwtToken = null;

/**
 * Decodifica un token JWT y verifica si ha expirado.
 * @param {string} token El token JWT.
 * @returns {boolean} True si el token es válido y no ha expirado, false en caso contrario.
 */
function isTokenValid(token) {
  if (!token) {
    return false;
  }
  try {
    // Decodifica el payload del JWT (la parte del medio)
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // La propiedad 'exp' contiene la fecha de expiración en segundos desde la época (epoch)
    const expirationTime = decodedPayload.exp;
    const currentTime = Date.now() / 1000;

    // Devuelve true si el token no ha expirado (con un margen de 30 segundos)
    return expirationTime > (currentTime + 30);
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false;
  }
}

/**
 * Obtiene un token JWT, ya sea desde la caché en memoria o solicitando uno nuevo al backend.
 * Este token se utiliza para autenticar las llamadas a la API protegida.
 */
async function getApiAuthToken() {
  // Si ya tenemos un token válido en memoria, lo reutilizamos.
  if (isTokenValid(jwtToken)) {
    return jwtToken;
  }

  try {
    // 1. Verificar si el usuario está autenticado en SWA.
    const authRes = await fetch("/.auth/me");
    const { clientPrincipal } = await authRes.json();

    if (!clientPrincipal) {
      jwtToken = null; // Limpiar token si el usuario ya no está logueado.
      return null;
    }

    // 2. Solicitar un nuevo token al backend.
    const tokenRes = await fetch("/api/GetToken", {
      method: "POST"
    });

    if (!tokenRes.ok) {
      throw new Error(`Error al obtener el token JWT: ${tokenRes.statusText}`);
    }

    const data = await tokenRes.json();
    jwtToken = data.token; // Guardar el nuevo token en la caché en memoria.
    return jwtToken; // <-- JWT firmado y recién obtenido
  } catch (e) {
    console.error('No se pudo obtener el token JWT del backend.', e);
    jwtToken = null; // Limpiar en caso de error.
    return null;
  }
}

export const fetchProducts = async () => {
    try {
        const jwt = await getApiAuthToken();
        if (!jwt) {
            // Si no hay token, el usuario no está autenticado.
            return [];
        }

        const response = await fetch(process.env.REACT_APP_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};