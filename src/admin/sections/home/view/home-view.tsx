'use client';

import { useScroll } from 'framer-motion';
import ScrollProgress from 'src/components/scroll-progress';
import AuthClassicLayout from 'src/layouts/auth/classic';
import { LoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <AuthClassicLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />
      <LoginView />
    </AuthClassicLayout>
  );
}
