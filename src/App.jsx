import React, { Suspense } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WishlistProvider } from "./context/WishlistContext";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loaded pages
const Home = React.lazy(() => import("./pages/Home"));
const Properties = React.lazy(() => import("./pages/Properties"));
const PropertyDetails = React.lazy(() => import("./pages/PropertyDetails"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Simple loading spinner for Suspense fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-dwelling-light">
    <div className="w-12 h-12 border-4 border-dwelling-muted border-t-dwelling-accent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <WishlistProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
    </WishlistProvider>
  );
}

export default App;
