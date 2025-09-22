"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { menuItems } from "@/components/admin/menu-items";
import Image from "next/image";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Función para generar descripciones dinámicas
  const getDescription = (name: string) => {
    const descriptions: { [key: string]: string } = {
      "Agregar jugador": "Añadir nuevo jugador al sistema",
      "Agregar bot regular": "Crear un nuevo bot para el equipo",
      "Editar jugador": "Modificar información de jugadores",
      "Editar bot regular": "Actualizar configuración de bots"
    };
    return descriptions[name] || `Gestionar ${name.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Mobile Navbar */}
      <div className="lg:hidden bg-white shadow-sm border-b relative">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" suppressHydrationWarning>
            <Image
              src="/logoSJD.png"
              alt="Logo"
              width={40}
              height={30}
              className="cursor-pointer"
            />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg border-t">
            <div className="p-4 space-y-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={closeMobileMenu}
                    className="w-full flex items-start gap-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {getDescription(item.name)}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              <div className="border-t my-2"></div>
              
              <button
                onClick={closeMobileMenu}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">Cerrar sesión</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Salir del panel de administración
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-52 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-2 overflow-y-auto">
            <div className="flex items-center justify-center px-4">
              <Link href="/admin" suppressHydrationWarning>
                <Image
                  src="/logoSJD.png"
                  alt="Logo"
                  width={40}
                  height={30}
                  className="cursor-pointer"
                />
              </Link>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1" suppressHydrationWarning>
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={index}
                      href={item.url}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <IconComponent className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Cerrar sesión al final */}
              <div className="px-2 mt-4" suppressHydrationWarning>
                <div className="border-t mb-4"></div>
                <button
                  onClick={() => {
                    console.log('Cerrar sesión');
                  }}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-52 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}