<script lang="ts">
  const products = [
    {
      id: 'canvas',
      name: 'Canvas→Claude',
      tagline: 'AI-Powered Business Intelligence Platform',
      description: 'Self-managing 9-block business model canvas with autonomous AI agents. The first system that continuously optimizes your business model with strategic human oversight.',
      status: 'Production Ready',
      features: [
        'Autonomous AI agents for each canvas block',
        'Real-time market validation',
        'Investment readiness scoring',
        'Context-preservation framework',
      ],
      link: 'https://canvas-marketing.3it.dev',
      buttonText: 'View Demo',
    },
    {
      id: 'phyto',
      name: 'Phyto Platform',
      tagline: 'Traditional Medicine Intelligence',
      description: 'Evidence-based platform for computational ethnopharmacology and natural products drug discovery. Connects traditional medicine knowledge with modern scientific validation.',
      status: 'gBETA Pitch',
      features: [
        '14,678 medicinal plants',
        '908,488 compounds with structures',
        'Cross-tradition convergence analysis',
        'FSSAI claim substantiation dossiers',
      ],
      link: '/request-for-demo',
      buttonText: 'Request Demo',
      stats: { plants: '14K+', compounds: '908K+', uses: '833K+' },
    },
    {
      id: 'bcm',
      name: 'BCM System',
      tagline: 'Business Continuity Management',
      description: 'Comprehensive business continuity planning, disaster recovery management, and compliance tracking for enterprise organizations.',
      status: 'Q4 2025',
      features: [
        'Risk assessment workflows',
        'Recovery planning automation',
        'Compliance tracking dashboard',
        'Incident response coordination',
      ],
    },
  ];
</script>

<svelte:head>
  <title>Products - 3IT.dev</title>
</svelte:head>

<section class="max-w-6xl mx-auto px-6 pt-20 pb-12">
  <div class="text-emerald-500 text-sm font-mono mb-4">Products</div>
  <h1 class="text-4xl md:text-5xl font-semibold tracking-tight dark:text-white">
    Enterprise Solutions
  </h1>
  <p class="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
    Production-ready business solutions built on our RAD platform.
  </p>
</section>

<section class="max-w-6xl mx-auto px-6 py-12">
  <div class="space-y-12">
    {#each products as product}
      <div class="glass rounded-2xl p-8 md:p-12" id={product.id}>
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div class="flex-1">
            <span class="text-xs px-2 py-1 rounded-full {product.status === 'Production Ready' ? 'bg-emerald-500/20 text-emerald-400' : product.status === 'gBETA Pitch' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}">
              {product.status}
            </span>
            <h2 class="text-2xl md:text-3xl font-medium dark:text-white mt-4">{product.name}</h2>
            <p class="text-emerald-500 mt-1">{product.tagline}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-4 max-w-xl">{product.description}</p>

            <div class="mt-6">
              <h3 class="text-sm text-gray-400 uppercase tracking-wider mb-3">Features</h3>
              <ul class="space-y-2">
                {#each product.features as feature}
                  <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span class="text-emerald-500">+</span>
                    {feature}
                  </li>
                {/each}
              </ul>
            </div>

            {#if product.link}
              <a
                href={product.link}
                target={product.link.startsWith('/') ? undefined : '_blank'}
                class="inline-flex items-center mt-6 px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all"
              >
                {product.buttonText || 'View Demo'} →
              </a>
            {/if}
          </div>

          {#if product.stats}
            <div class="glass-subtle rounded-xl p-6 md:w-64">
              <h3 class="text-sm text-gray-400 uppercase tracking-wider mb-4">Data Coverage</h3>
              <div class="space-y-4">
                {#each Object.entries(product.stats) as [key, value]}
                  <div>
                    <div class="text-2xl font-bold text-emerald-500">{value}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
