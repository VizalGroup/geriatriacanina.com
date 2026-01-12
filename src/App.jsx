import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/Users/Users";
import Pets from "./components/Pets/Pets";
import PetDetail from "./components/Pets/PetDetail/PetDetail";
import UserRegistration from "./components/PublicForms/UserRegistration";
import ForgotPassword from "./components/PublicForms/ForgotPassword";
import ResetPassword from "./components/PublicForms/ResetPassword";
import UpdateUserCredentials from "./components/UpdateUserCredentials";
import Prescriptions from "./components/Precriptions/Prescriptions";
import SystemNotes from "./components/SystemNotes/SystemNotes";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro_de_usuarios" element={<UserRegistration />} />
        <Route path="/recuperar_contrasena" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/inicio" element={<Dashboard />} />
        <Route path="/inicio/actualizar_credenciales" element={<UpdateUserCredentials />} />
        <Route path="/inicio/usuarios" element={<Users />} />
        <Route path="/inicio/mascotas" element={<Pets />} />
        <Route path="/inicio/mascotas/:id" element={<PetDetail />} />
        <Route path="/inicio/indicaciones" element={<Prescriptions />} />
        <Route path="/inicio/notas-del-sistema" element={<SystemNotes />} />
      </Routes>
    </>
  );
}

export default App;
