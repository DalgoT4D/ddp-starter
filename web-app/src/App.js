import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Airbyte from "./pages/Airbyte";
import Dbt from "./pages/Dbt";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/airbyte" element={<Airbyte />} />
          <Route path="/transformation" element={<Dbt />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
