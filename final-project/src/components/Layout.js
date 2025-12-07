import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>TAC404 - Esther Kim - Fall 2025</p>
      </footer>
    </div>
  );
}