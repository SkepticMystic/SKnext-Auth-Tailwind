<script lang="ts">
  export let lbl: string;
  export let cls = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="flex flex-col">
  <label class="{cls} font-semibold">{lbl}</label>
  <div>
    <slot />
  </div>
</div>
