import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
