<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';

  let { children, data }: { children: Snippet; data: { stats: { unreadContacts: number; pendingDemos: number } } } = $props();

  let navItems = $derived([
    { href: '/admin', label: 'Dashboard', badge: 0 },
    { href: '/admin/demo-requests', label: 'Demo Requests', badge: data.stats.pendingDemos },
    { href: '/admin/contacts', label: 'Contacts', badge: data.stats.unreadContacts }
  ]);

  function isActive(href: string): boolean {
    if (href === '/admin') {
      return $page.url.pathname === '/admin';
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<svelte:head>
  <title>Admin - 3IT.dev</title>
</svelte:head>

<div class="min-h-screen flex bg-[#0a0a0a]">
  <!-- Sidebar -->
  <aside class="w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 p-6 flex flex-col">
    <div class="mb-8">
      <a href="/" class="inline-block">
        <span class="text-xl font-bold tracking-tight text-white">3IT</span>
        <span class="text-xl font-light text-emerald-500">.dev</span>
      </a>
      <div class="text-xs text-gray-400 mt-1">Admin Panel</div>
    </div>

    <nav class="space-y-2 flex-1">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center justify-between px-4 py-3 rounded-xl transition-all {isActive(item.href)
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
        >
          <span>{item.label}</span>
          {#if item.badge > 0}
            <span class="px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">
              {item.badge}
            </span>
          {/if}
        </a>
      {/each}
    </nav>

    <div class="pt-4 border-t border-white/10">
      <form method="POST" action="/admin/logout">
        <button
          type="submit"
          class="w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
        >
          Sign out
        </button>
      </form>
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8 overflow-auto">
    {@render children()}
  </main>
</div>
