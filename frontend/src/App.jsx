import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/login';
import Maincontent from './maincontent';

export default function App() {
  const [user, setUser] = useState(() => {
    // Initialiser l'état utilisateur depuis localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Mettre à jour localStorage quand l'état utilisateur change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Créer une instance de thème
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          {/* Utiliser un joker pour que les routes imbriquées dans Maincontent fonctionnent */}
          <Route path="/app/*" element={<Maincontent user={user} setUser={setUser} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
