<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import Link from '@tiptap/extension-link';

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

  let element: HTMLDivElement;
  let editor: Editor | null = $state(null);

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder }),
        Link.configure({ openOnClick: false }),
      ],
      content,
      editable,
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
        },
      },
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });

  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }

  function toggleHeading(level: 1 | 2 | 3) {
    editor?.chain().focus().toggleHeading({ level }).run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function toggleBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  function toggleCode() {
    editor?.chain().focus().toggleCode().run();
  }

  function toggleCodeBlock() {
    editor?.chain().focus().toggleCodeBlock().run();
  }

  function isActive(name: string, attrs?: Record<string, unknown>): boolean {
    return editor?.isActive(name, attrs) ?? false;
  }
</script>

<div class="glass rounded-xl overflow-hidden">
  {#if editable}
    <div class="flex flex-wrap gap-1 p-2 border-b border-white/10">
      <button
        type="button"
        onclick={toggleBold}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('bold') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Bold"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleItalic}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('italic') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Italic"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m0-16l-4 16m8-16l-4 16" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleStrike}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('strike') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Strikethrough"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 10H19m-14 0h1.5m0 0h11M6.5 10a4 4 0 014-4h3a4 4 0 010 8h-3a4 4 0 01-4-4z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
        </svg>
      </button>

      <div class="w-px bg-white/10 mx-1"></div>

      <button
        type="button"
        onclick={() => toggleHeading(2)}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Heading"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleBulletList}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('bulletList') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Bullet List"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleOrderedList}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('orderedList') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Numbered List"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleBlockquote}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('blockquote') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Quote"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
      </button>

      <div class="w-px bg-white/10 mx-1"></div>

      <button
        type="button"
        onclick={toggleCode}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('code') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Inline Code"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </button>
      <button
        type="button"
        onclick={toggleCodeBlock}
        class="p-2 rounded hover:bg-white/10 transition-colors {isActive('codeBlock') ? 'bg-white/20 text-white' : 'text-gray-400'}"
        title="Code Block"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  {/if}

  <div bind:this={element}></div>
</div>

<style>
  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #6b7280;
    pointer-events: none;
    height: 0;
  }

  :global(.tiptap) {
    min-height: 200px;
  }

  :global(.tiptap:focus) {
    outline: none;
  }

  :global(.tiptap h1, .tiptap h2, .tiptap h3) {
    color: white;
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  :global(.tiptap h1) { font-size: 1.875rem; }
  :global(.tiptap h2) { font-size: 1.5rem; }
  :global(.tiptap h3) { font-size: 1.25rem; }

  :global(.tiptap p) {
    color: #d1d5db;
    margin-bottom: 1em;
  }

  :global(.tiptap ul, .tiptap ol) {
    padding-left: 1.5em;
    margin-bottom: 1em;
    color: #d1d5db;
  }

  :global(.tiptap li) {
    margin-bottom: 0.25em;
  }

  :global(.tiptap blockquote) {
    border-left: 3px solid #6366f1;
    padding-left: 1em;
    margin-left: 0;
    color: #9ca3af;
    font-style: italic;
  }

  :global(.tiptap code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.125em 0.375em;
    border-radius: 0.25em;
    font-family: monospace;
    color: #f472b6;
  }

  :global(.tiptap pre) {
    background: rgba(0, 0, 0, 0.3);
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin-bottom: 1em;
  }

  :global(.tiptap pre code) {
    background: none;
    padding: 0;
    color: #d1d5db;
  }

  :global(.tiptap a) {
    color: #60a5fa;
    text-decoration: underline;
  }
</style>
