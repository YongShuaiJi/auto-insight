// API service for fetching data from the backend

// Mock data for products
const mockProducts = [
  { id: 'product1', name: '产品一', path: '/product1' },
  { id: 'product2', name: '产品二', path: '/product2' },
  { id: 'product3', name: '产品三', path: '/product3' },
];

// Function to fetch products from the backend
export const fetchProducts = async () => {
  // In a real application, this would be an API call
  // For now, we'll return mock data
  return new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

// Type definition for Product
export interface Product {
  id: string;
  name: string;
  path: string;
}