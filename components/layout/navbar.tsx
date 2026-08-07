import React from 'react';
import { NavbarClient } from './navbar-client';
import { getCurrentUserProfile } from '@/lib/db/queries/users';

export async function Navbar() {
  const profile = await getCurrentUserProfile();

  return <NavbarClient profile={profile} />;
}
