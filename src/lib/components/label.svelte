<script lang="ts">
  import InfoTooltip from "./infoTooltip.svelte";

  export let lbl: string;
  export let alt: string | null = null;
  /** Pass in any classes to the label */
  export let cls = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="flex flex-col">
  <label class="{cls} label font-semibold">
    <span class="label-text text-base">{lbl}</span>
    {#if alt !== null}
      <span class="label-text-alt">
        <InfoTooltip tip={alt} />
      </span>
    {/if}
  </label>

  <div>
    <slot />
  </div>
</div>
