import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlayerRegistration from "./pages/PlayerRegistration";
import Register from "./components/Register";
import Header from "./components/header/Header";
import OfficialRegistration from "./pages/OfficialRegistration";
import TeamRegistration from "./pages/TeamRegistration";
// import Admin from "./pages/admin";
import Players from "./pages/Players";
import Officials from "./pages/Officials";
import Teams from "./pages/Teams";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="/register" element={<Register />} />
        <Route index element={<Home />} />
        <Route path="/player-registration" element={<PlayerRegistration />} />
        <Route path="/official-registration" element={<OfficialRegistration />} />
        <Route path="/team-registration" element={<TeamRegistration />} />

        <Route path="admin/players" element={<Players />} />
        <Route path="admin/officials" element={<Officials />} />
        <Route path="admin/teams" element={<Teams />} />


      </Route>
    </Routes>
  );
}

export default App;
