import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPlaceholder from './pages/AuthPlaceholder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<AuthPlaceholder type="Login" />} />
        <Route path="/auth/register" element={<AuthPlaceholder type="Sign Up" />} />
      </Routes>
    </Router>
  );
}

export default App;
