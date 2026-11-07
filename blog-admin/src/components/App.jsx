import { useState, useRef, useEffect } from "react"
import Login  from './Login'
import Blog from './Blog'
import SignUp from './SignUp'
import Edit from './Edit'

import UnProtectedRoute from "./protected/UnProtectedRoute";
import ProtectedRoute from "./protected/ProtectedRoute";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


export default function App() {

    return (
        <main>
            <BrowserRouter>
            <Routes>

                <Route
                path="/"
                element={
                    <UnProtectedRoute>
                        <Login />
                    </UnProtectedRoute>
                }
                />

                <Route
                path="/sign_up"
                element={
                    <UnProtectedRoute>
                        <SignUp />
                    </UnProtectedRoute>
                }
                />

                <Route
                path="/blog"
                element={
                    <ProtectedRoute>
                        <Blog />
                    </ProtectedRoute>
                }
                />

                <Route
                path="/post/:postId"
                element={
                    <ProtectedRoute>
                        <Edit />
                    </ProtectedRoute>
                }
                />

            </Routes>
            </BrowserRouter>
        </main>
    )
}