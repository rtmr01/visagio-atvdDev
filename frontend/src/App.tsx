import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { PackageSearch } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="main-header">
          <div className="header-content">
            <Link to="/" className="logo">
              <PackageSearch size={28} />
              <span>Visagio Commerce</span>
            </Link>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/produtos/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
