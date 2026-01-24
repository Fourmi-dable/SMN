import './App.css';
import "7.css/dist/7.css";
import { UserDataProvider } from './contexts/UserContext.tsx';
import AppContent from './AppContent.tsx';

function App() {
  return (
    <UserDataProvider>
      <AppContent />
    </UserDataProvider>
  );
}

export default App;
