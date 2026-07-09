import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { PublicMcpPage } from './components/mcp/PublicMcpPage';
import { DemoApp } from './demo/DemoApp';
import { HumanEvalApp } from './humanEval/HumanEvalApp';
import { FrontendDemoApp } from './recording/FrontendDemoApp';
import { LiveSimulationDemoApp } from './recording/LiveSimulationDemoApp';
import './styles.css';

const searchParams = new URLSearchParams(window.location.search);
const recordingMode = searchParams.get('recording');
const cleanPathname = window.location.pathname.replace(/\/$/, '');
const RootApp = cleanPathname.endsWith('/human-eval')
  ? HumanEvalApp
  : cleanPathname.endsWith('/demo')
    ? DemoApp
  : cleanPathname.endsWith('/mcp')
    ? PublicMcpPage
  : recordingMode === 'frontend-demo'
  ? FrontendDemoApp
  : recordingMode === 'live-simulation'
    ? LiveSimulationDemoApp
    : App;

document.body.classList.toggle('human-eval-route', cleanPathname.endsWith('/human-eval'));
document.body.classList.toggle('demo-route', cleanPathname.endsWith('/demo'));
document.body.classList.toggle('mcp-route', cleanPathname.endsWith('/mcp'));
document.body.classList.toggle('recording-frontend-demo', recordingMode === 'frontend-demo');
document.body.classList.toggle('recording-live-simulation', recordingMode === 'live-simulation');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
