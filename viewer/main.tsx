import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ViewerApp } from './ViewerApp.tsx'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('No #root element found')

createRoot(rootEl).render(
  <StrictMode>
    <ViewerApp />
  </StrictMode>
)
