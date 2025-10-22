import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import './Login.css';
import logo from '../assets/Logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Login data:', formData);
      // API
      alert('Login realizado! (Front-end only)');
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="TEA Map" className="logo-image" />
          </Link>
          
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/mapatea">Mapa Tea</Link>
          </nav>
        </div>
      </header>

      {/* Login Content */}
      <main className="login-content">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                <LogIn size={32} />
              </div>
              <h1>Bem-vindo de volta!</h1>
              <p>Entre com sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

          
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Lembrar de mim</span>
                </label>
                <Link to="/esqueceusenha" className="forgot-password">
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-login">
                Entrar
              </button>

              {/* Divider */}
              <div className="divider">
                <span>ou</span>
              </div>

              {/* Register Link */}
              <div className="register-section">
                <p>Não tem uma conta?</p>
                <Link to="/cadastro" className="btn-register">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </div>

          {/* Side Image/Info */}
          <div className="login-side">
            <div className="side-content">
              <h2>Faça parte da comunidade TEA Map</h2>
              <ul className="benefits-list">
                <li>✓ Avalie e compartilhe experiências</li>
                <li>✓ Cadastre novos locais inclusivos</li>
                <li>✓ Salve seus lugares favoritos</li>
                <li>✓ Contribua para uma comunidade mais inclusiva</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="TEA Map" className="logo-image" />
            </Link>
          </div>
          
          <div className="footer-links">
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/termos">Termos de Uso</Link>
          </div>
          
          <div className="footer-copyright">
            © 2025 Todos os direitos reservados
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;