import { Route, Routes } from "react-router-dom";

import PublicLayout from "../shared/layouts/PublicLayout";
import DashboardLayout from "../shared/layouts/DashboardLayout";

import ProtectedRoute from "../shared/routes/ProtectedRoute";
import GuestRoute from "../shared/routes/GuestRoute";

import HomePage from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DormsBrowsePage from "../features/dorms/pages/DormsBrowsePage";
import AddDormPage from "../features/dorms/pages/AddDormPage";
import AdminDashboard from "../features/admin/pages/AdminDashboard";

import StudentDashboard from "../features/student/pages/StudentDashboard";
import OwnerDashboard from "../features/owner/pages/OwnerDashboard";

import ProfilePage from "../features/profile/pages/ProfilePage";
import DormDetailsPage from "../features/dorms/pages/DormDetailsPage";

export default function AppRouter() {

    return (

        <Routes>

            <Route element={<PublicLayout />}>

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/dorms"
                    element={<DormsBrowsePage />}
                />

                <Route
                    path="/dorms/:id"
                    element={<DormDetailsPage />}
                />

                <Route element={<GuestRoute />}>

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                </Route>

            </Route>

            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />

                </Route>

            </Route>

            <Route element={<ProtectedRoute roles={["Student"]} />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/student"
                        element={<StudentDashboard />}
                    />

                </Route>

            </Route>

            <Route element={<ProtectedRoute roles={["Owner"]} />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/owner"
                        element={<OwnerDashboard />}
                    />

                    <Route
                        path="/owner/add-dorm"
                        element={<AddDormPage />}
                    />

                </Route>

            </Route>

            <Route element={<ProtectedRoute roles={["User"]} />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                </Route>

            </Route>

        </Routes>

    );

}