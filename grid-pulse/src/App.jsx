import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import NotFound from "./pages/NotFound";
import DataEntry from "./pages/DataEntry";
import SubstationEntry from "./pages/SubstationEntry";
import Employees from "./pages/Employees";
import SubstationDetails from "./pages/SubstationDetails";
import AssignEmployee from "./pages/AssignEmployee";
import Substations from "./pages/Substation";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with layout container */}
      <Route
        path="/dashboard"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/data-entry"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/substation-entry"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <SubstationEntry />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/substations"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <Substations />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/employees"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/assign-employee"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <AssignEmployee />
            </ProtectedRoute>
          </div>
        }
      />
      <Route
        path="/substation/:substationName"
        element={
          <div className="w-[100vw] h-[100vh] min-h-screen flex bg-[#211F1E] overflow-x-hidden relative">
            <ProtectedRoute>
              <SubstationDetails />
            </ProtectedRoute>
          </div>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
