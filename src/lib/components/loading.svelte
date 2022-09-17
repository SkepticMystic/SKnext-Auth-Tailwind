<script lang="ts">
  import { Circle } from "svelte-loading-spinners";

  export let loading: boolean;
  export let size = 20;
</script>

{#if loading}
  <div class="mx-auto">
    <Circle color="#A5B4FC" {size} />
  </div>
{:else}
  <slot />
{/if}
