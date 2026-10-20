import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import CurrencyProvider from './context/CurrencyProvider'
import ProductsProvider from './context/ProductsProvider'
import AuthProvider from './context/AuthProvider'
import ShopProvider from './context/ShopProvider'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <ProductsProvider>
          <AuthProvider>
            <ShopProvider>
              <App />
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#161412',
                    color: '#EDE6DA',
                    border: '1px solid rgba(237,230,218,0.15)',
                    borderRadius: '2px',
                    padding: '12px 18px',
                    fontSize: '13px',
                    letterSpacing: '0.02em',
                  },
                  success: { iconTheme: { primary: '#8A2C30', secondary: '#EDE6DA' } },
                }}
              />
            </ShopProvider>
          </AuthProvider>
        </ProductsProvider>
      </CurrencyProvider>
    </BrowserRouter>
  </StrictMode>
)