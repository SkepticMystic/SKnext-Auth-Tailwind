<script lang="ts">
  import { ROW_PREVIEW_LIMIT } from "$lib/const/index";

  export let preview: number = ROW_PREVIEW_LIMIT;
  export let max: number;
</script>

<code>{Math.min(preview, max)}</code> of <code>{max}</code> rows
