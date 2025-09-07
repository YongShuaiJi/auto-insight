import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { ErrorBoundary } from './App.tsx'
import 'antd/dist/reset.css'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConfigProvider>
  </StrictMode>,
)
