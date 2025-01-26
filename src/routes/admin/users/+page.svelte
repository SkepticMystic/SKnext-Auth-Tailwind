<script lang="ts">
  import Table from "$lib/components/table.svelte";

  let { data } = $props();
</script>

<Table rows={data.users} />
