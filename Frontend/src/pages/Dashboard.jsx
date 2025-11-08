import React, {useEffect, useState} from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        if (!res.data.ok) throw new Error('No autorizado');
        setUser(res.data.user);
      } catch (err) {
        navigate('/');
      }
    };
    fetchUser();
    // cleanup not strictly required aquí
  }, []);

  if (!user) return <div>Cargando datos...</div>;

  const [firstName, ...rest] = user.displayName.split(' ');
  const lastName = rest.join(' ');

  return (
    <div style={{padding:20}}>
      <h1>Bienvenido, {firstName} {lastName}</h1>
      <p>Correo: {user.mail}</p>
      <button onClick={() => (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`)}>Cerrar sesión</button>
    </div>
  );
}
