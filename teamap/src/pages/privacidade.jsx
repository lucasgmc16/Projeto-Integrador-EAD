import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Users, AlertCircle } from 'lucide-react';
import './Privacidade.css';
import logo from '../assets/Logo.png';

const Privacidade = () => {
  return (
    <div className="privacidade-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="TEA Map" className="logo-image" />
          </Link>
          
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/parceiros">Parceiros</Link>
            <Link to="/quem-somos">Quem Somos</Link>
            <Link to="/mapatea">
              <button className="btn-primary">Mapa Tea</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="policy-hero">
        <div className="policy-container">
          <div className="hero-icon">
            <Shield size={64} />
          </div>
          <h1>Política de Privacidade</h1>
          <p className="last-update">Última atualização: 21 de outubro de 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="policy-content">
        <div className="policy-container">
          
          {/* Introdução */}
          <section className="policy-section">
            <div className="section-icon">
              <Eye size={32} />
            </div>
            <h2>1. Introdução</h2>
            <p>
              O <strong>TEA Map</strong> está comprometido com a proteção da privacidade e 
              segurança dos dados pessoais de todos os usuários da nossa plataforma. Esta 
              Política de Privacidade descreve como coletamos, usamos, armazenamos e 
              protegemos suas informações pessoais em conformidade com a Lei Geral de 
              Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            <p>
              Ao utilizar o TEA Map, você concorda com os termos descritos nesta política. 
              Caso não concorde, pedimos que não utilize nossos serviços.
            </p>
          </section>

          {/* Dados Coletados */}
          <section className="policy-section">
            <div className="section-icon">
              <Database size={32} />
            </div>
            <h2>2. Dados que Coletamos</h2>
            
            <h3>2.1. Dados Fornecidos por Você</h3>
            <ul>
              <li><strong>Informações de Cadastro:</strong> Nome, e-mail, senha (criptografada)</li>
              <li><strong>Avaliações:</strong> Comentários, classificações e experiências compartilhadas sobre locais</li>
              <li><strong>Preferências:</strong> Locais favoritados, filtros de busca utilizados</li>
              <li><strong>Comunicações:</strong> Mensagens enviadas através de formulários de contato</li>
            </ul>

            <h3>2.2. Dados Coletados Automaticamente</h3>
            <ul>
              <li><strong>Dados de Navegação:</strong> Páginas visitadas, tempo de permanência, cliques</li>
              <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional, dispositivo</li>
              <li><strong>Geolocalização:</strong> Localização aproximada (apenas se você autorizar) para mostrar locais próximos</li>
              <li><strong>Cookies:</strong> Pequenos arquivos armazenados para melhorar sua experiência</li>
            </ul>

            <h3>2.3. Dados de Terceiros</h3>
            <ul>
              <li><strong>Google Maps:</strong> Informações de locais públicos disponíveis no Google Places API</li>
              <li><strong>Login Social:</strong> Se você optar por fazer login com redes sociais, coletamos apenas informações públicas básicas</li>
            </ul>
          </section>

          {/* Como Usamos */}
          <section className="policy-section">
            <div className="section-icon">
              <Users size={32} />
            </div>
            <h2>3. Como Usamos Seus Dados</h2>
            <p>Utilizamos suas informações pessoais para:</p>
            <ul>
              <li><strong>Prestação de Serviços:</strong> Fornecer acesso ao mapa colaborativo e suas funcionalidades</li>
              <li><strong>Personalização:</strong> Adaptar a experiência conforme suas preferências e histórico</li>
              <li><strong>Comunicação:</strong> Enviar notificações importantes, atualizações e responder suas dúvidas</li>
              <li><strong>Segurança:</strong> Proteger contra fraudes, abusos e atividades maliciosas</li>
              <li><strong>Melhorias:</strong> Analisar uso da plataforma para aprimorar funcionalidades</li>
              <li><strong>Cumprimento Legal:</strong> Atender requisitos legais e regulatórios quando necessário</li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section className="policy-section">
            <div className="section-icon">
              <Lock size={32} />
            </div>
            <h2>4. Compartilhamento de Dados</h2>
            <p>
              <strong>Não vendemos seus dados pessoais.</strong> Podemos compartilhar informações 
              apenas nas seguintes situações:
            </p>
            <ul>
              <li><strong>Avaliações Públicas:</strong> Seus comentários e avaliações são visíveis publicamente para ajudar outros usuários</li>
              <li><strong>Prestadores de Serviço:</strong> Empresas que nos auxiliam (hospedagem, análise de dados) sob rigorosos contratos de confidencialidade</li>
              <li><strong>Parceiros:</strong> Instituições parceiras podem ter acesso a dados agregados e anonimizados para fins estatísticos</li>
              <li><strong>Requisitos Legais:</strong> Autoridades quando exigido por lei ou para proteger direitos legais</li>
              <li><strong>Consentimento:</strong> Outras situações com sua autorização expressa</li>
            </ul>
          </section>

          {/* Segurança */}
          <section className="policy-section">
            <div className="section-icon">
              <Shield size={32} />
            </div>
            <h2>5. Segurança dos Dados</h2>
            <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <ul>
              <li><strong>Criptografia:</strong> Senhas e dados sensíveis são criptografados</li>
              <li><strong>HTTPS:</strong> Toda comunicação com o site é protegida por SSL/TLS</li>
              <li><strong>Acesso Restrito:</strong> Apenas colaboradores autorizados têm acesso aos dados</li>
              <li><strong>Backup Regular:</strong> Cópias de segurança para prevenir perdas</li>
              <li><strong>Monitoramento:</strong> Sistemas de detecção de ameaças e vulnerabilidades</li>
            </ul>
            <p className="alert-box">
              <AlertCircle size={20} />
              <span>
                Apesar de todos os esforços, nenhum sistema é 100% seguro. Recomendamos 
                que você mantenha sua senha segura e não a compartilhe.
              </span>
            </p>
          </section>

          {/* Seus Direitos */}
          <section className="policy-section">
            <div className="section-icon">
              <Users size={32} />
            </div>
            <h2>6. Seus Direitos (LGPD)</h2>
            <p>De acordo com a LGPD, você tem direito a:</p>
            <ul>
              <li><strong>Acesso:</strong> Confirmar se tratamos seus dados e solicitar cópia</li>
              <li><strong>Correção:</strong> Atualizar dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização:</strong> Solicitar que seus dados sejam tornados anônimos</li>
              <li><strong>Exclusão:</strong> Deletar dados desnecessários ou tratados em desconformidade</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se a tratamento realizado com base em interesse legítimo</li>
              <li><strong>Informação:</strong> Conhecer entidades com as quais compartilhamos dados</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato conosco através do e-mail: 
              <strong> privacidade@teamap.com.br</strong>
            </p>
          </section>

          {/* Cookies */}
          <section className="policy-section">
            <div className="section-icon">
              <Database size={32} />
            </div>
            <h2>7. Cookies e Tecnologias Similares</h2>
            <p>Utilizamos cookies para melhorar sua experiência:</p>
            <ul>
              <li><strong>Cookies Essenciais:</strong> Necessários para funcionamento básico (ex: manter login)</li>
              <li><strong>Cookies de Desempenho:</strong> Coletam informações sobre uso do site</li>
              <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências</li>
              <li><strong>Cookies de Publicidade:</strong> Não utilizamos para rastreamento publicitário</li>
            </ul>
            <p>
              Você pode gerenciar cookies nas configurações do seu navegador, mas isso pode 
              afetar algumas funcionalidades do site.
            </p>
          </section>

          {/* Menores */}
          <section className="policy-section">
            <div className="section-icon">
              <AlertCircle size={32} />
            </div>
            <h2>8. Menores de Idade</h2>
            <p>
              O TEA Map pode ser utilizado por menores de 18 anos, desde que sob supervisão 
              de pais ou responsáveis. Não coletamos intencionalmente dados de crianças 
              menores de 13 anos sem consentimento dos responsáveis.
            </p>
            <p>
              Se você acredita que coletamos dados de uma criança indevidamente, entre em 
              contato conosco imediatamente para que possamos tomar as medidas necessárias.
            </p>
          </section>

          {/* Retenção */}
          <section className="policy-section">
            <div className="section-icon">
              <Database size={32} />
            </div>
            <h2>9. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as 
              finalidades descritas nesta política, respeitando prazos legais de retenção:
            </p>
            <ul>
              <li><strong>Dados de Cadastro:</strong> Enquanto sua conta estiver ativa</li>
              <li><strong>Avaliações:</strong> Mantidas publicamente mesmo após exclusão da conta (anonimizadas)</li>
              <li><strong>Logs de Acesso:</strong> 6 meses para fins de segurança</li>
              <li><strong>Dados Financeiros:</strong> 5 anos conforme legislação tributária</li>
            </ul>
            <p>
              Após esses períodos, seus dados serão excluídos ou anonimizados de forma irreversível.
            </p>
          </section>

          {/* Alterações */}
          <section className="policy-section">
            <div className="section-icon">
              <AlertCircle size={32} />
            </div>
            <h2>10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente para refletir 
              mudanças em nossas práticas ou por requisitos legais. Quando houver alterações 
              significativas, notificaremos você por e-mail ou através de aviso destacado no site.
            </p>
            <p>
              Recomendamos que você revise esta política regularmente. O uso continuado do 
              TEA Map após alterações constitui aceitação das novas condições.
            </p>
          </section>

          {/* Contato */}
          <section className="policy-section contact-section">
            <div className="section-icon">
              <Users size={32} />
            </div>
            <h2>11. Contato</h2>
            <p>
              Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos, 
              entre em contato conosco:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>E-mail:</strong> privacidade@teamap.com.br
              </div>
              <div className="contact-item">
                <strong>Encarregado de Dados (DPO):</strong> dpo@teamap.com.br
              </div>
              <div className="contact-item">
                <strong>Endereço:</strong> [IFAL MACEIÓ - R. Mizael Domingues, 530 - Centro, Maceió - AL, 57020-600]
              </div>
            </div>
            <p>
              Responderemos sua solicitação em até 15 dias úteis, conforme estabelecido pela LGPD.
            </p>
          </section>

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

export default Privacidade;