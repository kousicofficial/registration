import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Success from './pages/Success';
import UserDetails from './pages/UserDetails';
import Scanner from './pages/Scanner';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Event Registration</h1>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/success/:id" element={<Success />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
