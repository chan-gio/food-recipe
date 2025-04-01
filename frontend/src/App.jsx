import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';
import { Routes } from './Routers/allrouters'; // Import file allroutes.jsx

const App = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    {Routes.map(({ path, component }, index) => (
                        <Route key={index} path={path} element={component} />
                    ))}
                </Switch>
            </Suspense>
        </Router>
    );
};

export default App;
