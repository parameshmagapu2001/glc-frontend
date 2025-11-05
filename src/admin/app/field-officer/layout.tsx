'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
import FieldOfficerProvider from 'src/components/field-officer/context/field-officer-provider';
// components
import DashboardLayout from 'src/layouts/dashboard';
import Footer from './Footer';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <FieldOfficerProvider>
        <DashboardLayout>{children}</DashboardLayout>
        <Footer/>
      </FieldOfficerProvider>
    </AuthGuard>
  );
}

 