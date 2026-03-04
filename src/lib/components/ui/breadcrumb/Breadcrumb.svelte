<script lang="ts">
  import { page } from '$app/stores';

  interface BreadcrumbItem {
    label: string;
    href: string;
  }

  const labels: Record<string, string> = {
    services: 'Services',
    portfolio: 'Work',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
  };

  let breadcrumbs = $derived.by(() => {
    const pathname = $page.url.pathname;
    if (pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = labels[segment] || segment.split('-').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      items.push({ label, href: currentPath });
    }

    return items;
  });

  let isVisible = $derived(breadcrumbs.length > 1);
</script>

{#if isVisible}
  <nav aria-label="Breadcrumb" class="max-w-6xl mx-auto px-6 pt-4">
    <ol class="flex items-center gap-2 text-sm">
      {#each breadcrumbs as crumb, i}
        {#if i > 0}
          <li class="text-gray-600 dark:text-gray-400" aria-hidden="true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </li>
        {/if}
        <li>
          {#if i === breadcrumbs.length - 1}
            <span class="text-gray-600 dark:text-gray-400" aria-current="page">{crumb.label}</span>
          {:else}
            <a href={crumb.href} class="text-gray-600 dark:text-gray-400 hover:text-white transition-colors">
              {crumb.label}
            </a>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
