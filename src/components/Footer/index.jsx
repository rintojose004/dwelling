import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const socialButtonClasses = `w-10 h-10 rounded-full border border-white/20 flex items-center
 justify-center transition-all duration-300 hover:bg-white hover:text-dwelling-accent hover:-translate-y-0.5`
const footerLinkClasses = "hover:text-white transition-colors duration-300";
const contactItemClasses = "flex items-start gap-3";
const contactIconClasses = "text-lg mt-0.5 text-white shrink-0";

export default function Footer() {

  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com", label: "Facebook" },
    { icon: FaInstagram, href: "https://www.instagram.com", label: "Instagram" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com", label: "LinkedIn" },
  ];
  const quickLinks = [
    { label: "Home", to: "/" }, { label: "Properties", to: "/properties" },
    { label: "Wishlist", to: "/wishlist" }, { label: "Contact Us", to: "/contact" },
  ];
  const contactDetails = [
    { icon: HiOutlinePhone, value: "+91 98765 43210" },
    { icon: HiOutlineMail, value: "hello@dwelling.com" },
    { icon: HiOutlineLocationMarker, value: "Bengaluru, Karnataka, India" },
  ];

  return (
    <footer className="bg-dwelling-accent text-white">
      <div className="w-full px-4 md:px-8 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2.5 group mb-5">
              <div
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all
                  duration-300 group-hover:bg-white group-hover:scale-105">
                <FaHome className="text-white group-hover:text-dwelling-accent text-lg transition-colors" />
              </div>
              <span className="text-2xl font-bold tracking-wide text-white">DWELLING</span>
            </Link>

            <p className="text-sm text-white/75 leading-7 max-w-sm">
              Discover architecturally beautiful homes curated for modern
              living. From premium apartments to luxury villas, we help you find
              a place you'll truly love.</p>

            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} className={socialButtonClasses}>
                  <Icon size={15} />
                </a>))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-4 text-white/75 text-sm">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={footerLinkClasses}>{label}</Link>
                </li>))}
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-lg font-semibold mb-5">Contact</h3>
            <div className="space-y-5 text-sm text-white/75">
              {contactDetails.map(({ icon: Icon, value }) => (
                <div key={value} className={contactItemClasses}>
                  <Icon className={contactIconClasses} />
                  <span>{value}</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-white/60">© 2026 Dwelling. All rights reserved.</p>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link to="/properties" className={footerLinkClasses}>Explore Properties</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
