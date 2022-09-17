<script lang="ts">
  import { Circle } from "svelte-loading-spinners";

  export let loading: boolean;
</script>

{#if loading}
  <div class="mx-auto">
    <Circle color="#A5B4FC" />
  </div>
{:else}
  <slot />
{/if}
