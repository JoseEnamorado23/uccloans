import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth'; // ← NUEVO
import { authService } from './services/authService'; // ← NUEVO
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import NewLoan from './pages/NewLoan';
import Prestamos from './pages/Prestamos';
import Implementos from './pages/Implementos';
import Activos from './pages/Activos';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import GestionUsuarios from './pages/GestionUsuarios';
import GestionProgramas from './components/programas/GestionProgramas';

// 🆕 NUEVAS PÁGINAS DE USUARIO
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import CreatePassword from './pages/CreatePassword';


// Componente para rutas protegidas de admin
const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.checkAdminSession();
        setIsAuthenticated(result.success);
      } catch (error) {
        console.warn('Error verificando sesión de admin:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verificando sesión...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

// Componente para rutas protegidas de usuario
const UserRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/user/login" replace />;
};

function App() {
  return (
    <AuthProvider> {/* ← NUEVO: Envolver con AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            {/* 🏠 RUTAS PÚBLICAS */}
            <Route path="/" element={<HomePage />} />
            
            {/* 🔐 RUTAS DE AUTENTICACIÓN */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/user/register" element={<UserRegister />} /> {/* ← NUEVO */}
            <Route path="/user/login" element={<UserLogin />} /> {/* ← NUEVO */}
            <Route path="/user/forgot-password" element={<ForgotPassword />} /> {/* ← NUEVO */}

            {/* 🔄 RUTAS DE RECUPERACIÓN Y VERIFICACIÓN */}
            <Route path="/user/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/user/reset-password/:token" element={<ResetPassword />} />
            <Route path="/user/create-password/:token" element={<CreatePassword />} />
            
            {/* 💼 DASHBOARD PROTEGIDO (ADMIN) */}
            <Route 
              path="/dashboard/*" 
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            >
              <Route index element={<NewLoan />} />
              <Route path="prestamos" element={<Prestamos />} />
              <Route path="implementos" element={<Implementos />} />
              <Route path="activos" element={<Activos />} />
              <Route path="gestion-usuarios" element={<GestionUsuarios />} />
              <Route path="gestion-programas" element={<GestionProgramas />} />
            </Route>
            
            {/* 👤 RUTAS DE USUARIO PROTEGIDAS */}
            <Route 
              path="/user/profile" 
              element={
                <UserRoute>
                  <UserProfile />
                </UserRoute>
              } 
            /> {/* ← NUEVO */}
            
            {/* 🔄 Redirigir rutas no encontradas al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;