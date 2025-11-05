'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
import AdminLayout from 'src/layouts/dashboard/admin-layout';
import Footer from './Footer';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
      <Footer/>
    </AuthGuard>
  );
}
