import './App.css';
import { Routes, Route } from 'react-router';
import ProductDetails from './pages/product-details';
import DetailsList from './pages/details-list';
import Layout from './layout/layout';

function App() {
  return (
    <div className="max-w-8xl mx-auto px-4 py-10 space-y-6">
      <Routes> 
      <Route element={<Layout/>}>
          <Route index path="/" element={<DetailsList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Route>
      </Routes>
    </div>
  );
}

export default App;
