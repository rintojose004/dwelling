import Hero from '../../components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import LocalityInsights from '@/components/LocalityInsights';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Hero />
      <FeaturedProperties />
      <LocalityInsights />
    </motion.div>
  );
}
