import Footer from "components/footer/Footer";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import routes from "routes";
import { PrivateRoute } from "../../middlewares/auth.middleware";

export default function Admin(props: { [x: string]: any }) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes: RoutesType[]): string | boolean => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }

      if (routes[i].subRoutes) {
        for (let j = 0; j < routes[i].subRoutes.length; j++) {
          if (
            window.location.href.indexOf(
              routes[i].layout + "/" + routes[i].subRoutes[j].path
            ) !== -1
          ) {
            setCurrentRoute(routes[i].subRoutes[j].name);
          }
        }
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.subRoutes) {
          return (
            <Route path={`/${prop.path}`} key={key}>
              <Route index element={prop.component} />
              {prop.subRoutes.map((subProp, subKey) => {
                return (
                  <Route
                    path={`${subProp.path}`}
                    element={subProp.component}
                    key={subKey}
                  />
                );
              })}
            </Route>
          );
        } else {
          return (
            <Route path={`/${prop.path}`} element={prop.component} key={key} />
          );
        }
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                <Route element={<PrivateRoute />}>{getRoutes(routes)}</Route>

                <Route
                  path="/"
                  element={<Navigate to="/admin/task" replace />}
                />

                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
