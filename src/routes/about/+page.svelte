<script lang="ts">
  const values = [
    { title: 'Innovation', description: 'First-of-kind autonomous business management with AI.' },
    { title: 'Speed', description: '500x development acceleration without compromising quality.' },
    { title: 'Security', description: '85% NIST Cybersecurity Framework compliance.' },
    { title: 'Collaboration', description: 'AI-Human partnership with strategic oversight.' },
  ];
</script>

<svelte:head>
  <title>About - 3IT.dev</title>
  <meta name="description" content="Enterprise RAD Platform with AI-Human collaboration." />
</svelte:head>

<section class="max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-16">
  <div class="text-emerald-500 text-sm font-mono mb-4">About</div>
  <h1 class="text-4xl md:text-5xl font-semibold tracking-tight dark:text-white">
    Building the future of enterprise development
  </h1>
</section>

<section class="max-w-6xl mx-auto px-6 pb-20">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
    <div class="md:col-span-2">
      <div class="glass rounded-2xl p-8">
        <div class="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          <p>
            3IT.dev represents a paradigm shift in software development, combining proven enterprise patterns
            with AI-human collaboration to achieve unprecedented development acceleration.
          </p>
          <p>
            We built the first system that achieves autonomous business model management with AI agents
            that continuously optimize operations while maintaining strategic human oversight.
          </p>
          <p>
            Our RAD Platform delivers 98.1% code reduction while maintaining enterprise-grade security,
            scalability, and maintainability. This breakthrough enables organizations to move at
            startup speed with enterprise confidence.
          </p>
        </div>
      </div>
    </div>
    <div class="space-y-4">
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Speed</div>
        <div class="text-lg dark:text-white">500x Faster</div>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Code Reduction</div>
        <div class="text-lg dark:text-white">98.1%</div>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Enterprise Ready</div>
        <div class="text-lg dark:text-white">A+ Grade (98/100)</div>
      </div>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 py-20">
  <h2 class="text-sm text-gray-400 uppercase tracking-wider mb-8">Values</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each values as value, i}
      <div class="glass rounded-2xl p-6 hover:bg-white/10 dark:hover:bg-white/5 transition-all">
        <div class="text-xs text-emerald-500 mb-2 font-mono">0{i + 1}</div>
        <h3 class="font-medium mb-2 dark:text-white">{value.title}</h3>
        <p class="text-gray-600 dark:text-gray-300">{value.description}</p>
      </div>
    {/each}
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 py-20">
  <div class="glass-strong rounded-2xl p-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <h2 class="text-2xl font-medium dark:text-white">Ready to accelerate?</h2>
      <a
        href="/contact"
        class="inline-flex items-center px-6 py-3 text-sm font-medium bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all"
      >
        Get in touch
      </a>
    </div>
  </div>
</section>
