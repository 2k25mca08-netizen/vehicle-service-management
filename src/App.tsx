import { Provider } from "react-redux";
import { store } from "./store";
import AppContent from "./AppContent";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster position="top-right" />
    </Provider>
  );
}
