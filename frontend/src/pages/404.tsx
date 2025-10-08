import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn(`Ruta no encontrada: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1e2f, #3b3b5c)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>🚧</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Zona desconocida
      </h2>
      <p
        style={{
          maxWidth: "400px",
          textAlign: "center",
          marginBottom: "1rem",
          color: "#ccc",
        }}
      >
        Te perdiste en el ciberespacio. Esta página no existe o fue movida a
        otra dimensión.
      </p>
      <a
        href="/"
        style={{
          background: "#4f46e5",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          transition: "background 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#6366f1")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#4f46e5")}
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;
