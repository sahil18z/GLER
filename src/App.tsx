import { ToastProvider } from './hooks/useToast';
import { ToastViewport } from './components/ui/Toast';
import { WaitlistPage } from './components/waitlist/WaitlistPage';

export default function App() {
  return (
    <ToastProvider>
      <WaitlistPage />
      <ToastViewport />
    </ToastProvider>
  );
}
