<script lang="ts">
  export let err: unknown;
</script>

{#if err}
  <div class="my-4">
    <p class="text-red-500 text-sm">{err}</p>
  </div>
{/if}
