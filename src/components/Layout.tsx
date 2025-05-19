
import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-6 bg-card">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">Muzejní Šatník</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        {children}
      </main>
      
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} Muzejní Šatník. Všechna práva vyhrazena.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
