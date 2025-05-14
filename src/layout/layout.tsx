import React, {type ReactNode} from 'react';
import Header from './header';
import { Outlet } from 'react-router-dom';



const Layout : React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        < Outlet/>
      </main>
    </div>
  );
};

export default Layout;