<script lang="ts">
  import { cn } from '$lib/utils';

  let { class: className, children, ...restProps }: { class?: string; children?: any } = $props();
</script>

<div class={cn('rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow', className)} {...restProps}>
  {@render children?.()}
</div>
