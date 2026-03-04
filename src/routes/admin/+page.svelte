<script lang="ts">
  let { data } = $props();

  function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-semibold text-white">Dashboard</h1>
    <p class="text-gray-400 mt-2">Overview of demo requests and contact submissions</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Demo Requests</div>
      <div class="text-3xl font-bold text-emerald-500">{data.stats.totalDemos}</div>
      <div class="text-sm text-gray-400 mt-1">{data.stats.verifiedDemos} verified</div>
    </div>
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Pending Demos</div>
      <div class="text-3xl font-bold text-amber-500">{data.stats.pendingDemos}</div>
      <div class="text-sm text-gray-400 mt-1">Awaiting follow-up</div>
    </div>
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Contact Messages</div>
      <div class="text-3xl font-bold text-blue-500">{data.stats.totalContacts}</div>
      <div class="text-sm text-gray-400 mt-1">{data.stats.unreadContacts} unread</div>
    </div>
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Verification Rate</div>
      <div class="text-3xl font-bold text-purple-500">
        {data.stats.totalDemos > 0 ? Math.round((data.stats.verifiedDemos / data.stats.totalDemos) * 100) : 0}%
      </div>
      <div class="text-sm text-gray-400 mt-1">Email verification</div>
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Recent Demo Requests -->
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium text-white">Recent Demo Requests</h2>
        <a href="/admin/demo-requests" class="text-sm text-emerald-500 hover:text-emerald-400">View all</a>
      </div>
      {#if data.recentDemos.length === 0}
        <p class="text-gray-400 text-center py-8">No demo requests yet</p>
      {:else}
        <div class="space-y-4">
          {#each data.recentDemos as demo}
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div class="font-medium text-white">{demo.name}</div>
                <div class="text-sm text-gray-400">{demo.organization}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-400">{formatDate(demo.created_at)}</div>
                <div class="text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                  {demo.email_verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                  {demo.email_verified ? 'Verified' : 'Pending'}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Recent Contacts -->
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium text-white">Recent Contacts</h2>
        <a href="/admin/contacts" class="text-sm text-emerald-500 hover:text-emerald-400">View all</a>
      </div>
      {#if data.recentContacts.length === 0}
        <p class="text-gray-400 text-center py-8">No contact submissions yet</p>
      {:else}
        <div class="space-y-4">
          {#each data.recentContacts as contact}
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div class="min-w-0 flex-1">
                <div class="font-medium text-white">{contact.name}</div>
                <div class="text-sm text-gray-400 truncate max-w-[250px]">{contact.message}</div>
              </div>
              <div class="text-right ml-4">
                <div class="text-xs text-gray-400">{formatDate(contact.created_at)}</div>
                <div class="text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                  {contact.status === 'unread' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}">
                  {contact.status}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
