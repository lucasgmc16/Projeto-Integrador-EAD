import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Heart, Star, Filter, Search, Plus, X, User, LogOut, Settings, Loader2 } from 'lucide-react';
import './MapPage.css';
import logo from '../assets/Logo.png';
import { authAPI, locaisAPI, avaliacoesAPI } from '../services/api';

const libraries = ['places'];

const MapPage = () => {
  const navigate = useNavigate();
  
  // chave da api do google maps
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDlAPjxU5ImabHaPjiPOu0xqjWta_us5RY';
  
  // carrega a api do google
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NOVO
  const [selectedGooglePlace, setSelectedGooglePlace] = useState(null); // ✅ NOVO
  const placeInputRef = useRef(null);
  const searchInputRef = useRef(null);
  // Controla a autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isAuthenticated());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(authAPI.getUser());
  
  // verifica se ta logado quando abre a pagina
  
  useEffect(() => {
    const user = authAPI.getUser();
    if (user) {
      setIsLoggedIn(true);
      setUserData(user);
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setShowUserMenu(false);
    navigate('/');
  };
  // lista de locais e filtros
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    categoria: 'todas',
    baixoRuido: false,
    iluminacaoSuave: false,
    espacoCalmo: false
  });

  // Função para pegar imagem do Google
  const getPlacePhotoUrl = (place) => {
  // Verificar se há fotos disponíveis
  if (place.photos && place.photos.length > 0) {
    // Pegar a primeira foto
    const photo = place.photos[0];
    return photo.getUrl({ maxWidth: 400 });
  }
  
  // Se não tiver foto, usar imagem padrão
  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400';
};


  // Carrega locais do banco de dados ao iniciar
  const loadLocations = async () => {
  try {
    console.log('🔄 Carregando locais do banco...');
    const response = await locaisAPI.list();
    
    if (response.data && response.data.length > 0) {
      const formattedLocations = response.data.map(local => {
        return {
          id: local.id,
          name: local.nome,
          position: {
            lat: parseFloat(local.latitude),
            lng: parseFloat(local.longitude)
          },
          rating: parseFloat(local.media_avaliacoes) || 0,
          reviews: parseInt(local.total_avaliacoes) || 0,
          image: local.imagem || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
          category: local.categoria,
          isFavorite: false,
          teaRatings: {
            acolhimento: local.tea_ratings?.acolhimento || 3,
            ruidoBaixo: local.tea_ratings?.ruido_baixo || 3,
            iluminacao: local.tea_ratings?.iluminacao || 3,
            espacoCalmo: local.tea_ratings?.espaco_calmo || 3
          }
        };
      });
      
      setLocations(formattedLocations);
      console.log('✅ Locais carregados:', formattedLocations.length);
      console.log('📊 Exemplo de local com ratings:', formattedLocations[0]);
    } else {
      console.log('ℹ️ Nenhum local encontrado no banco');
      setLocations([]);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar locais:', error);
    console.error('Detalhes:', error.response?.data || error.message);
  }
};

useEffect(() => {
  loadLocations();
}, []);


  const [showFilters, setShowFilters] = useState(false);
  // dados do formulário de avaliação
  const [reviewForm, setReviewForm] = useState({
    placeName: '',
    placeAddress: '',
    nivelRuido: 3,
    iluminacao: 'natural',
    cheirosFortes: false,
    movimentoVisual: 'medio',
    espacoCalmo: true,
    banheiroAcessivel: true,
    sinalizacaoVisual: 3,
    mapasRotas: true,
    controleLotacao: 'tranquilo',
    filasPreferenciais: false,
    horariosTranquilos: true,
    mudancasAmbiente: 'baixa',
    agendamentoAntecipado: false,
    temperaturaConfortavel: 3,
    assentosConfortaveis: true,
    espacoPessoal: 'amplo',
    comentario: ''
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };
  // centro do mapa em maceio
  const center = {
    lat: -9.7524,
    lng: -36.6612
  };
  // inicializa o mapa
  const onLoad = useCallback((map) => {
    setMap(map);
    
    if (searchInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'br' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(16);
        }
      });
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleFavorite = (id) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
    ));
  };
  // seleciona um local no mapa
  const handleMarkerClick = (location) => {
    setSelectedPlace(location);
    if (map) {
      map.panTo(location.position);
    }
  };

  // Verifica se esta logado antes de abrir a classificacao
  const handleAddReview = () => {
    if (!authAPI.isAuthenticated()) {
      alert('Você precisa estar logado para avaliar um local!');
      navigate('/login');
      return;
    }

    setShowReviewModal(true);
    
    setTimeout(() => {
      if (placeInputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(placeInputRef.current, {
          componentRestrictions: { country: 'br' }
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setSelectedGooglePlace(place); // ✅ Salvar lugar
            
            setReviewForm({
              ...reviewForm,
              placeName: place.name || '',
              placeAddress: place.formatted_address || ''
            });
            
            if (map) {
              map.panTo(place.geometry.location);
              map.setZoom(16);
            }
          }
        });
      }
    }, 100);
  };

  //  envia a avaliacao pro backend
const submitReview = async (e) => {
  e.preventDefault();
  
  if (isSubmitting) {
    console.log('⏳ Já existe uma submissão em andamento');
    return;
  }

  console.log('🚀 Iniciando envio de avaliação...');
  console.log('📝 reviewForm:', reviewForm);
  console.log('📍 selectedGooglePlace:', selectedGooglePlace);
  
  // Validações básicas
  if (!reviewForm.placeName.trim()) {
    alert('Por favor, preencha o nome do local');
    return;
  }

  if (!selectedGooglePlace || !selectedGooglePlace.geometry) {
    alert('Por favor, selecione um local válido do Google Maps');
    return;
  }

  setIsSubmitting(true);

try {
    const placeImageUrl = getPlacePhotoUrl(selectedGooglePlace);
    console.log('📸 URL da imagem:', placeImageUrl);
    
    // cria o local no banco
    const localData = {
      nome: reviewForm.placeName,
      endereco: reviewForm.placeAddress || 'Endereço não informado',
      latitude: selectedGooglePlace.geometry.location.lat(),
      longitude: selectedGooglePlace.geometry.location.lng(),
      categoria: reviewForm.categoria || 'outro',
      descricao: reviewForm.comentario || '',
      imagem: placeImageUrl // ✅ Adicionar imagem
    };

    console.log('📍 Criando local:', localData);

    const localResponse = await locaisAPI.create(localData);
    
    console.log('📥 Resposta do servidor (local):', localResponse);
    
    if (!localResponse.success) {
      throw new Error(localResponse.message || 'Erro ao criar local');
    }

    const localId = localResponse.data.id;
    console.log('✅ Local criado com ID:', localId);

      // cria a avaliacao desse local
    const avaliacaoData = {
      local_id: localId,
      nivel_ruido: reviewForm.nivelRuido,
      iluminacao: reviewForm.iluminacao,
      cheiros_fortes: reviewForm.cheirosFortes ? 1 : 0,
      movimento_visual: reviewForm.movimentoVisual,
      espaco_calmo: reviewForm.espacoCalmo ? 1 : 0,
      banheiro_acessivel: reviewForm.banheiroAcessivel ? 1 : 0,
      sinalizacao_visual: reviewForm.sinalizacaoVisual,
      mapas_rotas: reviewForm.mapasRotas ? 1 : 0,
      controle_lotacao: reviewForm.controleLotacao,
      filas_preferenciais: reviewForm.filasPreferenciais ? 1 : 0,
      horarios_tranquilos: reviewForm.horariosTranquilos ? 1 : 0,
      mudancas_ambiente: reviewForm.mudancasAmbiente,
      agendamento_antecipado: reviewForm.agendamentoAntecipado ? 1 : 0,
      temperatura_confortavel: reviewForm.temperaturaConfortavel,
      assentos_confortaveis: reviewForm.assentosConfortaveis ? 1 : 0,
      espaco_pessoal: reviewForm.espacoPessoal,
      comentario: reviewForm.comentario || null,
      nota_geral: calcularNotaGeral()
    };

    console.log('⭐ Criando avaliação:', avaliacaoData);

    const avaliacaoResponse = await avaliacoesAPI.create(avaliacaoData);
    
    console.log('📥 Resposta do servidor (avaliação):', avaliacaoResponse);

    if (!avaliacaoResponse.success) {
      throw new Error(avaliacaoResponse.message || 'Erro ao criar avaliação');
    }

    console.log('✅ Avaliação criada com sucesso!');

    // Limpa o formulário
    setReviewForm({
      placeName: '',
      placeAddress: '',
      categoria: 'outro',
      nivelRuido: 3,
      iluminacao: 'natural',
      cheirosFortes: false,
      movimentoVisual: 'medio',
      espacoCalmo: false,
      banheiroAcessivel: false,
      sinalizacaoVisual: 3,
      mapasRotas: false,
      controleLotacao: 'moderado',
      filasPreferenciais: false,
      horariosTranquilos: false,
      mudancasAmbiente: 'media',
      agendamentoAntecipado: false,
      temperaturaConfortavel: 3,
      assentosConfortaveis: false,
      espacoPessoal: 'medio',
      comentario: ''
    });

setSelectedGooglePlace(null);
    setShowReviewModal(false);
    alert('✅ Avaliação publicada com sucesso!');

    // atualiza os locais no mapa
    console.log('🔄 Recarregando locais...');
    await loadLocations();

  } catch (error) {
    console.error('❌ Erro completo:', error);
    console.error('❌ Erro.response:', error.response);
    console.error('❌ Erro.message:', error.message);
    
    let mensagemErro = 'Erro desconhecido';
    
    if (error.response?.data?.message) {
      mensagemErro = error.response.data.message;
    } else if (error.message) {
      mensagemErro = error.message;
    }
    
    alert(`Erro ao enviar avaliação: ${mensagemErro}`);
  } finally {
    setIsSubmitting(false);
  }
};

// calcula a nota geral baseada nos criterios
const calcularNotaGeral = () => {
  const notas = [
    reviewForm.nivelRuido,
    reviewForm.sinalizacaoVisual,
    reviewForm.temperaturaConfortavel
  ];
  
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  const media = soma / notas.length;
  
  return parseFloat(media.toFixed(2));
};
  
  // filtra locais baseado nos filtros ativos
  const getFilteredLocations = () => {
    return locations.filter(location => {
      if (filters.categoria !== 'todas' && location.category !== filters.categoria) {
        return false;
      }
      if (filters.baixoRuido && location.teaRatings.ruidoBaixo < 4) {
        return false;
      }
      if (filters.iluminacaoSuave && location.teaRatings.iluminacao < 4) {
        return false;
      }
      if (filters.espacoCalmo && location.teaRatings.espacoCalmo < 4) {
        return false;
      }
      return true;
    });
  };

  const filteredLocations = getFilteredLocations();
  const sortedFilteredLocations = [...filteredLocations].sort((a, b) => b.rating - a.rating);

  if (!isLoaded) {
    return <div className="loading">Carregando mapa...</div>;
  }

  return (
    <div className="map-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="TEA Map" className="logo-image" />
          </Link>
          
          <nav className="nav">
            <Link to="/parceiros">Parceiros</Link>
            <Link to="/quem-somos">Quem Somos</Link>
            
            {isLoggedIn ? (
              <div className="user-menu-container">
                <button 
                  className="user-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={20} />
                    </div>
                  )}
                  <span className="user-name">{userData.nome?.split(' ')[0] || 'Usuário'}</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {userData.avatar ? (
                          <img src={userData.avatar} alt={userData.nome} />
                        ) : (
                          <User size={32} />
                        )}
                      </div>
                      <div className="user-details">
                        <strong>{userData.nome}</strong>
                        <span>{userData.email}</span>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/perfil" className="dropdown-item">
                      <User size={18} />
                      Meu Perfil
                    </Link>
                    
                    <Link to="/configuracoes" className="dropdown-item">
                      <Settings size={18} />
                      Configurações
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary">Login</button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="map-content">
        <div className="map-section">
          <div className="section-header">
            <div>
              <p className="section-subtitle">Descubra</p>
              <h1 className="section-title">Mapa da Inclusão</h1>
            </div>
            
            <div className="map-controls">
              <div className="search-box">
                <Search size={20} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Buscar local no Google Maps..."
                />
              </div>
              
              <button 
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filtros
              </button>

              <button 
                className="add-btn"
                onClick={handleAddReview}
              >
                <Plus size={20} />
                Avaliar Local
              </button>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Categoria:</label>
                <select 
                  value={filters.categoria}
                  onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                >
                  <option value="todas">Todas</option>
                  <option value="educacao">Educação</option>
                  <option value="lazer">Lazer</option>
                  <option value="cultura">Cultura</option>
                  <option value="saude">Saúde</option>
                </select>
              </div>

              <div className="filter-checkboxes">
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.baixoRuido}
                    onChange={(e) => setFilters({...filters, baixoRuido: e.target.checked})}
                  />
                  Baixo Ruído
                </label>
                
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.iluminacaoSuave}
                    onChange={(e) => setFilters({...filters, iluminacaoSuave: e.target.checked})}
                  />
                  Iluminação Suave
                </label>
                
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.espacoCalmo}
                    onChange={(e) => setFilters({...filters, espacoCalmo: e.target.checked})}
                  />
                  Espaço Calmo
                </label>
              </div>
            </div>
          )}

          {/* Google Map */}
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  onClick={() => handleMarkerClick(location)}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              ))}

              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.position}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="info-window">
                    <h3>{selectedPlace.name}</h3>
                    <div className="info-rating">
                      <Star size={16} fill="#F5A623" stroke="#F5A623" />
                      <span>{selectedPlace.rating}</span>
                      <span className="reviews-count">({selectedPlace.reviews} avaliações)</span>
                    </div>
                    <div className="tea-ratings">
                      <div className="tea-rating-item">
                        <span>Acolhimento:</span>
                        <div className="rating-stars-small">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < selectedPlace.teaRatings.acolhimento ? '#F5A623' : 'none'}
                              stroke="#F5A623"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="tea-rating-item">
                        <span>Ruído Baixo:</span>
                        <div className="rating-stars-small">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < selectedPlace.teaRatings.ruidoBaixo ? '#F5A623' : 'none'}
                              stroke="#F5A623"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Ranking via Sidebar */}
        <aside className="ranking-section">
          <h2 className="ranking-title">Ranking</h2>
          
          {filteredLocations.length === 0 ? (
            <div className="no-results">
              <p>😔 Nenhum local encontrado com esses filtros</p>
              <button 
                className="btn-clear-filters"
                onClick={() => setFilters({
                  categoria: 'todas',
                  baixoRuido: false,
                  iluminacaoSuave: false,
                  espacoCalmo: false
                })}
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="ranking-list">
              {sortedFilteredLocations.map((location, index) => (
                <div 
                  key={location.id} 
                  className="ranking-card"
                  onClick={() => handleMarkerClick(location)}
                >
                  <div className="ranking-image-container">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="ranking-image"
                    />
                    
                    {index === 0 && (
                      <div className="top-badge">
                        <Star size={16} fill="white" />
                        TOP 1
                      </div>
                    )}

                    <div className="category-badge">
                      {location.category === 'educacao' && '🎓 Educação'}
                      {location.category === 'lazer' && '🎡 Lazer'}
                      {location.category === 'cultura' && '🎭 Cultura'}
                      {location.category === 'saude' && '🏥 Saúde'}
                      {location.category === 'outro' && '📍 Outro'}
                    </div>
                    
                    <button 
                      className={`favorite-btn ${location.isFavorite ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(location.id);
                      }}
                    >
                      <Heart size={20} fill={location.isFavorite ? '#e74c3c' : 'none'} />
                    </button>
                  </div>

                  <div className="ranking-info">
                    <h3 className="ranking-name">{location.name}</h3>
                    <div className="ranking-rating">
                      <span className="rating-score">{location.rating}</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < Math.floor(location.rating) ? '#F5A623' : 'none'}
                            stroke="#F5A623"
                          />
                        ))}
                      </div>
                      <span className="rating-count">({location.reviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>

      {/* Modal de Avaliação */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Avaliação TEA</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitReview} className="review-form">
              <div className="form-group">
                <label>Nome do Local *</label>
                <input
                  ref={placeInputRef}
                  type="text"
                  value={reviewForm.placeName}
                  onChange={(e) => setReviewForm({...reviewForm, placeName: e.target.value})}
                  placeholder="Digite o nome do local (ex: Escola Municipal...)"
                  required
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                <small className="helper-text">💡 Comece a digitar e selecione da lista do Google</small>
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  value={reviewForm.placeAddress}
                  onChange={(e) => setReviewForm({...reviewForm, placeAddress: e.target.value})}
                  placeholder="Endereço do local"
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
              <label>📍 Categoria do Local *</label>
              <select 
                value={reviewForm.categoria}
                onChange={(e) => setReviewForm({...reviewForm, categoria: e.target.value})}
                required
                disabled={isSubmitting}
              >
                <option value="">Selecione uma categoria</option>
                <option value="educacao">🎓 Educação</option>
                <option value="lazer">🎡 Lazer</option>
                <option value="cultura">🎭 Cultura</option>
                <option value="saude">🏥 Saúde</option>
                <option value="comercio">🛒 Comércio</option>
                <option value="outro">📍 Outro</option>
              </select>
              </div>

              {/* AMBIENTE SENSORIAL */}
              <div className="category-section">
                <h3 className="category-title">🔊 Ambiente Sensorial</h3>

                <div className="rating-group">
                  <label>
                    <span>🔉 Nível de Ruído</span>
                    <span className="rating-value">{reviewForm.nivelRuido}/5</span>
                  </label>
                  <div className="rating-helper">Baixo → Alto</div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reviewForm.nivelRuido}
                    onChange={(e) => setReviewForm({...reviewForm, nivelRuido: parseInt(e.target.value)})}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>💡 Iluminação</label>
                  <select 
                    value={reviewForm.iluminacao}
                    onChange={(e) => setReviewForm({...reviewForm, iluminacao: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="suave">☀️ Suave</option>
                    <option value="natural">🌤️ Natural</option>
                    <option value="forte">💥 Forte</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.cheirosFortes}
                      onChange={(e) => setReviewForm({...reviewForm, cheirosFortes: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>🌸 Há cheiros fortes no ambiente</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>📺 Movimento Visual</label>
                  <select 
                    value={reviewForm.movimentoVisual}
                    onChange={(e) => setReviewForm({...reviewForm, movimentoVisual: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="pouco">🔵 Pouco</option>
                    <option value="medio">🟢 Médio</option>
                    <option value="intenso">🔴 Intenso</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.espacoCalmo}
                      onChange={(e) => setReviewForm({...reviewForm, espacoCalmo: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>🌿 Espaço Calmo Disponível</span>
                  </label>
                </div>
              </div>

              {/* ACESSIBILIDADE E ESTRUTURA */}
              <div className="category-section">
                <h3 className="category-title">⏱️ Acessibilidade e Estrutura</h3>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.banheiroAcessivel}
                      onChange={(e) => setReviewForm({...reviewForm, banheiroAcessivel: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>♿ Banheiro Acessível</span>
                  </label>
                </div>

                <div className="rating-group">
                  <label>
                    <span>🎯 Sinalização Visual Clara</span>
                    <span className="rating-value">{reviewForm.sinalizacaoVisual}/5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reviewForm.sinalizacaoVisual}
                    onChange={(e) => setReviewForm({...reviewForm, sinalizacaoVisual: parseInt(e.target.value)})}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.mapasRotas}
                      onChange={(e) => setReviewForm({...reviewForm, mapasRotas: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>🗺️ Mapas e Rotas Internas</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>👥 Controle de Lotação</label>
                  <select 
                    value={reviewForm.controleLotacao}
                    onChange={(e) => setReviewForm({...reviewForm, controleLotacao: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="tranquilo">🟢 Tranquilo</option>
                    <option value="moderado">🟡 Moderado</option>
                    <option value="cheio">🔴 Cheio</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.filasPreferenciais}
                      onChange={(e) => setReviewForm({...reviewForm, filasPreferenciais: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>📋 Filas Preferenciais</span>
                  </label>
                </div>
              </div>

              {/* PREVISIBILIDADE E ROTINA */}
              <div className="category-section">
                <h3 className="category-title">🕐 Previsibilidade e Rotina</h3>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.horariosTranquilos}
                      onChange={(e) => setReviewForm({...reviewForm, horariosTranquilos: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>🔓 Horários Tranquilos Disponíveis</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>🔄 Mudanças Frequentes no Ambiente</label>
                  <select 
                    value={reviewForm.mudancasAmbiente}
                    onChange={(e) => setReviewForm({...reviewForm, mudancasAmbiente: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="baixa">🟢 Baixa</option>
                    <option value="media">🟡 Média</option>
                    <option value="alta">🔴 Alta</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.agendamentoAntecipado}
                      onChange={(e) => setReviewForm({...reviewForm, agendamentoAntecipado: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>📅 Agendamento Antecipado Disponível</span>
                  </label>
                </div>
              </div>

              {/* CONFORTO */}
              <div className="category-section">
                <h3 className="category-title">🌡️ Conforto</h3>

                <div className="rating-group">
                  <label>
                    <span>🌡️ Temperatura Confortável</span>
                    <span className="rating-value">{reviewForm.temperaturaConfortavel}/5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reviewForm.temperaturaConfortavel}
                    onChange={(e) => setReviewForm({...reviewForm, temperaturaConfortavel: parseInt(e.target.value)})}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.assentosConfortaveis}
                      onChange={(e) => setReviewForm({...reviewForm, assentosConfortaveis: e.target.checked})}
                      disabled={isSubmitting}
                    />
                    <span>🪑 Assentos Confortáveis e Espaçados</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>🧍 Espaço Pessoal</label>
                  <select 
                    value={reviewForm.espacoPessoal}
                    onChange={(e) => setReviewForm({...reviewForm, espacoPessoal: e.target.value})}
                    disabled={isSubmitting}
                  >
                    <option value="amplo">🟢 Amplo</option>
                    <option value="medio">🟡 Médio</option>
                    <option value="apertado">🔴 Apertado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>💬 Comentário (opcional)</label>
                <textarea
                  value={reviewForm.comentario}
                  onChange={(e) => setReviewForm({...reviewForm, comentario: e.target.value})}
                  placeholder="Conte sua experiência neste local..."
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>

              {/* BOTÃO */}
              <button 
                type="submit" 
                className="btn-submit-review"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="spinner" />
                    Enviando...
                  </>
                ) : (
                  '✨ Publicar Avaliação'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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

export default MapPage;