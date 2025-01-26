<script lang="ts">
  interface Props {
    max: number;
    preview: number;
  }

  let { max, preview }: Props = $props();
</script>

<code>{Math.min(preview, max)}</code> of <code>{max}</code> rows
