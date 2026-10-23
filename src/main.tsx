import React from 'react';import{createRoot}from'react-dom/client';import App from './App';import './styles.css';createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
import './upgrade.css';
import './mobile.css';
// Safari 键盘改变可视区域；只调整容器高度，不阻止用户缩放。
function syncViewport(){const viewport=window.visualViewport;document.documentElement.style.setProperty('--app-height',`${viewport?.height??window.innerHeight}px`);document.documentElement.style.setProperty('--viewport-offset-top',`${viewport?.offsetTop??0}px`)}
syncViewport();window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);window.addEventListener('resize',syncViewport);
