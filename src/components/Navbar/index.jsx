import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { HiOutlineHeart, HiHeart, HiMenuAlt4, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const location = useLocation();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll freeze for mobile menu overlay polish
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 bg-white 
        ${isScrolled ? "shadow-md py-3.5 border-b border-gray-100" : "shadow-sm py-4 border-b border-transparent"}`}>
        <div className="px-4 flex items-center flex-wrap">
          <Link to="/" className="flex items-center space-x-2.5 mr-12 group">
            <div className="w-9 h-9 rounded-lg bg-dwelling-accent flex items-center justify-center transition-transform duration-300
             group-hover:scale-105 active:scale-95 shadow-xs">
              <FaHome className="text-white text-base" />
            </div>
            <span className="text-2xl font-bold tracking-wide text-black transition-colors duration-300 
            group-hover:text-dwelling-accent">DWELLING</span>
          </Link>

          <div className="hidden md:flex items-center space-x-12 mx-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.name} to={link.path} className={`text-lg font-semibold relative py-1 transition-colors duration-300 
                  ${isActive ? "text-black" : "text-gray-600 hover:text-black"}`}>
                  {link.name}
                  {isActive && (<motion.span layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-dwelling-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />)}
                </Link>);
            })}
          </div>

          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <Link to="/wishlist" aria-label="Wishlist"
              className="relative p-2 rounded-full hover:bg-gray-50 transition-all duration-300 active:scale-90 group">
              {wishlist.length > 0 ? (<HiHeart className="text-2xl text-dwelling-accent" />) : 
                (<HiOutlineHeart className="text-2xl text-black group-hover:text-dwelling-accent transition-colors" />)}

              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 
                    bg-dwelling-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full
                    border border-white shadow-xs">{wishlist.length}</motion.span>)}
              </AnimatePresence>
            </Link>

            <Link to="/" className="px-6 py-2.5 text-black border border-dwelling-accent text-sm font-medium rounded-lg
             shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-97 transition-all duration-300">
              Login</Link>
          </div>

          <button className="md:hidden text-black ml-auto p-2 rounded-lg hover:bg-gray-50 active:scale-95 transition-all 
            duration-300" aria-label="Toggle menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (<HiX className="text-2xl" />) : (<HiMenuAlt4 className="text-2xl" />)}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }} className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
              <div className="px-6 py-5 flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-semibold transition-colors duration-200 py-1 ${
                        isActive ? "text-dwelling-accent" : "text-gray-700 hover:text-black"}`}>{link.name}</Link>)
                })}

                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center 
                    text-lg font-semibold text-black hover:text-dwelling-accent transition-colors">
                    {wishlist.length > 0 ? (
                      <HiHeart className="text-xl mr-2 text-dwelling-accent" />) :
                      (<HiOutlineHeart className="text-xl mr-2 text-gray-700" />)}Wishlist
                    <span className="ml-1.5 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-md">
                      {wishlist.length}</span>
                  </Link>

                  <Link to="/" onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-2.5 bg-dwelling-accent text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg active:scale-97 transition-all duration-300">Login</Link>
                </div>
              </div>
            </motion.div>)}
        </AnimatePresence>
      </nav>
    </>
  );
}
