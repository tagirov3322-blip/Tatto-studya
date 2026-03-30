"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacy-accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacy-accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        borderTop: "1px solid #333",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        flexWrap: "wrap",
        backdropFilter: "blur(10px)",
      }}
    >
      <p style={{ color: "#ccc", fontSize: "14px", margin: 0, maxWidth: "600px" }}>
        Мы используем файлы cookie и обрабатываем персональные данные. Продолжая использовать сайт, вы соглашаетесь с{" "}
        <a href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>
          политикой конфиденциальности
        </a>
        .
      </p>
      <button
        onClick={handleAccept}
        style={{
          backgroundColor: "#fff",
          color: "#000",
          border: "none",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Принять
      </button>
    </div>
  );
}
