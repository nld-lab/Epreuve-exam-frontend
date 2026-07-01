import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { HomePage } from "@/pages/public/HomePage";
import { PoleFilieresPage } from "@/pages/public/PoleFilieresPage";
import { EpreuvesPage } from "@/pages/public/EpreuvesPage";
import { EpreuveDetailPage } from "@/pages/public/EpreuveDetailPage";

import { LoginPage } from "@/pages/admin/LoginPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { FilieresAdminPage } from "@/pages/admin/FilieresAdminPage";
import { EpreuvesAdminPage } from "@/pages/admin/EpreuvesAdminPage";
import { PolesAdminPage } from "@/pages/admin/PolesAdminPage";
import { AnneesAdminPage } from "@/pages/admin/AnneesAdminPage";
import { AdminsAdminPage } from "@/pages/admin/AdminsAdminPage";

function App() {
  return (
    <Routes>
      {/* Espace public (etudiants) */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="poles/:poleId" element={<PoleFilieresPage />} />
        <Route path="epreuves" element={<EpreuvesPage />} />
        <Route path="epreuves/:id" element={<EpreuveDetailPage />} />
      </Route>

      {/* Connexion admin */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Espace admin protege */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="epreuves" element={<EpreuvesAdminPage />} />

          {/* Routes reservees au SuperAdmin */}
          <Route element={<ProtectedRoute requireSuperAdmin />}>
            <Route path="poles" element={<PolesAdminPage />} />
            <Route path="filieres" element={<FilieresAdminPage />} />
            <Route path="annees" element={<AnneesAdminPage />} />
            <Route path="admins" element={<AdminsAdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
