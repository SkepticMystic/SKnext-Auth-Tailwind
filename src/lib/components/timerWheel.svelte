<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";

  export let duration_ms: number;
  export let size: string = "34px";
  export let thickness: string = "3px";

  const dispatch = createEventDispatcher();
  const tween = tweened(0, { duration: duration_ms });
  $tween += duration_ms;

  $: perc = ($tween / duration_ms) * 100;
</script>

<button
  class="radial-progress cursor-pointer btn btn-sm btn-circle btn-ghost"
  style="--size:{size}; --thickness:{thickness}; --value:{perc};"
  on:click={() => dispatch("click")}
>
  <slot />
</button>
