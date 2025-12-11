# 🗺️ AUTMAP - Mapa Interativo para Autistas

Um sistema web interativo desenvolvido para ajudar pessoas autistas e suas famílias a encontrarem locais acessíveis e amigáveis, com informações sobre estabelecimentos, serviços e espaços adequados às necessidades do espectro autista.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido pelos alunos do curso de sistemas de informação do IFAL - CAMPUS Maceió com o objetivo de criar uma plataforma que facilite a localização de lugares preparados para receber pessoas autistas, promovendo inclusão e acessibilidade. 

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca JavaScript para construção da interface
- **Vite** - Build moderna e rápida para desenvolvimento
- **Google Maps API** - Mapas interativos
- **Axios** - Cliente HTTP para comunicação com o backend

### Backend
- **PHP** - Linguagem de programação do servidor
- **MySQL** - Banco de dados relacional
- **Apache** - Servidor web

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [XAMPP](https://www.apachefriends.org/) (para Apache e MySQL)
- [Git](https://git-scm.com/)

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/lucasgmc16/Projeto-Integrador-EAD.git
cd mapa-autistas
```

### 2. Configure o Frontend

Instale as dependências do projeto:

```bash
npm install
```

### 3. Configure o Backend

1. Abra o **XAMPP Control Panel**
2. Inicie os serviços **Apache** e **MySQL**

3. Importe o banco de dados:
   - Acesse `http://localhost/phpmyadmin`
   - Crie um novo banco de dados chamado `teamap_db`
   - Importe o arquivo `database.sql` (localizado na pasta `/backend/database/`)

4. Configure a conexão com o banco de dados:
   - Navegue até o arquivo `/backend/config/database.php`
   - Verifique as credenciais de conexão:
     ```php
     $host = "localhost";
     $user = "root";
     $pass = "";
     $db = "teamap_db";
     ```

5. Coloque os arquivos do backend na pasta do Apache:
   - Copie a pasta `/backend` para `C:/xampp/htdocs/`

## ▶️ Como Executar

### 1. Inicie o XAMPP

Abra o **XAMPP Control Panel** e inicie:
- ✅ **Apache**
- ✅ **MySQL**

Verifique se ambos os serviços estão rodando.

### 2. Inicie o Frontend

No terminal, na pasta raiz do projeto, execute:

```bash
npm run dev

➜  Local:   http://localhost:5173/
```

### 3. Acesse o Sistema

Abra seu navegador e acesse:
- **Frontend:** `http://localhost:5173`
- **Backend (API):** `http://localhost/backend`
- **PhpMyAdmin:** `http://localhost/phpmyadmin`

## 🛠️ Funcionalidades

- 🗺️ Visualização de mapa interativo
- 📍 Cadastro de novos locais 
- ⭐ Sistema de avaliações e comentários
- 🔍 Busca e filtros
- 👤 Sistema de usuários

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido pelos alunos do IFAL - CAMPUS MACEIÓ: LUCAS GOES, LUIZ GABRIEL E ISAAC BARROS 

---

**⚠️ Nota:** Este é um projeto em desenvolvimento. Algumas funcionalidades podem estar incompletas ou em fase de testes.