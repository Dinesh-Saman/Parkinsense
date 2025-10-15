import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<div className="p-4 text-center">Diagnostic Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  )
}

export default App;