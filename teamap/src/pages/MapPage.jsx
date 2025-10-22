import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Heart, Star, Filter, Search, Plus, X, User, LogOut, Settings } from 'lucide-react';
import './MapPage.css';
import logo from '../assets/Logo.png';

const libraries = ['places'];

const MapPage = () => {
  // API KEY
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDlAPjxU5ImabHaPjiPOu0xqjWta_us5RY';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const placeInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Locais com avaliações TEA
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Parque Central de Arapiraca',
      position: { lat: -9.7524, lng: -36.6612 },
      rating: 4.8,
      reviews: 52,
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400',
      category: 'lazer',
      isFavorite: false,
      teaRatings: {
        acolhimento: 5,
        ruidoBaixo: 4,
        iluminacao: 5,
        espacoCalmo: 5
      }
    },
    {
      id: 2,
      name: 'Biblioteca Municipal',
      position: { lat: -9.7490, lng: -36.6580 },
      rating: 4.6,
      reviews: 28,
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400',
      category: 'cultura',
      isFavorite: false,
      teaRatings: {
        acolhimento: 4,
        ruidoBaixo: 5,
        iluminacao: 4,
        espacoCalmo: 5
      }
    },
    {
      id: 3,
      name: 'Escola Municipal Dom Pedro II',
      position: { lat: -9.7560, lng: -36.6650 },
      rating: 4.3,
      reviews: 15,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
      category: 'educacao',
      isFavorite: false,
      teaRatings: {
        acolhimento: 4,
        ruidoBaixo: 3,
        iluminacao: 4,
        espacoCalmo: 4
      }
    },
    {
      id: 4,
      name: 'Centro de Saúde Arapiraca',
      position: { lat: -9.7500, lng: -36.6600 },
      rating: 4.5,
      reviews: 34,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
      category: 'saude',
      isFavorite: false,
      teaRatings: {
        acolhimento: 5,
        ruidoBaixo: 4,
        iluminacao: 4,
        espacoCalmo: 5
      }
    }
  ]);

  const [filters, setFilters] = useState({
    categoria: 'todas',
    baixoRuido: false,
    iluminacaoSuave: false,
    espacoCalmo: false
  });

  const [showFilters, setShowFilters] = useState(false);
  
  // Estado do formulário de avaliação
  const [reviewForm, setReviewForm] = useState({
    placeName: '',
    placeAddress: '',
    // Ambiente Sensorial
    nivelRuido: 3,
    iluminacao: 'natural', // suave, natural, forte
    cheirosFortes: false,
    movimentoVisual: 'medio', // pouco, medio, intenso
    espacoCalmo: true,
    // Acessibilidade e Estrutura
    banheiroAcessivel: true,
    sinalizacaoVisual: 3,
    mapasRotas: true,
    controleLotacao: 'tranquilo', // tranquilo, moderado, cheio
    filasPreferenciais: false,
    // Previsibilidade e Rotina
    horariosTranquilos: true,
    mudancasAmbiente: 'baixa', // baixa, media, alta
    agendamentoAntecipado: false,
    // Conforto
    temperaturaConfortavel: 3,
    assentosConfortaveis: true,
    espacoPessoal: 'amplo', // amplo, medio, apertado
    comentario: ''
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: -9.7524,
    lng: -36.6612
  };

  const onLoad = useCallback((map) => {
    setMap(map);
    
    // Inicializar autocomplete
    if (searchInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'br' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(16);
          
          // Preencher formulário com dados do lugar
          setReviewForm({
            ...reviewForm,
            placeName: place.name,
            placeAddress: place.formatted_address
          });
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

  const handleMarkerClick = (location) => {
    setSelectedPlace(location);
    if (map) {
      map.panTo(location.position);
    }
  };

  const handleAddReview = () => {
    setShowReviewModal(true);
    
    // Inicializar autocomplete quando o modal abrir
    setTimeout(() => {
      if (placeInputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(placeInputRef.current, {
          componentRestrictions: { country: 'br' }
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setReviewForm({
              ...reviewForm,
              placeName: place.name || '',
              placeAddress: place.formatted_address || ''
            });
            
            // Centralizar o mapa no lugar selecionado
            if (map) {
              map.panTo(place.geometry.location);
              map.setZoom(16);
            }
          }
        });
      }
    }, 100);
  };

  const submitReview = (e) => {
    e.preventDefault();
    
    // Criar novo local com avaliação
    const newLocation = {
      id: locations.length + 1,
      name: reviewForm.placeName,
      position: center, // Na implementação real, pegar do lugar selecionado
      rating: (reviewForm.acolhimento + reviewForm.ruidoBaixo + reviewForm.iluminacao + reviewForm.espacoCalmo) / 4,
      reviews: 1,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      category: 'Novo',
      isFavorite: false,
      teaRatings: {
        acolhimento: reviewForm.acolhimento,
        ruidoBaixo: reviewForm.ruidoBaixo,
        iluminacao: reviewForm.iluminacao,
        espacoCalmo: reviewForm.espacoCalmo
      },
      comentario: reviewForm.comentario
    };

    setLocations([...locations, newLocation]);
    setShowReviewModal(false);
    
    // Limpar formulário
    setReviewForm({
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

    alert('Avaliação adicionada com sucesso!');
  };

  const sortedLocations = [...locations].sort((a, b) => b.rating - a.rating);

  // Função para filtrar locais
  const getFilteredLocations = () => {
    return locations.filter(location => {
      // Filtro por categoria
      if (filters.categoria !== 'todas' && location.category !== filters.categoria) {
        return false;
      }

      // Filtro por ruído baixo (rating >= 4)
      if (filters.baixoRuido && location.teaRatings.ruidoBaixo < 4) {
        return false;
      }

      // Filtro por iluminação suave (rating >= 4)
      if (filters.iluminacaoSuave && location.teaRatings.iluminacao < 4) {
        return false;
      }

      // Filtro por espaço calmo (rating >= 4)
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
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
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
              {/* Marcadores */}
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

              {/* InfoWindow */}
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

        {/* Ranking Sidebar */}
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
                />
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
                  />
                </div>

                <div className="form-group">
                  <label>💡 Iluminação</label>
                  <select 
                    value={reviewForm.iluminacao}
                    onChange={(e) => setReviewForm({...reviewForm, iluminacao: e.target.value})}
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
                    />
                    <span>🌸 Há cheiros fortes no ambiente</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>📺 Movimento Visual</label>
                  <select 
                    value={reviewForm.movimentoVisual}
                    onChange={(e) => setReviewForm({...reviewForm, movimentoVisual: e.target.value})}
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
                  />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.mapasRotas}
                      onChange={(e) => setReviewForm({...reviewForm, mapasRotas: e.target.checked})}
                    />
                    <span>🗺️ Mapas e Rotas Internas</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>👥 Controle de Lotação</label>
                  <select 
                    value={reviewForm.controleLotacao}
                    onChange={(e) => setReviewForm({...reviewForm, controleLotacao: e.target.value})}
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
                    />
                    <span>🔓 Horários Tranquilos Disponíveis</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>🔄 Mudanças Frequentes no Ambiente</label>
                  <select 
                    value={reviewForm.mudancasAmbiente}
                    onChange={(e) => setReviewForm({...reviewForm, mudancasAmbiente: e.target.value})}
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
                  />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={reviewForm.assentosConfortaveis}
                      onChange={(e) => setReviewForm({...reviewForm, assentosConfortaveis: e.target.checked})}
                    />
                    <span>🪑 Assentos Confortáveis e Espaçados</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>🧍 Espaço Pessoal</label>
                  <select 
                    value={reviewForm.espacoPessoal}
                    onChange={(e) => setReviewForm({...reviewForm, espacoPessoal: e.target.value})}
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
                />
              </div>

              <button type="submit" className="btn-submit-review">
                ✨ Publicar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}

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

export default MapPage;