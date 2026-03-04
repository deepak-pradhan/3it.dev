import type { LayoutServerLoad } from './$types';
import { getContactUsHistoryCount, getDemoRequestsCount } from '$lib/server/db';

export const load: LayoutServerLoad = async () => {
  return {
    stats: {
      unreadContacts: getContactUsHistoryCount('unread'),
      totalContacts: getContactUsHistoryCount(),
      pendingDemos: getDemoRequestsCount({ status: 'pending' }),
      verifiedDemos: getDemoRequestsCount({ emailVerified: true }),
      totalDemos: getDemoRequestsCount()
    }
  };
};
