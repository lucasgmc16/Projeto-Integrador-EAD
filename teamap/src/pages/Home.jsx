import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Search } from 'lucide-react';
import './Home.css';
import logo from '../assets/Logo.png'
import banner from '../assets/Banner1.png'

const Home = () => {
  return (
    <div className="landing-page">
      {/* Header/Navbar */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/">
            <img src={logo} alt="TEA Map" className="logo-image" /></Link>
           
          </div>
          
          <nav className="nav">
            <Link to="parceiros">Parceiros</Link>
            <Link to="quem-somos">Quem Somos</Link>
            <Link to="/mapatea">
            <button className="btn-primary">Mapa Tea</button></Link>
          </nav>
        </div>
      </header>

   
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Mapa da Inclusão</h1>
            <p>
              Encontre, avalie e compartilhe<br />
              espaços acessíveis para pessoas com TEA.
            </p>
          </div>
          
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="puzzle-heart">
                <img src={banner}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-card card-teal">
            <div className="feature-icon">
              <MapPin size={48} strokeWidth={2} />
            </div>
            <h3>Explore o Mapa da Inclusão</h3>
            <p>
              Descubra espaços públicos acessíveis e acolhedores para pessoas com TEA.
            </p>
            <p>
              Nosso mapa interativo usa geolocalização para mostrar pontos próximos a você, com informações sobre estrutura, ambiente e acolhimento sensorial.
            </p>
          </div>

          <div className="feature-card card-orange">
            <div className="feature-icon">
              <Users size={48} strokeWidth={2} />
            </div>
            <h3>Avalie e Compartilhe Experiências</h3>
            <p>
              Aqui, cada pessoa pode contribuir!
            </p>
            <p>
              Cadastre novos locais, avalie o nível de acessibilidade e compartilhe sua experiência para ajudar outras famílias e profissionais a encontrar ambientes realmente inclusivos.
            </p>
          </div>

          <div className="feature-card card-blue">
            <div className="feature-icon">
              <Search size={48} strokeWidth={2} />
            </div>
            <h3>Encontre o Lugar Ideal para Você</h3>
            <p>
              Use nossos filtros de busca para localizar espaços de acordo com suas necessidades.
            </p>
            <p>
              Busque por nível de acolhimento, conforto sensorial ou recursos de inclusão e veja o ranking dos locais mais bem avaliados pela comunidade.
            </p>
          </div>
        </div>
      </section>

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

export default Home;