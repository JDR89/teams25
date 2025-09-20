"use client";

import AuthGuard from '@/components/admin/AuthGuard';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { UserPlus, Edit, LogOut, LayoutDashboard, Bot } from 'lucide-react';
import Link from 'next/link';
import { menuItems } from '@/components/admin/menu-items';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        
        {/* Mobile Navbar - Solo visible en pantallas pequeñas */}
        <nav className="lg:hidden bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/admin" className="flex items-center space-x-2">
                <LayoutDashboard className="w-5 h-5 text-gray-700" />
                <h1 className="text-xl font-bold text-gray-900">Panel</h1>
              </Link>
              
              <div className="flex items-center space-x-2">
                {/* Agregar jugador - Mobile */}
                <Button variant="outline" size="icon">
                  <UserPlus className="w-4 h-4" />
                </Button>
                
                {/* Agregar bot - Mobile */}
                <Button variant="outline" size="icon">
                  <Bot className="w-4 h-4" />
                </Button>
                
                {/* Editar jugador - Mobile */}
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                
                {/* Cerrar sesión - Mobile */}
                <Button variant="destructive" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="lg:flex">
          {/* Sidebar - Solo visible en pantallas grandes */}
          <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-sm border-r">
            <div className="flex flex-col flex-1">
              {/* Header del sidebar */}
              <div className="flex items-center h-16 px-6 border-b ">
                <Link href="/admin" className="flex items-center space-x-2">
                  <LayoutDashboard className="w-5 h-5 text-gray-700" />
                  <h1 className="text-xl font-bold text-gray-900 ml-3">Panel</h1>
                </Link>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Agregar jugador */}
                {menuItems.map((item) => (
                  <Link href={`/admin${item.url}`} key={item.name}>
                  <Button key={item.name} variant="ghost" className="w-full justify-start">
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                  </Link>
                ))}
                
              
              </nav>
              
              {/* Footer del sidebar */}
              <div className="p-4 border-t flex justify-center">
                <Button 
                  variant="destructive" 
                  className="w-2/3 justify-center" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:pl-64 flex-1">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}