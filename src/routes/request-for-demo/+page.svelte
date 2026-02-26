<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();

  let isSubmitting = $state(false);
  let verificationCode = $state('');

  // Derive state from form response
  const showVerification = $derived(form?.needsVerification && !form?.success);
  const showSuccess = $derived(form?.success);
  const currentRequestId = $derived(form?.requestId);
</script>

<svelte:head>
  <title>Request Demo - Phyto Platform - 3IT.dev</title>
  <meta name="description" content="Request a demo of the Phyto Platform - Traditional Medicine Intelligence" />
</svelte:head>

<section class="max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-16">
  <div class="text-emerald-500 text-sm font-mono mb-4">Phyto Platform</div>
  <h1 class="text-4xl md:text-5xl font-semibold tracking-tight dark:text-white">
    Request a Demo
  </h1>
  <p class="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
    Experience the power of computational ethnopharmacology and natural products drug discovery.
  </p>
</section>

<section class="max-w-6xl mx-auto px-6 pb-20">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-2">
      <div class="glass rounded-2xl p-8">
        {#if showSuccess}
          <div class="py-12 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-medium mb-2 dark:text-white">Demo Request Confirmed</h2>
            <p class="text-gray-600 dark:text-gray-300">We'll be in touch within 24 hours to schedule your demo.</p>
            <p class="text-gray-500 text-sm mt-4">A confirmation email has been sent to your inbox.</p>
          </div>
        {:else if showVerification}
          <form
            method="POST"
            action="?/verify"
            use:enhance={() => {
              isSubmitting = true;
              return async ({ update }) => {
                isSubmitting = false;
                await update();
              };
            }}
            class="space-y-6"
          >
            <div class="text-center mb-8">
              <div class="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-2xl font-medium mb-2 dark:text-white">Check your email</h2>
              <p class="text-gray-600 dark:text-gray-300">We've sent a 6-digit verification code to your email address.</p>
            </div>

            <input type="hidden" name="requestId" value={currentRequestId} />

            <div>
              <label for="code" class="block text-sm text-gray-400 mb-2">Verification Code</label>
              <input
                type="text"
                id="code"
                name="code"
                bind:value={verificationCode}
                required
                maxlength="6"
                inputmode="numeric"
                autocomplete="one-time-code"
                class="w-full px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                placeholder="000000"
              />
            </div>

            {#if form?.error}
              <div class="text-red-400 text-sm text-center">{form.error}</div>
            {/if}

            <div class="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || verificationCode.length !== 6}
                class="flex-1 inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                type="button"
                onclick={async () => {
                  const formData = new FormData();
                  formData.append('requestId', String(currentRequestId));
                  await fetch('?/resend', { method: 'POST', body: formData });
                }}
                class="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Resend code
              </button>
            </div>
          </form>
        {:else}
          <form
            method="POST"
            action="?/submit"
            use:enhance={() => {
              isSubmitting = true;
              return async ({ update }) => {
                isSubmitting = false;
                await update();
              };
            }}
            class="space-y-6"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label for="email" class="block text-sm text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="organization" class="block text-sm text-gray-400 mb-2">Organization *</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Acme Pharma Inc."
                />
              </div>
              <div>
                <label for="role" class="block text-sm text-gray-400 mb-2">Role *</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Research Director"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="phone" class="block text-sm text-gray-400 mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label for="preferred_datetime" class="block text-sm text-gray-400 mb-2">Preferred Date/Time *</label>
                <input
                  type="datetime-local"
                  id="preferred_datetime"
                  name="preferred_datetime"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            {#if form?.error}
              <div class="text-red-400 text-sm">{form.error}</div>
            {/if}

            <button
              type="submit"
              disabled={isSubmitting}
              class="inline-flex items-center px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Request Demo'}
            </button>
          </form>
        {/if}
      </div>
    </div>

    <div class="space-y-4">
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Platform</div>
        <div class="text-lg dark:text-white">Phyto Platform</div>
        <p class="text-sm text-gray-500 mt-2">Traditional Medicine Intelligence</p>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-3">Data Coverage</div>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-emerald-500">14K+</div>
            <div class="text-sm text-gray-500">Medicinal Plants</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-emerald-500">908K+</div>
            <div class="text-sm text-gray-500">Compounds</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-emerald-500">833K+</div>
            <div class="text-sm text-gray-500">Traditional Uses</div>
          </div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Demo Duration</div>
        <div class="text-lg dark:text-white">30-45 minutes</div>
      </div>
    </div>
  </div>
</section>
