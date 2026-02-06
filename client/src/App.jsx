import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentHome from "./pages/student/StudentHome";
import AdminHome from "./pages/admin/AdminHome";

function Protected({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
}

function AdminOnly({ children }) {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/student" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/student"
          element={
            <Protected>
              <StudentHome />
            </Protected>
          }
        />

        <Route
          path="/admin"
          element={
            <Protected>
              <AdminOnly>
                <AdminHome />
              </AdminOnly>
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
