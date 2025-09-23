"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { menuItems } from "@/components/admin/menu-items";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getDescription = (name: string) => {
    switch (name) {
      case "Agregar jugadores":
        return "Añadir nuevos jugadores al sistema";
      case "Editar jugadores":
        return "Modificar información de jugadores";
      case "Agregar bot":
        return "Añadir nuevos bots al sistema";
      case "Editar bot":
        return "Modificar información de bots";
      case "Ir a capitan":
        return "Acceder al panel de capitán";
      default:
        return "";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden bg-blue-600 shadow-sm border-b-4 border-red-400 relative">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin">
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
            className="p-2 text-white hover:bg-blue-700 border-2 border-white hover:border-blue-300"
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
                  <Link
                    key={index}
                    href={item.url}
                    onClick={closeMobileMenu}
                    className="w-full flex items-start gap-2 p-2 text-left hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-800 mt-0.5">
                        {getDescription(item.name)}
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              <div className="border-t my-2"></div>
              
             <LogoutButton />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-52 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-blue-600 border-r-4 border-red-400 pt-5 pb-2 overflow-y-auto">
          <div className="flex items-center justify-center px-4">
            <Link href="/admin">
              <Image
                src="/logoSJD.png"
                alt="Logo"
                width={50}
                height={40}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.url}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-red-600 hover:text-white transition-colors duration-200"
                  >
                    <IconComponent className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Cerrar sesión al final */}
            <div className="px-2 mt-4">
              <div className="border-t border-blue-500 mb-4"></div>
              <button
                onClick={handleLogout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-red-600 hover:text-white w-full text-left transition-colors duration-200"
              >
                <LogOut className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}