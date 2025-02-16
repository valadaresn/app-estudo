import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CSVUploader from './components/CSVUploader';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CSVUploader />} />
      </Routes>
    </Router>
  );
}

export default App;