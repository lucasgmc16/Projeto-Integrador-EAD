import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Loader2 } from 'lucide-react';
import './Cadastro.css';
import logo from '../assets/Logo.png';
import { authAPI } from '../services/api'; 

const Cadastro = () => {
  const navigate = useNavigate();
  
  // guarda os dados do form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [apiError, setApiError] = useState(''); 

  // atualiza os campos quando digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // limpa erro do campo que ta sendo editado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError(''); 
    }
  };

  // valida os campos antes de enviar
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

  // envia os dados pro backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // chama a api de cadastro
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.password
      );

      console.log('Cadastro realizado com sucesso:', response);

      alert('Cadastro realizado com sucesso! Você será redirecionado...');

      // manda pro mapa depois de cadastrar
      setTimeout(() => {
        navigate('/mapatea');
      }, 1500);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // mostra erro se der ruim
      setApiError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
      
    } finally {
      setLoading(false); 
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
              {/* mostra erro da api se tiver */}
              {apiError && (
                <div className="alert alert-error">
                  {apiError}
                </div>
              )}

              {/* campo nome */}
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
                    disabled={loading}
                  />
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              {/* campo email */}
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
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* campo senha */}
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
                    disabled={loading}
                  />
                  {/* botao pra mostrar/esconder senha */}
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* confirmar senha */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* checkbox termos */}
              <div className="terms-section">
                <label className="terms-checkbox">
                  <input type="checkbox" required disabled={loading} />
                  <span>
                    Concordo com os{' '}
                    <Link to="/termos">Termos de Uso</Link>
                    {' '}e{' '}
                    <Link to="/privacidade">Política de Privacidade</Link>
                  </span>
                </label>
              </div>

              {/* botao de enviar */}
              <button 
                type="submit" 
                className="btn-cadastro"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spinner" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>

              <div className="divider">
                <span>ou</span>
              </div>

              {/* link pra login se ja tiver conta */}
              <div className="login-section">
                <p>Já tem uma conta?</p>
                <Link to="/login" className="btn-login-link">
                  Entrar
                </Link>
              </div>
            </form>
          </div>

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