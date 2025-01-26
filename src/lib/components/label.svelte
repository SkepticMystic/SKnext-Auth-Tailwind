<script lang="ts">
  import InfoTooltip from "./infoTooltip.svelte";

  
  interface Props {
    lbl: string;
    alt?: string | null;
    /** Pass in any classes to the label */
    cls?: string;
    children?: import('svelte').Snippet;
  }

  let {
    lbl,
    alt = null,
    cls = "",
    children
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
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
    {@render children?.()}
  </div>
</div>
