<script lang="ts">
  interface Props {
    lbl: string;
    cls?: string;
    children?: import("svelte").Snippet;
  }

  let { lbl, cls = "", children }: Props = $props();
</script>

<label class="floating-label {cls}">
  <span>{lbl}</span>
  {@render children?.()}
</label>
