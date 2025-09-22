
import AuthGuard from "@/components/admin/AuthGuard";
import NavbarAdmin from "@/components/admin/NavbarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin />
        
        <div className="lg:flex">
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
    </AuthGuard>
  );
}