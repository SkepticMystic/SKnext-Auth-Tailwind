<script lang="ts">
  export let label: string;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="flex flex-col">
  <p>{label}</p>
  <div>
    <slot />
  </div>
</label>
