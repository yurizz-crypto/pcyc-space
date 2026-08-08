import React from 'react';
import { NavbarClient } from './navbar-client';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getCurrentUserNotifications, getUnreadNotificationCount } from '@/lib/db/queries/notifications';
import type { Notification } from '@/lib/db/schema/notifications';

export async function Navbar() {
  const profile = await getCurrentUserProfile();
  let notifications: Notification[] = [];
  let unreadCount = 0;

  if (profile) {
    [notifications, unreadCount] = await Promise.all([
      getCurrentUserNotifications(10),
      getUnreadNotificationCount(profile.id),
    ]);
  }

  return (
    <NavbarClient
      profile={profile}
      initialNotifications={notifications}
      initialUnreadCount={unreadCount}
    />
  );
}
