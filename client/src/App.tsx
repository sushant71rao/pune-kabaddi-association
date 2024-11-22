import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import PlayerRegistration from "./pages/PlayerRegistration";
// import Register from "./components/Register";
import Header from "./components/header/Header";
// import OfficialRegistration from "./pages/OfficialRegistration";
// import TeamRegistration from "./pages/TeamRegistration";
// import Admin from "./pages/admin";
import Players from "./pages/Players";
import Officials from "./pages/Officials";
import Teams from "./pages/Teams";
import Footer from "./components/Footer";
import PlayerProfile from "./pages/PlayerProfile";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";
// import IDPage from "./pages/IDPage.tsx";
import TeamProfile from "./pages/TeamProfile.tsx";
import OfficialProfile from "./pages/OfficialProfile.tsx";
import CreateCompetition from "./pages/Competition.tsx";
import CompetionDetails from "./pages/CompetionDetails.tsx";

function App() {
  let { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="*"
        element={
          <>
            <Header />
            <Routes>
              {/* <Route path="/register" element={<Register />} /> */}
              <Route index element={<Home />} />
              {/* <Route
                path="/player-registration"
                element={<PlayerRegistration />}
              />
              <Route
                path="/official-registration"
                element={<OfficialRegistration />}
              />
              <Route path="/id-card/:id" element={<IDPage></IDPage>} />
              <Route path="/team-registration" element={<TeamRegistration />} /> */}
              {/* <Route
                path="/competition-registration"
                element={<CreateCompetition />}
              /> */}
              <Route
                path="/competition-details/:id"
                element={<CompetionDetails />}
              />
              <Route path="/profile" element={<Profile></Profile>} />
              {user?.isAdmin && (
                <>
                  <Route path="admin/player/:id" element={<PlayerProfile />} />
                  <Route path="admin/team/:id" element={<TeamProfile />} />
                  <Route
                    path="admin/official/:id"
                    element={<OfficialProfile />}
                  />
                  <Route
                    path="admin/competition-registration"
                    element={<CreateCompetition />}
                  />

                  <Route path="admin/officials" element={<Officials />} />
                  <Route path="admin/teams" element={<Teams />} />
                  <Route path="admin/players" element={<Players />} />
                </>
              )}
            </Routes>
            <Footer />
          </>
        }
      ></Route>
    </Routes>
  );
}

export default App;
