<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  let { class: className, children, ...restProps }: { class?: string; children?: Snippet } = $props();
</script>

<div class={cn('rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow', className)} {...restProps}>
  {@render children?.()}
</div>
