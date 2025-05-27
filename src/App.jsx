import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import UserLogin from "./pages/UserLogin";
import Forgot from "./pages/Forgot";
import UserDash from "./pages/Userdash";
import Lots from "./pages/Lots";
import Guides from "./pages/Guides";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Techniques from "./pages/Techniques";
import UserMarket from "./pages/UserUI/Usermarket";
import UserFarms from "./pages/UserUI/UserFarms";
import UserGuides from "./pages/UserUI/UserGuides";
import UserTechniques from "./pages/UserUI/UserTechniques";
import UserProfile from "./pages/UserUI/UserProfile";
import CropRecords from "./pages/CropRecords"; // ✅ Import for Crop Records page

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/userdash" element={<UserDash />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/usermarket" element={<UserMarket />} />
          <Route path="/userfarms" element={<UserFarms />} />
          <Route path="/userguide" element={<UserGuides />} />
          <Route path="/usertechniques" element={<UserTechniques />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/crop-records" element={<CropRecords />} />{" "}
          {/* ✅ New route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
