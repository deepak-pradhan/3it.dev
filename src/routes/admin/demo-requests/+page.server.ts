import type { PageServerLoad, Actions } from './$types';
import { getAllDemoRequests, getDemoRequestsCount, updateDemoRequestStatus } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '$lib/server/rate-limit';

export const load: PageServerLoad = async ({ url }) => {
  const status = url.searchParams.get('status') || undefined;
  const verified = url.searchParams.get('verified');
  const pageNum = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const emailVerified = verified === 'true' ? true : verified === 'false' ? false : undefined;

  const demos = getAllDemoRequests({
    status,
    emailVerified,
    limit,
    offset,
    orderBy: 'created_at',
    orderDir: 'DESC'
  });

  const total = getDemoRequestsCount({ status, emailVerified });

  return {
    demos,
    pagination: {
      page: pageNum,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    filters: { status, verified }
  };
};

const VALID_DEMO_STATUSES = ['pending', 'verified', 'contacted', 'completed'];

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    // Rate limiting to prevent DoS on admin actions
    const rateLimitKey = getRateLimitKey(request, 'admin-action');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.adminAction);
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, { error: `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` });
    }

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    const status = formData.get('status') as string;

    if (!id || !status || !VALID_DEMO_STATUSES.includes(status)) {
      return fail(400, { error: 'Invalid request' });
    }

    updateDemoRequestStatus(id, status);
    return { success: true };
  }
};
