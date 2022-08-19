<script lang="ts">
  export let suc: string;
</script>

{#if suc}
  <div class="my-4">
    <p class="text-green-500 text-sm">{suc}</p>
  </div>
{/if}
