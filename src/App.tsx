import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Jednoduchá komponenta pro případ problémů s načítáním
const FallbackComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="p-8 rounded-lg border shadow-lg max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Muzejní Šatník</h1>
      <div className="mb-4">
        <p className="mb-2">Aplikace se načítá nebo došlo k problému.</p>
        <p className="text-sm text-gray-500">
          Zkontrolujte, že složky s obrázky jsou správně nakopírovány do public/ složky.
          Spusťte příkaz 'npm run setup' pro kopírování obrázků a poté restartujte server.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Obnovit stránku
      </button>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <ThemeProvider defaultTheme="system" storageKey="muzejni-satnik-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
