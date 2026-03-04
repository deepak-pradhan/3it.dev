import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { destroySession } from '$lib/server/auth';

// Redirect GET requests - logout should only be POST
export const load: PageServerLoad = async () => {
  redirect(302, '/admin');
};

export const actions: Actions = {
  default: async ({ cookies }) => {
    const sessionId = cookies.get('admin_session');
    if (sessionId) {
      destroySession(sessionId);
    }

    cookies.delete('admin_session', { path: '/' });
    redirect(302, '/admin/login');
  }
};
