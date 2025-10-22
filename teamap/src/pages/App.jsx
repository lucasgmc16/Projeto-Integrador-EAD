import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import MapPage from '../pages/MapPage';
import Privacidade from '../pages/privacidade';
import Termos from '../pages/termos';
import Login from '../pages/login';
import QuemSomos from '../pages/quemsomos';
import Parceiros from './Parceiros';
import Cadastro from '../pages/Cadastro';
import EsqueceuSenha from '../pages/EsqueceuSenha';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapatea" element={<MapPage />} />
        <Route path="/parceiros" element={<Parceiros />} /> 
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/privacidade" element={<Privacidade />} /> 
        <Route path="/termos" element={<Termos />} /> 
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/esqueceuSenha" element={<EsqueceuSenha />} /> 
      </Routes>
    </Router>
  );
}

export default App;