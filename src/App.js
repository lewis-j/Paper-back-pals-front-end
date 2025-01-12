import { useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { fetchUser } from "./features/Authentication";
import * as asyncStatus from "./data/asyncStatus";
import {
  BorrowingHistory,
  LandingPage,
  LendingHistory,
  SettingsPage,
} from "./pages";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { PageLoading, PrivateRoute } from "./components";
import { Footer, Navigation } from "./layout";
import { Login, Signup, ResetPassword } from "./features/Authentication";
import styles from "./style/App.module.scss";
import { AllResults } from "./pages/SearchResults/AllResults";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import { AuthWrapper } from "./features/Authentication/components/AuthWrapper/AuthWrapper";

const Library = lazy(() =>
  import("./pages").then((module) => ({ default: module.Library }))
);
const BorrowedPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.BorrowedPage }))
);
const FriendsPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.FriendsPage }))
);
const FriendsLibrary = lazy(() =>
  import("./pages").then((module) => ({ default: module.FriendsLibrary }))
);
const ProfilePage = lazy(() =>
  import("./pages").then((module) => ({ default: module.ProfilePage }))
);

function App() {
  const userStatus = useSelector((state) => state.authUser.status);
  const isLoading = userStatus === asyncStatus.LOADING;

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route path="/" element={<LandingPage />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route
          path="/app"
          element={
            <AuthWrapper>
              <PrivateRoute>
                <Suspense fallback={<PageLoading />}>
                  <div className={styles.pageContent}>
                    <Navigation />
                  </div>
                </Suspense>
              </PrivateRoute>
            </AuthWrapper>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="results" element={<AllResults />} />
          <Route path="library" element={<Library />} />
          <Route path="borrowed" element={<BorrowedPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="friends" element={<FriendsPage />}>
            <Route path="library" element={<FriendsLibrary />} />
          </Route>
          <Route path="borrowing-history" element={<BorrowingHistory />} />
          <Route path="lending-history" element={<LendingHistory />} />
        </Route>

        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
