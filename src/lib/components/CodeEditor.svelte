<script lang="ts">
  import { onMount } from 'svelte';
  import * as monaco from '@monaco-editor/loader';

  export let code = '';
  export let language = 'typescript';
  export let theme = 'vs-dark';
  export let readOnly = false;

  let editorContainer: HTMLElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  onMount(async () => {
    await monaco.init();
    
    editor = monaco.editor.create(editorContainer, {
      value: code,
      language,
      theme,
      readOnly,
      minimap: { enabled: false },
      automaticLayout: true,
    });

    editor.onDidChangeModelContent(() => {
      code = editor.getValue();
    });

    return () => {
      editor.dispose();
    };
  });

  $: if (editor) {
    editor.setValue(code);
  }
</script>

<div class="w-full h-full" bind:this={editorContainer} /> 