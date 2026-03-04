<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
  let isSubmitting = $state(false);
</script>

<svelte:head>
  <title>Admin Login - 3IT.dev</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-block">
        <span class="text-3xl font-bold tracking-tight text-white">3IT</span>
        <span class="text-3xl font-light text-emerald-500">.dev</span>
      </a>
    </div>

    <!-- Login Card -->
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-white">Admin Login</h1>
        <p class="text-gray-400 mt-2">Enter your password to continue</p>
      </div>

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
        {#if form?.error}
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {form.error}
          </div>
        {/if}

        <div>
          <label for="password" class="block text-sm text-gray-400 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 transition-all outline-none"
            placeholder="Enter admin password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full px-6 py-3 text-sm font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-gray-400 hover:text-white transition-colors">
          &larr; Back to site
        </a>
      </div>
    </div>
  </div>
</div>
