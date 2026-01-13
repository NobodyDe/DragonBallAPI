<p align="center">
  <img src="public/Dragon_Ball_Z_logo.svg" alt="Dragon Ball Z Logo" width="400"/>
</p>

<h1 align="center">🐉 Dragon Ball Characters Explorer</h1>

<p align="center">
  <strong>Uma aplicação web interativa para explorar personagens do universo Dragon Ball</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/API-Dragon%20Ball%20API-FF6B35?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge"/>
</p>

---

## 📖 Sobre o Projeto

O **Dragon Ball Characters Explorer** é uma aplicação web que consome a [Dragon Ball API](https://dragonball-api.com) para exibir informações detalhadas sobre os personagens da franquia. O projeto foi desenvolvido com foco em boas práticas de JavaScript moderno, consumo de APIs REST e experiência do usuário.

---

## ✨ Funcionalidades

### 🔍 Sistema de Busca Inteligente

- **Busca recursiva paginada**: Busca automaticamente em todas as páginas da API até encontrar o personagem
- **Case-insensitive**: Funciona independente de maiúsculas/minúsculas
- **Busca parcial**: Encontra personagens que contêm o termo buscado (ex: "go" encontra Goku, Gohan, Goten)
- **Feedback visual**: Mostra mensagem quando o personagem não é encontrado

### ♾️ Infinite Scroll

- **Carregamento automático**: Novas páginas são carregadas conforme o usuário rola a página
- **Gerenciamento de estado**: Desativa automaticamente durante a busca para evitar conflitos

### 🃏 Cards Dinâmicos

- **Renderização programática**: Cards são criados dinamicamente via JavaScript
- **Informações completas**: Nome, raça, gênero, Ki base, Ki total e afiliação
- **Efeitos visuais**: Animações suaves no hover das imagens

### 🛡️ Retry Pattern para Requisições

- **Resiliência**: Retenta automaticamente até 4 vezes em caso de falha
- **Delay configurável**: Intervalo entre tentativas para não sobrecarregar a API

---

## 🏗️ Arquitetura do Código

### Estrutura de Diretórios

```
dragonBallAPI/
├── 📁 public/
│   ├── Dragon_Ball_Z_logo.svg
│   ├── dragon-ball-svgrepo-com.svg
│   └── search-01-stroke-rounded.svg
├── 📁 src/
│   ├── 📁 styles/
│   │   ├── style.css
│   │   └── variants.css
│   ├── main.js
│   └── seachApi.js
├── index.html
├── package.json
└── README.md
```

### Principais Módulos

| Arquivo        | Responsabilidade                                        |
| -------------- | ------------------------------------------------------- |
| `main.js`      | Lógica principal, renderização, busca e infinite scroll |
| `seachApi.js`  | Utilitário de retry para operações assíncronas          |
| `style.css`    | Estilização completa da aplicação                       |
| `variants.css` | Variáveis CSS (cores, fontes, temas)                    |

---

## 💡 Destaques Técnicos

### 1. Factory Function para Criação de Elementos

```javascript
function createElementCard(tag, attr = {}, children = []) {
  const { text, ...props } = attr;
  const element = document.createElement(tag);

  Object.entries(props).forEach((item) => {
    element.setAttribute(...item);
  });

  if (text) element.innerText = text;
  if (children) element.append(...children);

  return element;
}
```

> Padrão reutilizável para criação de elementos DOM com atributos e filhos.

### 2. Busca Recursiva com Paginação

```javascript
async function searchCharacters(character, url = BASE_URL) {
  const fetchItems = await retryOperation(() => fetchData(url), 4);

  let find = fetchItems.items.filter((u) =>
    u.name.toLowerCase().includes(character.toLowerCase())
  );

  if (find.length > 0) return find;

  if (fetchItems.links.next) {
    return searchCharacters(character, fetchItems.links.next);
  }

  return [];
}
```

> Recursão elegante que percorre todas as páginas da API até encontrar resultados.

### 3. Retry Pattern para Resiliência

```javascript
export async function retryOperation(asyncFn, retries = 4, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setInterval(resolve, delay));
    }
  }
}
```

> Garante resiliência nas requisições HTTP com tentativas automáticas.

### 4. Controle de Estado para Infinite Scroll

```javascript
let NotIsSearching = true;

// Durante a busca
NotIsSearching = false; // Desativa scroll infinito

// Ao limpar busca
if (e.target.value === "") {
  NotIsSearching = true; // Reativa scroll infinito
}
```

> Evita conflitos entre busca e carregamento automático.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| --- | --- |
| **JavaScript ES6+** | Async/await, arrow functions, destructuring, spread operator, optional chaining |
| **Fetch API** | Consumo de API REST |
| **CSS3** | Flexbox, gradientes, transições, variáveis CSS |
| **HTML5** | Estrutura semântica |
| **Vite** | Build tool e dev server |
| **pnpm** | Gerenciador de pacotes |

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dragonBallAPI.git

# Entre no diretório
cd dragonBallAPI

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Scripts Disponíveis

| Script             | Descrição                          |
| ------------------ | ---------------------------------- |
| `pnpm run dev`     | Inicia servidor de desenvolvimento |
| `pnpm run build`   | Gera build de produção             |
| `pnpm run preview` | Visualiza build de produção        |

---

## 🌐 API Utilizada

Este projeto consome a [Dragon Ball API](https://dragonball-api.com), uma API REST pública que fornece informações sobre personagens, transformações e muito mais do universo Dragon Ball.

### Endpoints utilizados:

```
GET /api/characters?limit=10  → Lista personagens com paginação
```

### Exemplo de resposta:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Goku",
      "ki": "60.000.000",
      "maxKi": "90 Septillion",
      "race": "Saiyan",
      "gender": "Male",
      "affiliation": "Z Fighter",
      "image": "https://..."
    }
  ],
  "links": {
    "next": "https://dragonball-api.com/api/characters?page=2&limit=10"
  }
}
```

---

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foram aplicados os seguintes conceitos:

- ✅ Consumo de APIs REST com Fetch
- ✅ Programação assíncrona (async/await)
- ✅ Recursão para busca paginada
- ✅ Retry Pattern para resiliência
- ✅ Manipulação dinâmica do DOM
- ✅ Gerenciamento de estado com variáveis
- ✅ Infinite Scroll
- ✅ Separação de responsabilidades
- ✅ Reutilização de funções

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com 💛 por <strong>Henrique</strong>
</p>

<p align="center">
  <img src="public/dragon-ball-svgrepo-com.svg" alt="Dragon Ball" width="50"/>
</p>
