
import { Suspense, lazy, memo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { NotificationProvider } from "./components/common/Notification";
import ErrorBoundary from "./components/common/ErrorBoundary";
import store from "./store/store";
import { queryClient } from "./config/queryClient";
import AppRoutes from "./routes/AppRoutes";

const CartSync = lazy(() => import("./components/common/CartSync"));
const ChatWidget = lazy(() => import("./components/common/ChatWidget"));

const SuspenseFallback = memo(() => null);
SuspenseFallback.displayName = "SuspenseFallback";

const StateProviders = memo(({ children }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  </Provider>
));
StateProviders.displayName = "StateProviders";

const UIProviders = memo(({ children }) => (
  <ThemeProvider>
    <SettingsProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </SettingsProvider>
  </ThemeProvider>
));
UIProviders.displayName = "UIProviders";

const AuthProviders = memo(({ children }) => (
  <AuthProvider>
    <NotificationProvider>{children}</NotificationProvider>
  </AuthProvider>
));
AuthProviders.displayName = "AuthProviders";

const AppContent = memo(() => (
  <>
    <Suspense fallback={<SuspenseFallback />}>
      <CartSync />
    </Suspense>
    <Suspense fallback={<SuspenseFallback />}>
      <ChatWidget />
    </Suspense>
    <AppRoutes />
  </>
));
AppContent.displayName = "AppContent";

function App() {
  return (
    <ErrorBoundary>
      <StateProviders>
        <UIProviders>
          <Router>
            <AuthProviders>
              <AppContent />
            </AuthProviders>
          </Router>
        </UIProviders>
      </StateProviders>
    </ErrorBoundary>
  );
}

export default App;






