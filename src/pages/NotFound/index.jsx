import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="bg-dwelling-light min-h-[80vh] flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <h1 className="text-9xl font-serif text-dwelling-primary opacity-20 select-none">404</h1>
        <div className="-mt-12 mb-8">
          <h2 className="text-3xl font-serif text-dwelling-dark mb-4">Page Not Found</h2>
          <p className="text-dwelling-muted max-w-md mx-auto font-light">
            The space you are looking for doesn't exist in our portfolio. It may have been moved or is no longer available.</p>
        </div>
        <Link to="/" className="inline-block px-8 py-4 bg-dwelling-primary text-white hover:bg-dwelling-accent 
        rounded-full transition-colors duration-300 tracking-widest uppercase text-sm font-medium shadow-lg hover:shadow-xl 
        hover:-translate-y-1 transform">Return Home</Link>
      </div>
    </motion.div>
  );
}
