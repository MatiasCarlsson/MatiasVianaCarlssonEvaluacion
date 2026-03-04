import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { NotesPage } from "./pages/NotesPage";
import { ArchivedPage } from "./pages/ArchivedPage";
import { useAppContext } from "./hooks/useAppContext";

const AppRoutes: React.FC = () => {
  const { activeFilter, setActiveFilter } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Sincronizar filtro con ruta actual
  useEffect(() => {
    if (location.pathname === "/archived" && activeFilter !== "archived") {
      setActiveFilter("archived");
    } else if (location.pathname === "/" && activeFilter === "archived") {
      setActiveFilter("active");
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navegar cuando el filtro cambia a/desde 'archived'
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "archived") {
      navigate("/archived");
    } else {
      navigate("/");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<NotesPage onFilterChange={handleFilterChange} />} />
      <Route path="/archived" element={<ArchivedPage onFilterChange={handleFilterChange} />} />
    </Routes>
  );
};

const App: React.FC = () => <AppRoutes />;

export default App;
