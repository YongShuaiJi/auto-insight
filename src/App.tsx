import React, { useState, useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import routes, { renderRouteById } from './routes'
import ThemeProviderWrapper from './theme'
import { fetchProducts } from './services/api.ts'
import type { Product } from './services/api.ts';

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to the console
    console.error("Error caught by error boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data as Product[]);
        // Set the first product as selected by default if available
        if (data && data.length > 0) {
          setSelectedProduct(data[0]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Navigate to the product's path
    // In a real application, you might want to use a router library like react-router-dom
    // For now, we'll just update the URL without a page reload
    window.history.pushState({}, '', product.path);
  };

  // Determine what content to render based on the selected product and menu
  const renderContent = () => {
    try {
      console.log('Rendering content with selectedProduct:', selectedProduct);
      console.log('Rendering content with selectedMenu:', selectedMenu);

      if (selectedProduct) {
        // If a product is selected, render the content for that product
        // This is a simplified implementation. In a real application, you might want to
        // use a more sophisticated routing system.
        const routeContent = renderRouteById(selectedMenu);
        console.log('Route content:', routeContent);

        return (
          <div>
            {routeContent}
          </div>
        );
      }
      // If no product is selected, just render the selected menu
      const routeContent = renderRouteById(selectedMenu);
      console.log('Route content:', routeContent);
      return routeContent;
    } catch (error) {
      console.error('Error in renderContent:', error);
      const message = error instanceof Error ? error.message : String(error);
      return <div style={{ color: 'red' }}>Error rendering content: {message}</div>;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProviderWrapper>
        <Layout
          navItems={routes.map(route => ({ id: route.id, label: route.label, icon: route.icon }))}
          selectedItem={selectedMenu}
          onItemSelect={setSelectedMenu}
          onLogout={handleLogout}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
        >
          {renderContent()}
        </Layout>
      </ThemeProviderWrapper>
    </ErrorBoundary>
  );
}

export default App
