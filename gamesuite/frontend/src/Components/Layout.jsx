import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-cyan-200 font-mono">
      <NavBar />
      <Outlet />
    </div>
  );
}