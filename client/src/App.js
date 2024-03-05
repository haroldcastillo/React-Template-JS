import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Layouts
import Base from './Layouts/Base/Base';
// Pages
import Default from './Pages/Default/Default';

// Hooks
import { ProtectedRoute } from './Hooks/useAuth';

function App() {
  return (
    <Routes>
      <Route element={<Base />} >
          <Route path="/" element={<Default/>} />
      </Route>
      {/* Sample usage of Protected Route */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
        <Route path="/private" element={<Default/>} />
      </Route>
    </Routes>
  );
}

export default App;
