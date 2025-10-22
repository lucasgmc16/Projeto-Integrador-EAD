import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Users, MapPin, Star, Lightbulb } from 'lucide-react';
import './QuemSomos.css';
import logo from '../assets/Logo.png';

const QuemSomos = () => {
  const valores = [
    {
      icon: <Heart size={32} />,
      title: 'Inclusão',
      description: 'Acreditamos que toda pessoa tem o direito de participar plenamente da sociedade, sem barreiras.'
    },
    {
      icon: <Users size={32} />,
      title: 'Colaboração',
      description: 'Trabalhamos em rede, unindo famílias, profissionais e instituições por um objetivo comum.'
    },
    {
      icon: <Star size={32} />,
      title: 'Acessibilidade',
      description: 'Promovemos espaços que respeitam as necessidades sensoriais e de comunicação das pessoas com TEA.'
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Inovação',
      description: 'Utilizamos tecnologia para criar soluções práticas que facilitam a vida de milhares de pessoas.'
    },
    {
      icon: <MapPin size={32} />,
      title: 'Transparência',
      description: 'Todas as avaliações são feitas pela comunidade, garantindo informações reais e confiáveis.'
    },
    {
      icon: <Target size={32} />,
      title: 'Empatia',
      description: 'Colocamos as necessidades das pessoas com TEA e suas famílias no centro de tudo que fazemos.'
    }
  ];

  return (
    <div className="quem-somos-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="TEA Map" className="logo-image" />
          </Link>
          
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/parceiros">Parceiros</Link>
            <Link to="/quem-somos" className="active">Quem Somos</Link>
            <Link to="/mapatea">
              <button className="btn-primary">Mapa Tea</button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Sobre o TEA Map</h1>
          <p className="hero-subtitle">
            Mapeando a inclusão, construindo acessibilidade
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="historia-section">
        <div className="section-container">
          <div className="historia-content">
            <div className="historia-text">
              <h2>Nossa História</h2>
              <p>
                O <strong>TEA Map</strong> nasceu de uma necessidade real: facilitar o acesso 
                de pessoas com Transtorno do Espectro Autista (TEA) a espaços públicos que 
                verdadeiramente as acolham.
              </p>
              <p>
                Sabemos que encontrar ambientes adequados, com baixo ruído, iluminação 
                apropriada e profissionais preparados, pode ser um desafio diário para 
                famílias e pessoas com TEA. Foi pensando nisso que criamos uma plataforma 
                colaborativa onde a própria comunidade compartilha experiências, avalia locais 
                e ajuda outras pessoas a descobrirem espaços verdadeiramente inclusivos.
              </p>
              <p>
                Inspirados pelos princípios da <strong>acessibilidade universal</strong> e pelos 
                <strong> Objetivos de Desenvolvimento Sustentável da ONU</strong>, trabalhamos 
                em rede com instituições, empresas e organizações comprometidas com a diversidade 
                e a inclusão.
              </p>
            </div>
            <div className="historia-image">
              <img 
                src="https://t.ctcdn.com.br/K4vjrJpTY7xRlfYBN3Br8fRK3Ts=/1200x675/smart/i445726.jpeg" 
                alt="Comunidade TEA Map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="mvv-section">
        <div className="section-container">
          <div className="mvv-grid">
            {/* Missão */}
            <div className="mvv-card missao">
              <div className="mvv-icon">
                <Target size={40} />
              </div>
              <h3>Nossa Missão</h3>
              <p>
                Criar um mapa colaborativo de inclusão que conecte pessoas com TEA 
                a espaços acessíveis e acolhedores, promovendo a autonomia, a participação 
                social e o bem-estar de toda a comunidade.
              </p>
            </div>

            {/* Visão */}
            <div className="mvv-card visao">
              <div className="mvv-icon">
                <Eye size={40} />
              </div>
              <h3>Nossa Visão</h3>
              <p>
                Ser a principal referência em mapeamento de espaços inclusivos para 
                pessoas com TEA no Brasil, construindo uma sociedade onde a acessibilidade 
                sensorial e a inclusão sejam padrão em todos os ambientes públicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="valores-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nossos Valores</h2>
            <p>Os princípios que guiam cada ação do TEA Map</p>
          </div>

          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <div className="valor-icon">
                  {valor.icon}
                </div>
                <h4>{valor.title}</h4>
                <p>{valor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="como-funciona-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Como Funciona</h2>
            <p>Descubra como o TEA Map está transformando a inclusão</p>
          </div>

          <div className="funciona-grid">
            <div className="funciona-card">
              <div className="step-number">1</div>
              <h4>Explore o Mapa</h4>
              <p>
                Navegue pelo mapa interativo e descubra espaços públicos próximos 
                a você, com informações sobre acessibilidade sensorial.
              </p>
            </div>

            <div className="funciona-card">
              <div className="step-number">2</div>
              <h4>Avalie e Compartilhe</h4>
              <p>
                Compartilhe sua experiência! Avalie locais com base em critérios 
                de acolhimento, ruído, iluminação e recursos de inclusão.
              </p>
            </div>

            <div className="funciona-card">
              <div className="step-number">3</div>
              <h4>Cadastre Novos Locais</h4>
              <p>
                Encontrou um espaço inclusivo? Cadastre no mapa e ajude outras 
                famílias a descobrirem ambientes acolhedores.
              </p>
            </div>

            <div className="funciona-card">
              <div className="step-number">4</div>
              <h4>Construa Comunidade</h4>
              <p>
                Faça parte de uma rede colaborativa que trabalha todos os dias 
                para tornar o mundo mais acessível e inclusivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="impacto-section">
        <div className="section-container">
          <div className="impacto-content">
            <h2>Nosso Impacto</h2>
            <p>
              Cada avaliação, cada local cadastrado, cada história compartilhada contribui 
              para construir uma sociedade mais consciente e empática. O TEA Map não é apenas 
              uma plataforma, é um movimento por inclusão real.
            </p>

            <div className="impacto-stats">
              <div className="stat">
                <h3>100+</h3>
                <p>Locais cadastrados</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Avaliações feitas</p>
              </div>
              <div className="stat">
                <h3>20+</h3>
                <p>Parceiros ativos</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>Cidades alcançadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Faça Parte Dessa Jornada</h2>
          <p>Junte-se a nós e ajude a construir um mundo mais acessível para todos</p>
          <div className="cta-buttons">
            <Link to="/cadastro" className="btn-cta-primary">
              Criar conta grátis
            </Link>
            <Link to="/mapatea" className="btn-cta-secondary">
              Explorar o mapa
            </Link>
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

export default QuemSomos;