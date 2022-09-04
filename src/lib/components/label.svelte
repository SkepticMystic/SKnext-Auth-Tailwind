<script lang="ts">
  export let lbl: string;
  export let cls = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="flex flex-col">
  <p class="{cls} font-semibold">{lbl}</p>
  <div>
    <slot />
  </div>
</label>
