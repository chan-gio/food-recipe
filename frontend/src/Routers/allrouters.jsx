import React, { lazy } from 'react';


const Homepage = lazy(() => import('../Pages/HomePage/HomePage'));
const ProfilePage = lazy(() => import('../Pages/ProfiePage/ProfilePage'));
const LoginPage = lazy(() => import('../Pages/LoginPage/LoginPage'));


const Routes = [
    { path: "/", component: <Homepage /> },
    { path: "/profile", component: <ProfilePage /> },
    { path: "/login", component: <LoginPage /> },
    
];


export { Routes };
