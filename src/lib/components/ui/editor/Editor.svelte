<script lang="ts">
  /**
   * Rich Text Editor Component
   *
   * NOTE: This component requires @tiptap/* packages to be installed:
   *   npm install @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link
   *
   * Once installed, replace this stub with the full implementation.
   */

  interface Props {
    content?: string;
    placeholder?: string;
    editable?: boolean;
    onUpdate?: (html: string) => void;
  }

  let {
    content = '',
    placeholder = 'Start writing...',
    editable = true,
    onUpdate,
  }: Props = $props();
</script>

<div class="glass rounded-xl overflow-hidden p-4">
  <p class="text-gray-400 text-sm">
    Editor component requires @tiptap/* packages to be installed.
  </p>
  <p class="text-gray-500 text-xs mt-2">
    Run: npm install @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link
  </p>
</div>
