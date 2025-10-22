import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import './EsqueceuSenha.css';
import logo from '../assets/Logo.png';

const EsqueceuSenha = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, digite seu email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    // Simula envio
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log('Email para recuperação enviado para:', email);
    }, 1500);
  };

  return (
    <div className="forgot-password-page">
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

      {/* Content */}
      <main className="forgot-password-content">
        <div className="forgot-password-container">
          {!success ? (
            <div className="forgot-password-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Mail size={40} />
                </div>
                <h1>Esqueceu sua senha?</h1>
                <p>
                  Não se preocupe! Digite seu email e enviaremos 
                  um link para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="forgot-form">
                <div className="form-group">
                  <label htmlFor="email">Email cadastrado</label>
                  <div className={`input-wrapper ${error ? 'error' : ''}`}>
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      disabled={loading}
                    />
                  </div>
                  {error && <span className="error-message">{error}</span>}
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar link de recuperação
                    </>
                  )}
                </button>

                <Link to="/login" className="back-link">
                  <ArrowLeft size={18} />
                  Voltar para o login
                </Link>
              </form>
            </div>
          ) : (
            <div className="success-card">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h1>Email enviado!</h1>
              <p>
                Enviamos um link de recuperação para <strong>{email}</strong>
              </p>
              <p className="instruction">
                Verifique sua caixa de entrada e siga as instruções 
                para redefinir sua senha.
              </p>
              
              <div className="success-actions">
                <Link to="/login" className="btn-back-login">
                  Voltar para o login
                </Link>
                
                <button 
                  className="btn-resend"
                  onClick={() => setSuccess(false)}
                >
                  Reenviar email
                </button>
              </div>

              <p className="help-text">
                Não recebeu o email? Verifique sua pasta de spam ou 
                tente novamente.
              </p>
            </div>
          )}
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

export default EsqueceuSenha;