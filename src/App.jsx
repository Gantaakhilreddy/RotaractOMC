import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage.jsx'
import EventsPage from "./components/EventsPage.jsx";
import TeamPage from "./components/TeamPage.jsx";
import GalleryPage from "./components/GalleyPage.jsx";
import ContactPage from "./components/ContactPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
