// src/App.js
import React, { useEffect, useState } from "react";
import { fetchProducts } from "./services/api";
import ProductCard from "./components/ProductCard";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        setUser(clientPrincipal);
      } catch (error) {
        console.error('No user info found');
      }
    };
    getUserInfo();
  }, []);

  const loadProducts = async (page = 0) => {
    if (!user) {
      setLoading(false);
      setProducts([]);
      setPagination({
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      });
      return;
    }

    setLoading(true);
    const data = await fetchProducts(page, pagination.size);
    setProducts(data.content);
    setPagination({
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages
    });
    setLoading(false);
  };

  useEffect(() => {
    loadProducts(0);
  }, [user]);

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6'
  };

  const titleStyles = {
    margin: 0,
    fontSize: '24px'
  };

  const authContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const buttonStyles = {
    padding: '8px 16px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const logoutButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  };

  const userInfoStyles = {
    fontWeight: 'bold',
  };

  const paginationStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    margin: '32px 0',
    padding: '16px'
  };

  const paginationButtonStyles = {
    padding: '8px 16px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const paginationButtonDisabledStyles = {
    ...paginationButtonStyles,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    cursor: 'not-allowed'
  };

  const paginationInfoStyles = {
    fontSize: '14px',
    color: '#666'
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Productos</h1>
        <div style={authContainerStyles}>
          {user ? (
            <>
              <span style={userInfoStyles}>Hola, {user.userDetails}</span>
              <a href="/.auth/logout" style={logoutButtonStyles}>Cerrar sesión</a>
            </>
          ) : (
            <a href="/.auth/login/github" style={buttonStyles}>
              Iniciar sesión con GitHub
            </a>
          )}
        </div>
      </header>
      <main style={{ padding: "32px" }}>
        {user ? (
          loading ? (
            <p style={{ textAlign: "center" }}>Cargando productos...</p>
          ) : (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div style={paginationStyles}>
                  <button
                    style={pagination.page === 0 ? paginationButtonDisabledStyles : paginationButtonStyles}
                    onClick={() => loadProducts(pagination.page - 1)}
                    disabled={pagination.page === 0}
                  >
                    Anterior
                  </button>

                  <span style={paginationInfoStyles}>
                    Página {pagination.page + 1} de {pagination.totalPages}
                    ({pagination.totalElements} productos total)
                  </span>

                  <button
                    style={pagination.page >= pagination.totalPages - 1 ? paginationButtonDisabledStyles : paginationButtonStyles}
                    onClick={() => loadProducts(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <p style={{ textAlign: "center" }}>Por favor, inicie sesión para ver los productos.</p>
        )}
      </main>
    </div>
  );
}

export default App;