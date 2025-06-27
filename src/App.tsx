
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Overview from "./pages/Overview";
import GeographicAnalytics from "./pages/GeographicAnalytics";
import GeographicDrilldown from "./pages/GeographicDrilldown";
import FinancialMetrics from "./pages/FinancialMetrics";
import StoreAnalytics from "./pages/StoreAnalytics";
import TransactionTrends from "./pages/TransactionTrends";
import ProductMix from "./pages/ProductMix";
import ConsumerBehavior from "./pages/ConsumerBehavior";
import ConsumerProfiling from "./pages/ConsumerProfiling";
import RetailBotPage from "./pages/RetailBotPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/geographic-analytics" element={<GeographicAnalytics />} />
            <Route path="/geographic-drilldown" element={<GeographicDrilldown />} />
            <Route path="/financial-metrics" element={<FinancialMetrics />} />
            <Route path="/store-analytics" element={<StoreAnalytics />} />
            <Route path="/transaction-trends" element={<TransactionTrends />} />
            <Route path="/product-mix" element={<ProductMix />} />
            <Route path="/consumer-behavior" element={<ConsumerBehavior />} />
            <Route path="/consumer-profiling" element={<ConsumerProfiling />} />
            <Route path="/retail-bot" element={<RetailBotPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
