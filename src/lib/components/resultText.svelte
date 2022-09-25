<script lang="ts">
  export let err = "";
  export let suc = "";
</script>

{#if err}
  <div class="my-4">
    <p class="text-error text-sm">{err}</p>
  </div>
{/if}

{#if suc}
  <div class="my-4">
    <p class="text-success text-sm">{suc}</p>
  </div>
{/if}
