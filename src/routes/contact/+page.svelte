<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let isSubmitting = $state(false);
  let isSubmitted = $derived(form?.success === true);
  let error = $derived(form?.error);
</script>

<svelte:head>
  <title>Contact - 3IT.dev</title>
  <meta name="description" content="Get in touch about our RAD Platform." />
</svelte:head>

<section class="max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-16">
  <div class="text-emerald-500 text-sm font-mono mb-4">Contact</div>
  <h1 class="text-4xl md:text-5xl font-semibold tracking-tight dark:text-white">
    Get in touch
  </h1>
  <p class="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
    Ready to accelerate your development? Let's discuss how 3IT.dev can help.
  </p>
</section>

<!-- Content -->
<section class="max-w-6xl mx-auto px-6 pb-20">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Form -->
    <div class="md:col-span-2">
      <div class="glass rounded-2xl p-8">
        {#if isSubmitted}
          <div class="py-12 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-medium mb-2 dark:text-white">Thank you</h2>
            <p class="text-gray-600 dark:text-gray-300">We'll be in touch within 24 hours.</p>
          </div>
        {:else}
          <form
            method="POST"
            use:enhance={() => {
              isSubmitting = true;
              return async ({ update }) => {
                await update();
                isSubmitting = false;
              };
            }}
            class="space-y-6"
          >
            {#if error}
              <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label for="email" class="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div>
              <label for="company" class="block text-sm text-gray-400 mb-2">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-gray-500 transition-all"
                placeholder="ABC Contracting"
              />
            </div>

            <div>
              <label for="message" class="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows="4"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-gray-500 transition-all resize-none"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              class="inline-flex items-center px-6 py-3 text-sm font-medium bg-white text-black rounded-full hover:opacity-90 transition-all glow-subtle disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
        {/if}
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-4">
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</div>
        <a href="mailto:info@3it.dev" class="text-lg dark:text-white hover:text-primary-400 transition-colors">
          info@3it.dev
        </a>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Location</div>
        <div class="text-lg dark:text-white">Charlotte, NC</div>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Response time</div>
        <div class="text-lg dark:text-white">Within 24 hours</div>
      </div>
    </div>
  </div>
</section>
