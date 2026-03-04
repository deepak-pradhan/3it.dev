<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { data } = $props();
  let expandedId = $state<number | null>(null);

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

  function toggleExpand(id: number) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-semibold text-white">Contacts</h1>
      <p class="text-gray-400 mt-2">{data.pagination.total} total messages</p>
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
      <option value="unread">Unread</option>
      <option value="read">Read</option>
      <option value="replied">Replied</option>
      <option value="archived">Archived</option>
    </select>
  </div>

  <!-- Contacts List -->
  <div class="space-y-4">
    {#if data.contacts.length === 0}
      <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
        <p class="text-gray-500">No contact messages found</p>
      </div>
    {:else}
      {#each data.contacts as contact}
        <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <!-- Header -->
          <button
            onclick={() => toggleExpand(contact.id)}
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span class="font-medium text-white">{contact.name}</span>
                {#if contact.company}
                  <span class="text-gray-400">({contact.company})</span>
                {/if}
                <span class="text-xs px-2 py-0.5 rounded-full
                  {contact.status === 'unread' ? 'bg-blue-500/20 text-blue-400' :
                   contact.status === 'replied' ? 'bg-emerald-500/20 text-emerald-400' :
                   'bg-gray-500/20 text-gray-400'}">
                  {contact.status}
                </span>
              </div>
              <div class="text-sm text-gray-400 truncate mt-1">{contact.message}</div>
            </div>
            <div class="text-right ml-4 flex-shrink-0">
              <div class="text-xs text-gray-400">{formatDate(contact.created_at)}</div>
              <div class="text-emerald-500 text-sm mt-1">{contact.email}</div>
            </div>
          </button>

          <!-- Expanded Content -->
          {#if expandedId === contact.id}
            <div class="px-6 pb-6 border-t border-white/10">
              <div class="pt-4 space-y-4">
                <!-- Message -->
                <div>
                  <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</div>
                  <div class="bg-white/5 rounded-xl p-4 text-white whitespace-pre-wrap">{contact.message}</div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-4">
                  <a
                    href="mailto:{contact.email}?subject=Re: Your message to 3IT.dev"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Reply via Email
                  </a>

                  <form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
                    <input type="hidden" name="id" value={contact.id} />
                    <select
                      name="status"
                      onchange={(e) => e.currentTarget.form?.requestSubmit()}
                      class="px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/10 text-white outline-none focus:border-emerald-500 [&>option]:bg-zinc-800 [&>option]:text-white"
                    >
                      <option value="unread" selected={contact.status === 'unread'}>Unread</option>
                      <option value="read" selected={contact.status === 'read'}>Read</option>
                      <option value="replied" selected={contact.status === 'replied'}>Replied</option>
                      <option value="archived" selected={contact.status === 'archived'}>Archived</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
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
