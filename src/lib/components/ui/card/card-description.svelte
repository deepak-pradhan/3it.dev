<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  let { class: className, children, ...restProps }: { class?: string; children?: Snippet } = $props();
</script>

<p class={cn('text-sm text-neutral-500', className)} {...restProps}>
  {@render children?.()}
</p>
