import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import HomePage        from '@/pages/HomePage'
import ProductsPage    from '@/pages/ProductsPage'
import ProductDetail   from '@/pages/ProductDetail'
import ConfiguratorPage from '@/pages/ConfiguratorPage'
import GalleryPage     from '@/pages/GalleryPage'
import ContactPage     from '@/pages/ContactPage'
import AdminPage       from '@/pages/AdminPage'

export default function App() {
  const location = useLocation()
  const hideFooter = location.pathname === '/admin'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/products"      element={<ProductsPage />} />
            <Route path="/products/:id"  element={<ProductDetail />} />
            <Route path="/configurator"  element={<ConfiguratorPage />} />
            <Route path="/gallery"       element={<GalleryPage />} />
            <Route path="/contact"       element={<ContactPage />} />
            <Route path="/admin"         element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <Toast />
    </div>
  )
}
