import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUsPage';
import AddCampPage from './pages/AddCampPage';
import BloodCampsPage from './pages/BloodCampsPage';
import ChangePassword from './pages/ChangePassword';
import ContactBlood from './pages/ContactBlood';
import DoctorManagement from './pages/DoctorManagement';
import DoctorRequests from './pages/DoctorRequests';
import DonorListPage from './pages/DonorListPage';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import RegisterPage from './pages/RegisterPage';
import RequestReport from './pages/RequestReport';
import SearchDonorPage from './pages/SearchDonorPage';
import SearchResultsPage from './pages/SearchResults';
import SignInPage from './pages/SignInPage';
import SplashScreen from './pages/SplashScreen';
import Stock from './pages/Stock';
import StockResult from './pages/StockResult';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      // First visit - show splash screen
      setShowSplash(true);
      setIsLoading(true);
    } else {
      // Not first visit - skip splash
      setShowSplash(false);
      setIsLoading(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setIsLoading(false);
    // Mark that user has seen splash screen for this session
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  // Show splash screen on first load
  if (showSplash && isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

 return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-list"
            element={
              <ProtectedRoute>
                <DonorListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-donor"
            element={
              <ProtectedRoute>
                <SearchDonorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-results"
            element={
              <ProtectedRoute>
                <SearchResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-report"
            element={
              <ProtectedRoute>
                <RequestReport/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-camp"
            element={
              <ProtectedRoute>
                <AddCampPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/camps"
            element={
              <ProtectedRoute>
                <BloodCampsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-blood"
            element={
              <ProtectedRoute>
                <ContactBlood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-requests"
            element={
              <ProtectedRoute>
                <DoctorRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cpassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-management"
            element={
              <ProtectedRoute>
                <DoctorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <Stock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-result/:id"
            element={
              <ProtectedRoute>
                <StockResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <div>Change Password Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;