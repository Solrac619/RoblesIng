// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './componentes/sidebard/sidebard';
import Login from './Login/login';
import Dashboard from './dash/Dashboard';
import CRUDS from './CRUDS/crudproveedor';
import CRUDP from './CRUDS/crudproyectos';
import CRUDUS from './CRUDS/crudusuarios';
import CrudG from './vista/gastorealvspresupuesto';
import PDF from './PDF/docPDF';
import CrudM from './CRUDS/crudmaterailes';
import CrudR from './CRUDS/crudRubro';
import Detalles from './CRUDS/presupuestodetalles';
import { AuthProvider } from './autenticacion/auth';
import ProtectedRoute from './proteccion/protect';

const AppContent = () => {
  const location = useLocation();
  return (
    <div className="flex">
      {location.pathname !== '/' && <Sidebar />}
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/crudproveedor" element={
            <ProtectedRoute>
              <CRUDS />
            </ProtectedRoute>
          } />
          <Route path="/crudproyectos" element={
            <ProtectedRoute>
              <CRUDP />
            </ProtectedRoute>
          } />
          <Route path="/crudusuarios" element={
            <ProtectedRoute>
              <CRUDUS />
            </ProtectedRoute>
          } />
          <Route path="/crudGasto" element={
            <ProtectedRoute>
              <CrudG />
            </ProtectedRoute>
          } />
          <Route path="/crudMaterial" element={
            <ProtectedRoute>
              <CrudM />
            </ProtectedRoute>
          } />
          <Route path="/crudRubro" element={
            <ProtectedRoute>
              <CrudR />
            </ProtectedRoute>
          } />
          <Route path="/detalles/:proyectoId" element={
            <ProtectedRoute>
              <Detalles />
            </ProtectedRoute>
          } />
          <Route path="/doc" element={
            <ProtectedRoute>
              <PDF />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
