import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import StudyScreen from './components/StudyScreen';
import MobileStudyScreen from './components/MobileStudyScreen';
import './App.css';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={isMobile ? <MobileStudyScreen /> : <StudyScreen />} />
      </Routes>
    </Router>
  );
}

export default App;