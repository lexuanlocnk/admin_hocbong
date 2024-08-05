import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Flex, Spin } from "antd";
import PublicRoute from "./publicRoute";
import { PrivateRoute } from "./privateRoute";

const loading = (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spin size="large" />
  </div>
);

// Containers
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = lazy(() => import("./views/pages/login/Login"));
const Page404 = lazy(() => import("./views/pages/page404/Page404"));
const Page500 = lazy(() => import("./views/pages/page500/Page500"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/login" element={<PublicRoute />}>
              <Route
                exact
                path="/login"
                name="Login Page"
                element={<Login />}
              />
              ,
            </Route>
            <Route exact path="/login" name="Login Page" element={<Login />} />,
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" element={<PrivateRoute />}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
