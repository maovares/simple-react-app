/**
 * Obtiene un token JWT firmado desde el backend.
 * Este token se utiliza para autenticar las llamadas a la API protegida.
 */
async function getJwtFromBackend() {
  try {
    // 1. Pedir el usuario autenticado a SWA
    const res = await fetch("/.auth/me");
    const { clientPrincipal } = await res.json();

    // Si no hay clientPrincipal, el usuario no está autenticado.
    if (!clientPrincipal) {
      return null;
    }

    // 2. Mandar ese objeto al backend para que firme un JWT.
    //    Asegúrate de reemplazar <tu-functionapp> o usar una variable de entorno.
    const resp = await fetch(process.env.REACT_APP_TOKEN_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientPrincipal })
    });

    if (!resp.ok) {
      throw new Error(`Error al obtener el token JWT: ${resp.statusText}`);
    }

    const data = await resp.json();
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