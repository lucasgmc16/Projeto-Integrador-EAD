import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Heart, Globe, Users } from 'lucide-react';
import './Parceiros.css';
import logo from '../assets/Logo.png'

const Parceiros = () => {
  // Array de parceiros 
  const parceiros = [
    { id: 1, name: 'IFAL', logo: '/assets/ifalLogo.png' },
    { id: 2, name: 'Parceiro 2', logo: '/assets/governoLogo.png' },
    { id: 3, name: 'Parceiro 3', logo: '/assets/prefeituraLogo.png' },
    { id: 4, name: 'Parceiro 4', logo: 'https://via.placeholder.com/200x100?text=Parceiro+4' },
    { id: 5, name: 'Parceiro 5', logo: 'https://via.placeholder.com/200x100?text=Parceiro+5' },
    { id: 6, name: 'Parceiro 6', logo: 'https://via.placeholder.com/200x100?text=Parceiro+6' },
    { id: 7, name: 'Parceiro 7', logo: 'https://via.placeholder.com/200x100?text=Parceiro+7' },
    { id: 8, name: 'Parceiro 8', logo: 'https://via.placeholder.com/200x100?text=Parceiro+8' },
  ];

  return (
    <div className="parceiros-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="TEA Map" className="logo-image" />
          </Link>
          
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/parceiros" className="active">Parceiros</Link>
            <Link to="/quem-somos">Quem Somos</Link>
            <Link to="/mapatea">
              <button className="btn-primary">Mapa Tea</button>
            </Link>
          </nav>
        </div>
      </header>

    
      <section className="parceiros-hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1>O Futuro é Coletivo</h1>
            <div className="text-content">
              <p>
                Inspirado pelos princípios da acessibilidade universal e pelos 
                Objetivos de Desenvolvimento Sustentável da ONU, o TEAmap atua 
                em rede com instituições, empresas, organizações e iniciativas 
                sociais comprometidas com a diversidade e a inclusão.
              </p>
              <p>
                Essas parcerias fortalecem comunidades, ampliam o acesso a 
                espaços inclusivos, estimulam o diálogo e criam oportunidades 
                para uma sociedade mais consciente e empática.
              </p>
              <p>
                Trabalhar em conjunto é o que torna o TEAmap possível, cada 
                parceiro é parte essencial dessa jornada por um mundo mais 
                acessível para todas as pessoas.
              </p>
              <p className="highlight">
                Conheça nossos parceiros, descubra as iniciativas que estamos 
                apoiando em todo o país e saiba como fazer parte dessa rede de 
                inclusão e colaboração.
              </p>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-wrapper">
              {/* Substitua pela imagem real */}
              <img 
                src="https://rwn360.com.br/wp-content/uploads/2024/04/autismo-1-768x513-1.jpg" 
                alt="Pessoas colaborando" 
              />
              <div className="image-overlay">
                <Handshake size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <h3>10+</h3>
            <p>Parceiros ativos</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Globe size={32} />
            </div>
            <h3>10+</h3>
            <p>Cidades alcançadas</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={32} />
            </div>
            <h3>50+</h3>
            <p>Locais cadastrados</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Handshake size={32} />
            </div>
            <h3>100%</h3>
            <p>Compromisso com inclusão</p>
          </div>
        </div>
      </section>

      {/* Parceiros Grid */}
      <section className="parceiros-grid-section">
        <div className="section-header">
          <h2>Nossos Parceiros</h2>
          <p>Juntos por um mundo mais inclusivo e acessível</p>
        </div>

        <div className="parceiros-grid">
          
          {parceiros.map((parceiro) => (
            <div key={parceiro.id} className="parceiro-card">
              <div className="parceiro-logo-wrapper">
                <img 
                  src={parceiro.logo} 
                  alt={parceiro.name}
                  className="parceiro-logo"
                />
              </div>
            </div>
          ))}
          
        </div>

        {/* CTA para se tornar parceiro */}
        <div className="cta-section">
          <div className="cta-card">
            <Handshake size={48} />
            <h3>Quer se tornar um parceiro?</h3>
            <p>
              Junte-se a nós nessa missão de tornar o mundo mais acessível 
              e inclusivo para pessoas com TEA.
            </p>
            <button className="btn-cta">Entre em contato</button>
          </div>
        </div>
      </section>

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

export default Parceiros;