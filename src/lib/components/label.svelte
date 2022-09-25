<script lang="ts">
  export let lbl: string;
  /** Pass in any classes to the label */
  export let cls = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="flex flex-col">
  <label class="{cls} label font-semibold">{lbl}</label>
  <div>
    <slot />
  </div>
</div>
