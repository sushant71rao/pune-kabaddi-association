import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlayerRegistration from "./pages/PlayerRegistration";
import Register from "./components/Register";
import Header from "./components/header/Header";
import OfficialRegistration from "./pages/OfficialRegistration";
import TeamRegistration from "./pages/TeamRegistration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="/register" element={<Register />} />
        <Route index element={<Home />} />
        <Route path="/player-registration" element={<PlayerRegistration />} />
        <Route path="/official-registration" element={<OfficialRegistration />} />
        <Route path="/team-registration" element={<TeamRegistration />} />
      </Route>
    </Routes>
  );
}

export default App;
