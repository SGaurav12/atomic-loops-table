import Header from './header';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Layout : React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col p-6">
      {(!isLoginPage && !isRegisterPage) && <Header />}
      <main className="relative flex-1 container mx-auto p-4 overflow-visible">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;