// src/App.js
import React, { useEffect, useState } from "react";
import { fetchProducts } from "./services/api";
import ProductCard from "./components/ProductCard";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    if (user) {
      const loadProducts = async () => {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      };
      loadProducts();
    } else {
      setLoading(false);
      setProducts([]);
    }
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