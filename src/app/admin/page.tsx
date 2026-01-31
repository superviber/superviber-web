import { notFound } from 'next/navigation';
import { AdminTool } from '@/components/admin/AdminTool';

export default function AdminPage() {
  // Disable in production - admin only works in local dev
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <AdminTool />;
}
