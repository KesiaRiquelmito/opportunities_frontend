import { Route, Routes } from "react-router-dom";

import FollowedPage from "@/pages/followed.tsx";
import Opportunities from "@/pages/opportunities.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Opportunities />} path="/" />
      <Route element={<FollowedPage/>} path="/followed"/>
    </Routes>
  );
}

export default App;
