import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, UserCheck } from 'lucide-react';
import './Termos.css';
import logo from '../assets/Logo.png';

const Termos = () => {
  return (
    <div className="termos-page">
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
            <FileText size={64} />
          </div>
          <h1>Termos de Uso</h1>
          <p className="last-update">Última atualização: 21 de outubro de 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="policy-content">
        <div className="policy-container">
          
          {/* Introdução */}
          <section className="policy-section">
            <div className="section-icon">
              <FileText size={32} />
            </div>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Bem-vindo ao <strong>TEA Map</strong>! Estes Termos de Uso regulam o acesso e a 
              utilização da nossa plataforma colaborativa de mapeamento de espaços acessíveis 
              para pessoas com Transtorno do Espectro Autista (TEA).
            </p>
            <p>
              Ao acessar, navegar ou utilizar qualquer funcionalidade do TEA Map, você declara 
              ter lido, compreendido e concordado com estes Termos de Uso e com nossa 
              <Link to="/privacidade"> Política de Privacidade</Link>. Caso não concorde com 
              qualquer disposição, solicitamos que não utilize nossos serviços.
            </p>
            <div className="info-box">
              <AlertTriangle size={20} />
              <span>
                Recomendamos que você leia estes termos atentamente antes de criar uma conta 
                ou utilizar nossos serviços.
              </span>
            </div>
          </section>

          {/* Definições */}
          <section className="policy-section">
            <div className="section-icon">
              <CheckCircle size={32} />
            </div>
            <h2>2. Definições</h2>
            <p>Para os fins destes Termos, considera-se:</p>
            <ul>
              <li><strong>Plataforma:</strong> O site TEA Map e todos os seus serviços, funcionalidades e conteúdos</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acesse ou utilize a Plataforma</li>
              <li><strong>Conta:</strong> Cadastro pessoal criado pelo Usuário para acessar funcionalidades específicas</li>
              <li><strong>Conteúdo:</strong> Qualquer informação, texto, imagem, avaliação ou dados publicados na Plataforma</li>
              <li><strong>Avaliação:</strong> Comentários, classificações e experiências compartilhadas sobre locais</li>
              <li><strong>Local:</strong> Espaços públicos ou privados cadastrados e avaliados na Plataforma</li>
            </ul>
          </section>

          {/* Cadastro */}
          <section className="policy-section">
            <div className="section-icon">
              <UserCheck size={32} />
            </div>
            <h2>3. Cadastro e Conta de Usuário</h2>
            
            <h3>3.1. Criação de Conta</h3>
            <p>
              Para utilizar determinadas funcionalidades da Plataforma, como avaliar locais e 
              favoritar estabelecimentos, é necessário criar uma conta fornecendo informações 
              verdadeiras, completas e atualizadas.
            </p>

            <h3>3.2. Responsabilidade pela Conta</h3>
            <ul>
              <li>Você é responsável por manter a confidencialidade da sua senha</li>
              <li>Você é responsável por todas as atividades realizadas através da sua conta</li>
              <li>Notifique-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>O TEA Map não se responsabiliza por perdas decorrentes de uso não autorizado da sua conta</li>
            </ul>

            <h3>3.3. Requisitos</h3>
            <ul>
              <li>Você deve ter pelo menos 13 anos de idade</li>
              <li>Menores de 18 anos devem ter autorização dos responsáveis legais</li>
              <li>Cada pessoa pode ter apenas uma conta ativa</li>
              <li>Contas comerciais devem identificar-se adequadamente</li>
            </ul>

            <h3>3.4. Suspensão e Exclusão</h3>
            <p>
              Reservamo-nos o direito de suspender ou excluir contas que violem estes Termos, 
              sem aviso prévio e sem qualquer responsabilidade.
            </p>
          </section>

          {/* Uso da Plataforma */}
          <section className="policy-section">
            <div className="section-icon">
              <CheckCircle size={32} />
            </div>
            <h2>4. Uso Permitido da Plataforma</h2>
            <p>Você concorda em utilizar o TEA Map apenas para:</p>
            <ul>
              <li>Buscar informações sobre locais acessíveis para pessoas com TEA</li>
              <li>Compartilhar experiências genuínas sobre locais que visitou</li>
              <li>Contribuir para uma comunidade inclusiva e colaborativa</li>
              <li>Auxiliar outras pessoas na busca por espaços acessíveis</li>
              <li>Cadastrar locais públicos ou estabelecimentos com permissão</li>
            </ul>
          </section>

          {/* Uso Proibido */}
          <section className="policy-section">
            <div className="section-icon">
              <XCircle size={32} />
            </div>
            <h2>5. Uso Proibido da Plataforma</h2>
            <p>É expressamente proibido:</p>
            <ul>
              <li>Publicar informações falsas, enganosas ou difamatórias</li>
              <li>Realizar avaliações falsas ou manipuladas</li>
              <li>Usar a Plataforma para fins comerciais não autorizados</li>
              <li>Coletar dados de outros usuários sem autorização</li>
              <li>Interferir no funcionamento da Plataforma</li>
              <li>Utilizar bots, scripts ou automações não autorizadas</li>
              <li>Violar direitos de propriedade intelectual</li>
              <li>Publicar conteúdo ofensivo, discriminatório ou ilegal</li>
              <li>Assediar, ameaçar ou intimidar outros usuários</li>
              <li>Tentar acessar áreas restritas da Plataforma</li>
              <li>Transmitir vírus, malware ou códigos maliciosos</li>
              <li>Fazer engenharia reversa ou tentar obter código-fonte</li>
            </ul>
          </section>

          {/* Conteúdo do Usuário */}
          <section className="policy-section">
            <div className="section-icon">
              <FileText size={32} />
            </div>
            <h2>6. Conteúdo Publicado pelo Usuário</h2>
            
            <h3>6.1. Responsabilidade pelo Conteúdo</h3>
            <p>
              Você é o único responsável pelo conteúdo que publica na Plataforma. Ao publicar 
              uma avaliação, comentário ou qualquer informação, você declara que:
            </p>
            <ul>
              <li>O conteúdo é verdadeiro e baseado em experiência pessoal</li>
              <li>Você possui todos os direitos necessários sobre o conteúdo</li>
              <li>O conteúdo não viola direitos de terceiros</li>
              <li>O conteúdo está em conformidade com estes Termos e a legislação aplicável</li>
            </ul>

            <h3>6.2. Licença de Uso</h3>
            <p>
              Ao publicar conteúdo no TEA Map, você nos concede uma licença mundial, 
              não exclusiva, transferível, sublicenciável e gratuita para usar, reproduzir, 
              modificar, adaptar, publicar e exibir esse conteúdo em conexão com os serviços 
              da Plataforma.
            </p>

            <h3>6.3. Moderação de Conteúdo</h3>
            <p>
              Reservamo-nos o direito de revisar, editar ou remover qualquer conteúdo que 
              viole estes Termos ou que consideremos inadequado, sem aviso prévio e sem 
              qualquer responsabilidade.
            </p>

            <h3>6.4. Permanência do Conteúdo</h3>
            <p>
              Avaliações e comentários publicados podem permanecer visíveis mesmo após a 
              exclusão da sua conta, porém serão anonimizados (não vinculados ao seu nome).
            </p>
          </section>

          {/* Propriedade Intelectual */}
          <section className="policy-section">
            <div className="section-icon">
              <Scale size={32} />
            </div>
            <h2>7. Propriedade Intelectual</h2>
            
            <h3>7.1. Direitos do TEA Map</h3>
            <p>
              Todos os direitos de propriedade intelectual relacionados à Plataforma, incluindo 
              mas não limitado a código-fonte, design, layout, textos, gráficos, logos, ícones 
              e funcionalidades, são de propriedade exclusiva do TEA Map ou de seus licenciadores.
            </p>

            <h3>7.2. Uso de Marcas</h3>
            <p>
              O nome "TEA Map", logotipos e outras marcas são protegidos por direitos autorais 
              e marcas registradas. É proibido usar nossas marcas sem autorização prévia por escrito.
            </p>

            <h3>7.3. Denúncia de Violação</h3>
            <p>
              Se você acredita que seu direito autoral foi violado na Plataforma, entre em 
              contato conosco imediatamente através do e-mail: <strong>copyright@teamap.com.br</strong>
            </p>
          </section>

          {/* Isenção */}
          <section className="policy-section">
            <div className="section-icon">
              <AlertTriangle size={32} />
            </div>
            <h2>8. Isenção de Responsabilidade</h2>
            
            <h3>8.1. Conteúdo de Terceiros</h3>
            <p>
              O TEA Map é uma plataforma colaborativa. As avaliações, comentários e informações 
              sobre locais são fornecidas pelos próprios usuários. Não garantimos a precisão, 
              completude ou confiabilidade dessas informações.
            </p>

            <h3>8.2. Uso por Sua Conta e Risco</h3>
            <p>
              Você utiliza a Plataforma por sua conta e risco. Não somos responsáveis por:
            </p>
            <ul>
              <li>Experiências negativas em locais avaliados</li>
              <li>Informações incorretas ou desatualizadas</li>
              <li>Decisões tomadas com base em conteúdo da Plataforma</li>
              <li>Danos diretos ou indiretos decorrentes do uso da Plataforma</li>
              <li>Interrupções, erros ou falhas no serviço</li>
            </ul>

            <h3>8.3. Serviços de Terceiros</h3>
            <p>
              A Plataforma pode conter links para sites ou serviços de terceiros (como Google Maps). 
              Não somos responsáveis pelo conteúdo, políticas ou práticas desses terceiros.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section className="policy-section">
            <div className="section-icon">
              <Scale size={32} />
            </div>
            <h2>9. Limitação de Responsabilidade</h2>
            <p>
              Na máxima extensão permitida por lei, o TEA Map, seus diretores, funcionários, 
              parceiros e afiliados não serão responsáveis por quaisquer danos diretos, indiretos, 
              incidentais, especiais, consequenciais ou punitivos decorrentes de:
            </p>
            <ul>
              <li>Uso ou impossibilidade de uso da Plataforma</li>
              <li>Acesso não autorizado à sua conta ou dados</li>
              <li>Erros, omissões ou inexatidões no conteúdo</li>
              <li>Perda de dados ou informações</li>
              <li>Vírus ou malware transmitidos através da Plataforma</li>
              <li>Conduta de terceiros na Plataforma</li>
            </ul>
          </section>

     
          <section className="policy-section">
            <div className="section-icon">
              <Scale size={32} />
            </div>
            <h2>10. Indenização</h2>
            <p>
              Você concorda em indenizar, defender e isentar o TEA Map, seus diretores, 
              funcionários, parceiros e afiliados de quaisquer reivindicações, danos, 
              obrigações, perdas, responsabilidades, custos e despesas (incluindo honorários 
              advocatícios) decorrentes de:
            </p>
            <ul>
              <li>Violação destes Termos de Uso</li>
              <li>Violação de direitos de terceiros</li>
              <li>Uso indevido da Plataforma</li>
              <li>Conteúdo publicado por você</li>
            </ul>
          </section>

      
          <section className="policy-section">
            <div className="section-icon">
              <AlertTriangle size={32} />
            </div>
            <h2>11. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              Quando houver alterações significativas, notificaremos você através de:
            </p>
            <ul>
              <li>E-mail cadastrado</li>
              <li>Aviso destacado na Plataforma</li>
              <li>Notificação no momento do login</li>
            </ul>
            <p>
              O uso continuado da Plataforma após as alterações constitui aceitação dos 
              novos termos. Se você não concordar, deve cessar o uso imediatamente.
            </p>
          </section>

         
          <section className="policy-section">
            <div className="section-icon">
              <XCircle size={32} />
            </div>
            <h2>12. Rescisão</h2>
            
            <h3>12.1. Por Você</h3>
            <p>
              Você pode encerrar sua conta a qualquer momento através das configurações ou 
              entrando em contato conosco. Suas avaliações públicas permanecerão visíveis 
              de forma anonimizada.
            </p>

            <h3>12.2. Por Nós</h3>
            <p>
              Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se:
            </p>
            <ul>
              <li>Você violar estes Termos de Uso</li>
              <li>Houver suspeita de atividade fraudulenta</li>
              <li>Recebermos múltiplas denúncias sobre seu comportamento</li>
              <li>For exigido por lei ou ordem judicial</li>
            </ul>

            <h3>12.3. Efeitos da Rescisão</h3>
            <p>
              Após o encerramento da conta, você perderá acesso a todas as funcionalidades 
              que exigem login. Dados pessoais serão tratados conforme nossa Política de Privacidade.
            </p>
          </section>

         
          <section className="policy-section">
            <div className="section-icon">
              <Scale size={32} />
            </div>
            <h2>13. Lei Aplicável e Foro</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, 
              especialmente pela Lei nº 12.965/2014 (Marco Civil da Internet) e pela Lei nº 
              13.709/2018 (LGPD).
            </p>
            <p>
              Fica eleito o foro da Comarca de <strong>[Maceió/Alagoas]</strong> para 
              dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa 
              a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* Disposições Gerais */}
          <section className="policy-section">
            <div className="section-icon">
              <FileText size={32} />
            </div>
            <h2>14. Disposições Gerais</h2>
            
            <h3>14.1. Integralidade</h3>
            <p>
              Estes Termos, juntamente com nossa Política de Privacidade, constituem o acordo 
              completo entre você e o TEA Map.
            </p>

            <h3>14.2. Divisibilidade</h3>
            <p>
              Se qualquer disposição destes Termos for considerada inválida ou inexequível, 
              as demais disposições permanecerão em pleno vigor e efeito.
            </p>

            <h3>14.3. Renúncia</h3>
            <p>
              A falha em exercer qualquer direito previsto nestes Termos não constituirá 
              renúncia a esse direito.
            </p>

            <h3>14.4. Cessão</h3>
            <p>
              Você não pode ceder ou transferir seus direitos sob estes Termos sem nosso 
              consentimento prévio por escrito.
            </p>
          </section>

          {/* Contato */}
          <section className="policy-section contact-section">
            <div className="section-icon">
              <FileText size={32} />
            </div>
            <h2>15. Contato</h2>
            <p>
              Para dúvidas, sugestões ou questões relacionadas a estes Termos de Uso, 
              entre em contato conosco:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>E-mail Geral:</strong> contato@teamap.com.br
              </div>
              <div className="contact-item">
                <strong>E-mail Jurídico:</strong> juridico@teamap.com.br
              </div>
              <div className="contact-item">
                <strong>E-mail para Denúncias:</strong> denuncia@teamap.com.br
              </div>
              <div className="contact-item">
                <strong>Endereço:</strong> [IFAL MACEIÓ - R. Mizael Domingues, 530 - Centro, Maceió - AL, 57020-600]
              </div>
            </div>
            <p>
              Responderemos sua solicitação no menor prazo possível.
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

export default Termos;