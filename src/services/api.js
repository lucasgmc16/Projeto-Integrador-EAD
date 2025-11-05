const API_URL = 'http://localhost:8000/api';

export const api = {
  // AUTH
  registro: async (dados) => {
    try {
      const response = await fetch(`${API_URL}/auth/registro.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  },

  login: async (dados) => {
    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const data = await response.json();
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // LOCAIS
  listarLocais: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros);
      const response = await fetch(`${API_URL}/locais/listar.php?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar locais:', error);
      return { success: false, message: 'Erro de conexão', data: [] };
    }
  },

  criarLocal: async (dados) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      const response = await fetch(`${API_URL}/locais/criar.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar local:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  },

  // AVALIAÇÕES
  criarAvaliacao: async (dados) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      const response = await fetch(`${API_URL}/avaliacoes/criar.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  }
};

export default api;