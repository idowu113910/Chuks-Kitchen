import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, type JSX } from "react";
import Footer from "./layout/Footer";
import SplashScreen from "./pages/00-onboarding/SplashScreen";
import OnBoarding from "./pages/00-onboarding/OnBoarding";
import Login from "./pages/01-login/Login";
import SignUp from "./pages/01-login/SignUp";
import Home from "./pages/02-home/Home";
import Payment from "./pages/02-home/Payment";
import Verify from "./pages/01-login/Verify";
import Welcome from "./pages/01-login/Welcome";
import Map from "./pages/01-login/Map";
import { FooterProvider, useFooter } from "./context/FooterContext";

const RootLayout = (): JSX.Element => {
  const { hideFooter } = useFooter();

  return (
    <>
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};

// Splash Screen wrapper for Onboarding
const HomeWithSplash = (): JSX.Element => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className={showSplash ? "hidden" : "block"}>
        <OnBoarding />
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeWithSplash />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return (
    <FooterProvider>
      <RouterProvider router={router} />
    </FooterProvider>
  );
}

export default App;
