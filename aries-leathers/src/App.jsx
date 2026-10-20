import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/shop/Home'
import Products from './pages/shop/Products'
import ProductDetail from './pages/shop/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/shop/Cart'
import Checkout from './pages/shop/Checkout'
import Payment from './pages/shop/Payment'
import OrderSuccess from './pages/shop/OrderSuccess'
import Wishlist from './pages/account/Wishlist'
import Orders from './pages/account/Orders'
import Profile from './pages/account/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
                <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Shop */}
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="search" element={<Products searchMode />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Login zaroori */}
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Sirf admin */}
        <Route path="admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}