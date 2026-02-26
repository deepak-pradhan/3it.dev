<script lang="ts">
  import { onMount } from 'svelte';

  const stats = [
    { value: '500x', label: 'Development Speed', detail: '5-8 days to 15 minutes' },
    { value: '98.1%', label: 'Code Reduction', detail: '200 lines to 5 lines' },
    { value: '85%', label: 'NIST Compliance', detail: 'Enterprise security' },
    { value: 'A+', label: 'Enterprise Ready', detail: '98/100 rating' },
  ];

  const products = [
    {
      id: 'canvas',
      name: 'Business Canvas',
      tagline: 'AI-Powered Business Model Management',
      description: 'Self-managing 9-block canvas with autonomous AI agents that continuously optimize your business model.',
      status: 'Production Ready',
      features: ['Autonomous AI management', 'Version control', 'Market validation'],
    },
    {
      id: 'phyto',
      name: 'Phyto Platform',
      tagline: 'Traditional Medicine Intelligence',
      description: 'Evidence-based platform connecting traditional medicine with modern scientific validation. 14K+ plants, 900K+ compounds.',
      status: 'gBETA Pitch',
      features: ['908K compounds', 'Cross-tradition analysis', 'Drug discovery tools'],
      link: '/request-for-demo',
    },
    {
      id: 'bcm',
      name: 'BCM System',
      tagline: 'Business Continuity Management',
      description: 'Comprehensive business continuity planning and disaster recovery management.',
      status: 'In Development',
      features: ['Risk assessment', 'Recovery planning', 'Compliance tracking'],
    },
  ];

  const radFeatures = [
    { name: 'QuickCRUD', reduction: '98.1%', description: 'CRUD operations' },
    { name: 'DataTableBuilder', reduction: '87.8%', description: 'UI tables' },
    { name: 'FormGenerator', reduction: '87.1%', description: 'Form creation' },
    { name: 'DashboardBuilder', reduction: '88.7%', description: 'Dashboards' },
  ];

  let heroRef: HTMLElement;

  onMount(() => {
    // Simple fade-in animation
    if (heroRef) {
      heroRef.style.opacity = '1';
      heroRef.style.transform = 'translateY(0)';
    }
  });
</script>

<svelte:head>
  <title>3IT.dev - Enterprise RAD Platform | 500x Development Speed</title>
  <meta name="description" content="Enterprise RAD Platform with AI-Human Collaboration. 500x development speed, 98.1% code reduction." />
</svelte:head>

<!-- Hero -->
<section
  class="max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-20 opacity-0 translate-y-10 transition-all duration-1000"
  bind:this={heroRef}
  style="opacity: 0; transform: translateY(40px);"
>
  <div class="text-emerald-500 text-sm font-mono mb-4">Enterprise RAD Platform</div>
  <h1 class="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] max-w-4xl dark:text-white">
    Build enterprise apps <span class="text-gradient">500x faster</span>
  </h1>
  <p class="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
    AI-Human collaboration framework that reduces development from weeks to minutes while maintaining enterprise-grade quality.
  </p>
  <div class="mt-10 flex flex-wrap gap-4">
    <a
      href="/products"
      class="inline-flex items-center px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all"
    >
      Explore Products
    </a>
    <a
      href="/platform"
      class="inline-flex items-center px-6 py-3 text-sm font-medium glass rounded-full text-gray-700 dark:text-gray-200 hover:bg-white/20 transition-all"
    >
      Learn More
    </a>
  </div>
</section>

<!-- Stats -->
<section class="max-w-6xl mx-auto px-6 py-16">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
    {#each stats as stat}
      <div class="glass rounded-2xl p-6 text-center">
        <div class="text-3xl md:text-4xl font-bold text-emerald-500">{stat.value}</div>
        <div class="text-sm font-medium dark:text-white mt-2">{stat.label}</div>
        <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">{stat.detail}</div>
      </div>
    {/each}
  </div>
</section>

<!-- Products -->
<section class="max-w-6xl mx-auto px-6 py-20">
  <div class="mb-12">
    <h2 class="text-sm text-gray-400 uppercase tracking-wider mb-4">Products</h2>
    <p class="text-2xl md:text-3xl font-medium dark:text-white max-w-2xl">
      Production-ready business solutions built on our RAD platform.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each products as product}
      <div class="glass rounded-2xl p-6 hover:bg-white/10 dark:hover:bg-white/5 transition-all group flex flex-col" id={product.id}>
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs px-2 py-1 rounded-full {product.status === 'Production Ready' ? 'bg-emerald-500/20 text-emerald-400' : product.status === 'gBETA Pitch' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}">
            {product.status}
          </span>
        </div>
        <h3 class="text-xl font-medium dark:text-white">{product.name}</h3>
        <p class="text-sm text-emerald-500 mb-3">{product.tagline}</p>
        <p class="text-gray-600 dark:text-gray-300 text-sm flex-grow">{product.description}</p>
        <div class="mt-4 pt-4 border-t border-white/10">
          <div class="flex flex-wrap gap-2">
            {#each product.features as feature}
              <span class="text-xs px-2 py-1 glass-subtle rounded text-gray-600 dark:text-gray-300">{feature}</span>
            {/each}
          </div>
        </div>
        {#if product.link}
          <a href={product.link} target="_blank" class="mt-4 text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
            View Demo →
          </a>
        {/if}
      </div>
    {/each}
  </div>
</section>

<!-- RAD Platform -->
<section class="max-w-6xl mx-auto px-6 py-20">
  <div class="glass-strong rounded-3xl p-10 md:p-16">
    <div class="mb-10">
      <h2 class="text-sm text-emerald-500 uppercase tracking-wider mb-4">RAD Platform</h2>
      <p class="text-2xl md:text-3xl font-medium dark:text-white">
        Revolutionary code reduction across all components
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {#each radFeatures as feature}
        <div class="text-center">
          <div class="text-2xl md:text-3xl font-bold text-emerald-500">{feature.reduction}</div>
          <div class="text-sm font-medium dark:text-white mt-2">{feature.name}</div>
          <div class="text-xs text-gray-600 dark:text-gray-300">{feature.description}</div>
        </div>
      {/each}
    </div>

    <div class="mt-10 pt-8 border-t border-white/10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div class="text-lg font-medium dark:text-white">AI-Human Collaboration</div>
          <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">
            First-of-kind autonomous business management with strategic human oversight
          </p>
        </div>
        <a
          href="/platform"
          class="inline-flex items-center px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all"
        >
          Explore Platform
        </a>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="max-w-6xl mx-auto px-6 py-20">
  <div class="glass rounded-2xl p-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h2 class="text-2xl md:text-3xl font-medium dark:text-white">Ready to accelerate?</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Build enterprise applications 500x faster.</p>
      </div>
      <a
        href="/contact"
        class="inline-flex items-center px-6 py-3 text-sm font-medium bg-white text-black rounded-full hover:opacity-90 transition-all"
      >
        Get Started
      </a>
    </div>
  </div>
</section>
