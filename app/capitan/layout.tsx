import NavbarCapitan from "../../components/capitan/NavbarCapitan";


interface CapitanLayoutProps {
  children: React.ReactNode;
}

export default function CapitanLayout({ children }: CapitanLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
     <NavbarCapitan />
      
      <main className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}