import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AppLayout() {
  return (
    <div className="app-shell d-lg-flex">
      <Sidebar />
      <div className="content-area flex-grow-1">
        <Navbar />
        <main className="container-fluid p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
