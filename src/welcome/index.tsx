import React from 'react';
import ReactDOM from 'react-dom/client';
import WelcomePage from '../popup/components/WelcomePage';
import '../popup/index.css';

const handleClose = () => {
  // 关闭欢迎页面
  window.close();
};

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <WelcomePage onClose={handleClose} />
  </React.StrictMode>
); 