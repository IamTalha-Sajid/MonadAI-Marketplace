import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1a1a2e;
    color: #f5f5f5;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #2a2a5a;
    background-color: #232344;
    color: #f5f5f5;
    font-size: 1rem;
    width: 100%;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3e80c2;
    }
    
    &::placeholder {
      color: #8a8aa3;
    }
  }

  h1, h2, h3, h4 {
    margin-bottom: 1rem;
    font-weight: 600;
  }

  a {
    color: #3e80c2;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #5aa0e9;
    }
  }
`;

export default GlobalStyle;