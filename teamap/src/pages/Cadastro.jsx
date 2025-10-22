import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import './Cadastro.css';
import logo from '../assets/Logo.png';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Cadastro data:', formData);
      alert('Cadastro realizado! (Front-end only)');
    }
  };

  return (
    <div className="cadastro-page">
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

      <main className="cadastro-content">
        <div className="cadastro-container">
          <div className="cadastro-card">
            <div className="cadastro-header">
              <div className="cadastro-icon">
                <UserPlus size={32} />
              </div>
              <h1>Criar uma conta</h1>
              <p>Junte-se à comunidade TEA Map</p>
            </div>

            <form onSubmit={handleSubmit} className="cadastro-form">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">Nome completo</label>
                <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

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

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Terms */}
              <div className="terms-section">
                <label className="terms-checkbox">
                  <input type="checkbox" required />
                  <span>
                    Concordo com os{' '}
                    <Link to="/termos">Termos de Uso</Link>
                    {' '}e{' '}
                    <Link to="/privacidade">Política de Privacidade</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-cadastro">
                Criar conta
              </button>

              {/* Divider */}
              <div className="divider">
                <span>ou</span>
              </div>

              {/* Login Link */}
              <div className="login-section">
                <p>Já tem uma conta?</p>
                <Link to="/login" className="btn-login-link">
                  Entrar
                </Link>
              </div>
            </form>
          </div>

          {/* Side Info */}
          <div className="cadastro-side">
            <div className="side-content">
              <h2>Junte-se a nós e faça a diferença!</h2>
              <ul className="benefits-list">
                <li>✓ Cadastre locais inclusivos</li>
                <li>✓ Compartilhe suas experiências</li>
                <li>✓ Ajude outras famílias</li>
                <li>✓ Construa uma comunidade mais acessível</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

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

export default Cadastro;