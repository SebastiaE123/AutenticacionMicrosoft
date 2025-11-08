import React from 'react';

export default function Home() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/microsoft`;
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)',
        color: '#fff',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '3rem 4rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '600' }}>
          Iniciar sesión
        </h2>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
          Accede con tu cuenta de Microsoft para continuar
        </p>
        <button
          onClick={handleLogin}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.9em 1.8em',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.3)';
          }}
        >
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
}
