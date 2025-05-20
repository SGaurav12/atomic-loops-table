import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Tag, Store, Star, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import Skeleton from 'react-loading-skeleton';
import { getEditedProduct } from '@/utils/localStorageUtils';
import { type ProductDetails } from '@/types';
import { useProductDetailsState } from '@/store/product-details-state';


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 const {
    product,
    setProduct,
    loading,
    setLoading,
    error,
    setError,
    reset,
  } = useProductDetailsState();

  useEffect(() => {
    if (product) return; // skip fetch if already have product data

    // Try loading from localStorage first
    const localProduct = getEditedProduct(id!);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
      return;
    }

    // fallback to fetch from API
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      reset(); // Reset state on unmount
    };
  
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton height={40} width={120} />
          <Skeleton height={400} />
          <Skeleton count={5} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full max-h-[500px] object-cover rounded-lg mb-6"
            />

            <div className="prose max-w-none text-gray-700 mb-8">
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm mb-10">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Category:</span> {product.category}
              </div>
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Brand:</span> {product.brand}
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Rating:</span> {product.rating}
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Stock:</span> {product.stock}
              </div>
              <div className="flex items-center gap-3">
                💰 <span className="font-medium">Price:</span> ${product.price}
              </div>
              <div className="flex items-center gap-3">
                🏷️ <span className="font-medium">Discount:</span> {product.discountPercentage}%
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="pt-8 border-t">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">More Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="rounded-lg object-cover max-h-48 w-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
