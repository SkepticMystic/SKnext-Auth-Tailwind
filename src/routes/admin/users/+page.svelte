<script lang="ts">
  import Table from "$lib/components/daisyui/Table.svelte";

  let { data } = $props();
</script>

<Table rows={data.users} />
