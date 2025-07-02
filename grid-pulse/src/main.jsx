import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster as Sonner} from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux'
import rootReducer from "./reducer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
export const store = configureStore({
  reducer: rootReducer
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-right" theme="system" closeButton />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);
