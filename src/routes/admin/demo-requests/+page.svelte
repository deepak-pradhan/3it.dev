<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { data } = $props();

  function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function updateFilter(key: string, value: string | null) {
    const url = new URL($page.url);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    url.searchParams.delete('page');
    goto(url.toString());
  }

  function buildPageUrl(pageNum: number): string {
    const url = new URL($page.url);
    url.searchParams.set('page', pageNum.toString());
    return url.toString();
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-semibold text-white">Demo Requests</h1>
      <p class="text-gray-400 mt-2">{data.pagination.total} total requests</p>
    </div>
  </div>

  <!-- Filters -->
  <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4">
    <select
      class="px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 [&>option]:bg-zinc-800 [&>option]:text-white"
      value={data.filters.status || ''}
      onchange={(e) => updateFilter('status', e.currentTarget.value || null)}
    >
      <option value="">All statuses</option>
      <option value="pending">Pending</option>
      <option value="verified">Verified</option>
      <option value="contacted">Contacted</option>
      <option value="completed">Completed</option>
    </select>

    <select
      class="px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 [&>option]:bg-zinc-800 [&>option]:text-white"
      value={data.filters.verified || ''}
      onchange={(e) => updateFilter('verified', e.currentTarget.value || null)}
    >
      <option value="">All verification states</option>
      <option value="true">Email verified</option>
      <option value="false">Not verified</option>
    </select>
  </div>

  <!-- Table -->
  <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
    {#if data.demos.length === 0}
      <p class="text-gray-400 text-center py-12">No demo requests found</p>
    {:else}
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/10">
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Name</th>
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Organization</th>
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Email</th>
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Preferred Time</th>
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Status</th>
            <th class="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {#each data.demos as demo}
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-6 py-4">
                <div class="font-medium text-white">{demo.name}</div>
                <div class="text-sm text-gray-400">{demo.role}</div>
              </td>
              <td class="px-6 py-4 text-white">{demo.organization}</td>
              <td class="px-6 py-4">
                <a href="mailto:{demo.email}" class="text-emerald-500 hover:text-emerald-400">{demo.email}</a>
                {#if demo.phone}
                  <div class="text-sm text-gray-400">{demo.phone}</div>
                {/if}
              </td>
              <td class="px-6 py-4 text-white">
                {#if demo.preferred_datetime}
                  {new Date(demo.preferred_datetime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                {:else}
                  <span class="text-gray-400">—</span>
                {/if}
              </td>
              <td class="px-6 py-4">
                <form method="POST" action="?/updateStatus" use:enhance>
                  <input type="hidden" name="id" value={demo.id} />
                  <select
                    name="status"
                    onchange={(e) => e.currentTarget.form?.requestSubmit()}
                    class="px-3 py-1.5 text-sm rounded-lg bg-zinc-800 border border-white/10 text-white outline-none focus:border-emerald-500 [&>option]:bg-zinc-800 [&>option]:text-white"
                  >
                    <option value="pending" selected={demo.status === 'pending'}>Pending</option>
                    <option value="verified" selected={demo.status === 'verified'}>Verified</option>
                    <option value="contacted" selected={demo.status === 'contacted'}>Contacted</option>
                    <option value="completed" selected={demo.status === 'completed'}>Completed</option>
                  </select>
                </form>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-400">{formatDate(demo.created_at)}</div>
                <div class="text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                  {demo.email_verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                  {demo.email_verified ? 'Verified' : 'Unverified'}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <!-- Pagination -->
  {#if data.pagination.totalPages > 1}
    <div class="flex justify-center gap-2">
      {#each Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1) as pageNum}
        <a
          href={buildPageUrl(pageNum)}
          class="px-4 py-2 rounded-xl transition-all
            {pageNum === data.pagination.page
              ? 'bg-emerald-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
        >
          {pageNum}
        </a>
      {/each}
    </div>
  {/if}
</div>
