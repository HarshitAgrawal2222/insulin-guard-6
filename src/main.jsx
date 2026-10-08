import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SimProvider } from './hooks/useSim'
import './index.css'
import { cssVars } from './theme'
const st = document.createElement('style')
st.textContent = cssVars
document.head.appendChild(st)
createRoot(document.getElementById('root')).render(<BrowserRouter><SimProvider><App /></SimProvider></BrowserRouter>)
