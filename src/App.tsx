import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import routes, { renderRouteById } from './routes'
import ThemeProviderWrapper from './theme'

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <ThemeProviderWrapper>
      <Layout
        navItems={routes.map(route => ({ id: route.id, label: route.label, icon: route.icon }))}
        selectedItem={selectedMenu}
        onItemSelect={setSelectedMenu}
        onLogout={handleLogout}
      >
        {renderRouteById(selectedMenu)}
      </Layout>
    </ThemeProviderWrapper>
  );
}

export default App
