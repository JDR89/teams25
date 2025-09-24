import Image from "next/image";
import Link from "next/link";

export default function NavbarCapitan() {
  return (
    <div className="relative shadow-sm border-b-2 border-white">
      {/* Mitad azul */}
      <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-600"></div>
      
      {/* Línea blanca en el medio */}
      <div className="absolute left-1/2 top-0 w-1 h-full bg-white transform -translate-x-1/2"></div>
      
      {/* Mitad roja */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-red-600"></div>
      
      {/* Contenido del navbar */}
      <div className="relative flex items-center justify-center p-4">
        <Link href="/capitan">
          <Image
            src="/logoSJD.png"
            alt="Logo"
            width={40}
            height={30}
            className="cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}