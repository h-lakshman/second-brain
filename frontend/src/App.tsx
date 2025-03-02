import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
