import { Suspense } from "react";

// routes config
import routes from "../routes";
import { Flex, Spin } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";

const loading = (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spin size="large" />
  </div>
);

function AppContent() {
  return (
    <Suspense fallback={loading}>
      <Routes>
        {routes.map((route, index) => {
          return (
            route.element && (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            )
          );
        })}
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppContent;
