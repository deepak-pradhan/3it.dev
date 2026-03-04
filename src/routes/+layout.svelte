<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { ThemeToggle } from '$lib/components/ui/theme-toggle';

  let { children } = $props();
  let mobileMenuOpen = $state(false);

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/platform', label: 'Platform' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  function isActive(href: string): boolean {
    return page.url.pathname.startsWith(href);
  }
</script>

<svelte:head>
  <title>3IT.dev - Enterprise RAD Platform</title>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.classList.add(theme);
    })();
  </script>
</svelte:head>

<div class="min-h-screen flex flex-col relative overflow-x-hidden">
  <!-- Skip Navigation Link for Keyboard Accessibility -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
  >
    Skip to main content
  </a>

  <!-- Background orbs -->
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-orb bg-orb-3"></div>

  <!-- Navigation -->
  <header class="py-4 sticky top-0 z-50">
    <nav class="max-w-6xl mx-auto px-6">
      <div class="glass rounded-2xl px-6 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <a href="/" class="text-xl font-semibold tracking-tight dark:text-white">
            3IT<span class="font-normal text-emerald-500">.dev</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            {#each navLinks as link}
              <a
                href={link.href}
                class="text-sm link-underline transition-colors {isActive(link.href)
                  ? 'text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'}"
              >
                {link.label}
              </a>
            {/each}
            <ThemeToggle />
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              class="text-gray-600 dark:text-gray-300"
              onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
              aria-label="Menu"
            >
              {#if mobileMenuOpen}
                <span class="text-sm">Close</span>
              {:else}
                <span class="text-sm">Menu</span>
              {/if}
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        {#if mobileMenuOpen}
          <div class="md:hidden pt-6 pb-2">
            <div class="flex flex-col gap-4">
              {#each navLinks as link}
                <a
                  href={link.href}
                  onclick={() => (mobileMenuOpen = false)}
                  class="text-2xl font-light {isActive(link.href)
                    ? 'text-black dark:text-white'
                    : 'text-gray-400 hover:text-black dark:hover:text-white'}"
                >
                  {link.label}
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main id="main-content" class="flex-grow" tabindex="-1">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="py-12 mt-20">
    <div class="max-w-6xl mx-auto px-6">
      <div class="glass rounded-2xl p-8">
        <div class="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div class="text-sm font-medium mb-4 dark:text-white">3IT.dev</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
              Enterprise RAD Platform with AI-Human Collaboration
            </p>
          </div>

          <div class="flex gap-8 sm:gap-12">
            <div>
              <div class="text-xs text-gray-400 uppercase tracking-wider mb-3">Products</div>
              <div class="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <a href="/products#canvas" class="hover:text-white transition-colors">Business Canvas</a>
                <a href="/products#phyto" class="hover:text-white transition-colors">Phyto Platform</a>
                <a href="/products#bcm" class="hover:text-white transition-colors">BCM System</a>
              </div>
            </div>

            <div>
              <div class="text-xs text-gray-400 uppercase tracking-wider mb-3">Contact</div>
              <div class="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <a href="mailto:hello@3it.dev" class="hover:text-white transition-colors">
                  hello@3it.dev
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} 3IT.dev
        </div>
      </div>
    </div>
  </footer>
</div>
