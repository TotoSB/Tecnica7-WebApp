import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CicloBasico from "./pages/CicloBasico";
import Programacion from "./pages/Programacion";
import Multimedios from "./pages/Multimedios";
import Historia from "./pages/Historia";
import Radio from "./pages/Radio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ciclo-basico" element={<CicloBasico />} />
          <Route path="/programacion" element={<Programacion />} />
          <Route path="/multimedios" element={<Multimedios />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/radio" element={<Radio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
