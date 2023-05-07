<script lang="ts">
  import Table from "$lib/components/table.svelte";

  export let data;
</script>

<Table rows={data.users} />
