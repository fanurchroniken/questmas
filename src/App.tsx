import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import QuestBuilder from '@/pages/QuestBuilder';
import QuestView from '@/pages/QuestView';
import QuestParticipant from '@/pages/QuestParticipant';
import QuestAnalytics from '@/pages/QuestAnalytics';
import AccessCalendar from '@/pages/AccessCalendar';
import Privacy from '@/pages/Privacy';
import Imprint from '@/pages/Imprint';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/access" element={<AccessCalendar />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/imprint" element={<Imprint />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quests/new"
              element={
                <ProtectedRoute>
                  <QuestBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quests/:id/edit"
              element={
                <ProtectedRoute>
                  <QuestBuilder />
                </ProtectedRoute>
              }
            />
            <Route path="/q/:shareCode" element={<QuestView />} />
            <Route path="/quest/:id/participate" element={<QuestParticipant />} />
            <Route
              path="/quests/:id/analytics"
              element={
                <ProtectedRoute>
                  <QuestAnalytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

