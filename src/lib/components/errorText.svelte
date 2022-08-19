<script lang="ts">
  export let err: string;
</script>

{#if err}
  <div class="my-4">
    <p class="text-red-500 text-sm">{err}</p>
  </div>
{/if}
