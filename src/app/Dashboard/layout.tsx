import React from 'react';
import SideBar from './SideBar';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/Login');
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      <SideBar />
      <div className="ml-64 flex-1">
        {children}
      </div>
    </div>
  );
}
