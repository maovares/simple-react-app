// src/components/ProductCard.js
import React from "react";

const ProductCard = ({ product }) => {
    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            margin: "8px",
            width: "200px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
            <img src={product.title} alt={product.image} style={{ width: "100%", height: "150px", objectFit: "contain" }} />
            <h3 style={{ fontSize: "16px", margin: "8px 0" }}>{product.image}</h3>
            <p style={{ fontSize: "14px", color: "#666", margin: "4px 0" }}>{product.description}</p>
            <p style={{ fontWeight: "bold" }}>${product.price}</p>
        </div>
    );
};

export default ProductCard;