import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudyScreen from './components/StudyScreen';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudyScreen />} />
      </Routes>
    </Router>
  );
}

export default App;