/**
 * Obtiene un token JWT firmado desde el backend.
 * Este token se utiliza para autenticar las llamadas a la API protegida.
 */
async function getJwtFromBackend() {
  try {
    // 1. Opcional: Verificar si el usuario está autenticado para el UI.
    const authRes = await fetch("/.auth/me");
    const { clientPrincipal } = await authRes.json();

    if (!clientPrincipal) {
      return null;
    }

    // 2. Hacer la llamada al back-end SIN enviar el clientPrincipal.
    //    El proxy de SWA se encarga de inyectar la identidad en el encabezado.
    const res = await fetch("/api/GetToken", {
      method: "POST"
    });

    if (!res.ok) {
      throw new Error(`Error al obtener el token JWT: ${res.statusText}`);
    }

    const data = await res.json();
    return data.token; // <-- JWT firmado
  } catch (e) {
    console.error('No se pudo obtener el token JWT del backend.', e);
    return null;
  }
}

export const fetchProducts = async () => {
    try {
        const jwt = await getJwtFromBackend();
        if (!jwt) {
            // Si no hay token, el usuario no está autenticado.
            return [];
        }

        const response = await fetch(process.env.REACT_APP_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
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