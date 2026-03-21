import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes.tsx";
import { SnackbarProvider } from "notistack";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./state/queryClient.ts";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
          <AppRoutes />
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
