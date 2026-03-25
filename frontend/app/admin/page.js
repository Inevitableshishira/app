import AdminPage from '@/components/AdminPage';

export const metadata = {
  title: 'Admin — ApexForge Studio',
  robots: { index: false, follow: false },
};

export default function AdminRoute() {
  return <AdminPage />;
}
