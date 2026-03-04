import type { PageServerLoad } from './$types';
import { getAllContactUsHistory, getAllDemoRequests, getContactUsHistoryCount, getDemoRequestsCount } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  return {
    recentContacts: getAllContactUsHistory({ limit: 5, orderBy: 'created_at', orderDir: 'DESC' }),
    recentDemos: getAllDemoRequests({ limit: 5, orderBy: 'created_at', orderDir: 'DESC' }),
    stats: {
      totalContacts: getContactUsHistoryCount(),
      unreadContacts: getContactUsHistoryCount('unread'),
      totalDemos: getDemoRequestsCount(),
      verifiedDemos: getDemoRequestsCount({ emailVerified: true }),
      pendingDemos: getDemoRequestsCount({ status: 'pending' })
    }
  };
};
