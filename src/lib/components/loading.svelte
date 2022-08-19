<script lang="ts">
  import { BarLoader } from "svelte-loading-spinners";

  export let loading: boolean;
</script>

{#if loading}
  <div class="mx-auto">
    <BarLoader color="#A5B4FC" />
  </div>
{:else}
  <slot />
{/if}
