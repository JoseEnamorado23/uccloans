// HomePage.jsx - Versión corregida
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon, 
  Sun,
  Download,
  BookOpen,
  Mail,
  User,
  LogIn,
  Package,
  Truck,
  CheckCircle,
  Smartphone,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  X
} from "lucide-react";
import './HomePage.css';

// Importar las imágenes desde assets
import Image1 from '../../public/cards1.jpg';
import Image2 from '../../public/guitar.jpg';
import Image3 from '../../public/jenga.jpg';
import Image4 from '../../public/onecards.jpg';
import logo from '../../public/logo1.svg';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Array de imágenes para el carrusel
  const carouselImages = [
    { src: Image1, alt: "Estudiantes utilizando implementos deportivos" },
    { src: Image2, alt: "Implementos deportivos disponibles" },
    { src: Image3, alt: "Actividades deportivas universitarias" },
    { src: Image4, alt: "Comunidad universitaria" }
  ].filter(item => item.src);

  // Pasos para "Cómo usarlo"
  const usageSteps = [
    { icon: User, title: "Registrarse", description: "Crea tu cuenta con datos universitarios válidos" },
    { icon: Mail, title: "Validar Correo", description: "Confirma tu dirección de correo electrónico" },
    { icon: LogIn, title: "Iniciar Sesión", description: "Accede a tu cuenta verificada" },
    { icon: Package, title: "Solicitar Préstamo", description: "Selecciona el implemento que necesitas" },
    { icon: Truck, title: "Recoger", description: "Retira el implemento en el punto designado" },
    { icon: CheckCircle, title: "Devolver", description: "Regresa el implemento en buen estado y a tiempo" }
  ];

  // Reglas de uso
  const usageRules = [
    "Tiempo máximo de préstamo establecido por administración",
    "El tiempo solo se cuenta después de 1 hora de uso",
    "Posibilidad de bloqueo por entregas tardías",
    "Prohibido sacar implementos de las instalaciones universitarias",
    "Límite de un implemento por usuario simultáneamente",
    "Datos de registro deben ser reales y verificables",
    "Responsabilidad total por daños o pérdidas del implemento",
    "Respetar los horarios establecidos para préstamos y devoluciones"
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play del carrusel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const leftContent = document.querySelector('.container__left');
      if (leftContent) {
        leftContent.style.opacity = '1';
        leftContent.style.transform = 'translateY(0)';
      }
    }, 300);

    const timer2 = setTimeout(() => {
      const rightContent = document.querySelector('.container__right');
      if (rightContent) {
        rightContent.style.opacity = '1';
        rightContent.style.transform = 'translateY(0)';
      }
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`home-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navegación */}
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav__header">
          <div className="nav__logo">
            <Link to="/" className="logo-container">
              <div className="logo-svg-container">
                <img 
                  src={logo}
                  alt="UCC LOANS Logo" 
                  className="logo-svg"
                />
              </div>
              <div className="logo-text-container">
                <span className="logo-text">UCC LOANS</span>
              </div>
            </Link>
          </div>
          
          <div className="nav__controls">
            <button 
              className="nav__menu__btn" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <ul className={`nav__links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>INICIO</Link></li>
          <li><a href="#how-to-use" onClick={closeMenu}>CÓMO USARLO</a></li>
          <li><a href="#rules" onClick={closeMenu}>REGLAS</a></li>
          <li><a href="#download" onClick={closeMenu}>DESCARGA LA APP</a></li>
        </ul>

        <div className="nav__btns">
          <Link to="/user/login" className="btn login-btn">
            Iniciar Sesión
          </Link>
          <Link to="/user/register" className="btn register-btn">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Botón de modo oscuro/claro fijo */}
      <button 
        className="floating-theme-toggle"
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Sección Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="container__left">
            <h1>Sistema de Préstamos Universitarios</h1>
            <p>Gestión de implementos de bienestar para la comunidad universitaria</p>
            <div className="container__btn">
              <Link to="/user/register" className="btn primary-btn">
                COMENZAR AHORA
              </Link>
            </div>
          </div>

          <div className="container__right">
            <div className="carousel-container">
              <div className="carousel">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-slide ${
                      index === currentSlide
                        ? 'active'
                        : index === (currentSlide - 1 + carouselImages.length) % carouselImages.length
                        ? 'prev'
                        : index === (currentSlide + 1) % carouselImages.length
                        ? 'next'
                        : ''
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="carousel-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Cómo Usarlo */}
      <section id="how-to-use" className="section how-to-use-section">
        <div className="container">
          <h2 className="section-title">Cómo Usar el Sistema</h2>
          <div className="steps-grid">
            {usageSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="step-card">
                  <div className="step-icon">
                    <IconComponent size={48} />
                  </div>
                  <div className="step-number">{index + 1}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección Reglas de Uso */}
      <section id="rules" className="section rules-section">
        <div className="container">
          <h2 className="section-title">Reglas de Uso</h2>
          <div className="rules-grid">
            {usageRules.map((rule, index) => (
              <div key={index} className="rule-card">
                <BookOpen size={24} className="rule-icon" />
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Descarga la App */}
      <section id="download" className="section download-section">
        <div className="container">
          <div className="download-content">
            <div className="download-text">
              <h2 className="section-title">Descarga Nuestra App</h2>
              <p>Accede a los préstamos desde tu dispositivo móvil</p>
              <div className="download-buttons">
                <button className="btn download-btn">
                  <Download size={20} />
                  Descargar para Android
                </button>
                <button className="btn download-btn">
                  <Download size={20} />
                  Descargar para iOS
                </button>
              </div>
            </div>
            <div className="download-image">
              <div className="app-mockup">
                <Smartphone size={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo-container">
                <div className="logo-svg-container">
                  <img src={logo} alt="UCC LOANS Logo" className="logo-svg" />
                </div>
                <div className="logo-text-container">
                  <span className="logo-text">UCC LOANS</span>
                </div>
              </div>
              <p>Sistema de préstamos universitarios para la comunidad UCC</p>
            </div>
            
            <div className="footer-section">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#how-to-use">Cómo Usarlo</a></li>
                <li><a href="#rules">Reglas</a></li>
                <li><a href="#download">Descargar App</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Política de Privacidad</a></li>
                <li><a href="#">Términos de Uso</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Síguenos</h4>
              <div className="socials">
                <a href="#" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 UCC LOANS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;