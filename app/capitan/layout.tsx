import NavbarCapitan from "@/components/capitan/NavbarCapitan";
import { TeamsProvider } from "@/contexts/teams-context";

export default function CapitanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeamsProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavbarCapitan />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </TeamsProvider>
  );
}