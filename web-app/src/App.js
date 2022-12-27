import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
