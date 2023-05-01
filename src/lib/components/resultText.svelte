<script lang="ts">
  export let err = "";
  export let suc = "";
</script>

{#if err}
  <p class="text-error text-sm">{err}</p>
{/if}

{#if suc}
  <p class="text-success text-sm">{suc}</p>
{/if}
