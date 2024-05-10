// shared components
import Header from "./views/shared/Header";
import Footer from "./views/shared/Footer";

// page components
import Home from "./views/Home";
import About from "./views/About";
import Safety from "./views/Safety";
import Dashboard from "./views/Dashboard";

// Sidebar for homepage
import Sidebar from './views/Sidebar';

// Dependencies (react-router-dom needs these)
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// createContext for sidebard background
import React, { createContext, useState } from 'react';

const ColorContext = createContext();

// the use Location hook cannot be used outside the BrowserRouter.
// this creates a new layout component that wraps the Header, Sidebar, Main and Footer.
function Layout() {

  const [mostFrequentColor, setMostFrequentColor] = useState('');

  // Function to update the most frequent color, which Dashboard will call
  const updateMostFrequentColor = (color) => {
    setMostFrequentColor(color);
  };


  let location = useLocation();
  let showSidebar = location.pathname === '/';

  /* This will make containerClass an empty string until the user is on the homepage then it set the main-container class */
  let containerClass = ['/About', '/Safety', '/Dashboard', '/Footer'].includes(location.pathname) ? '' : 'main-container';

  return (
    <div className={containerClass}>
      <Header location={location}/>
      <ColorContext.Provider value={{ mostFrequentColor, updateMostFrequentColor }}>
        {showSidebar && <Sidebar />}
      </ColorContext.Provider>
      <main>
        <ColorContext.Provider value={{ mostFrequentColor, updateMostFrequentColor }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </ColorContext.Provider>
      </main>
      <Footer location={location}/>
    </div>
  );
}

// this lets the useLocation hook be used in the BrowserRouter.
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
export { ColorContext };
