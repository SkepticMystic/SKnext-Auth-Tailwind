<script lang="ts">
  export let err = "";
  export let suc = "";
</script>

{#if err}
  <p class="text-sm text-error">{err}</p>
{/if}

{#if suc}
  <p class="text-sm text-success">{suc}</p>
{/if}
