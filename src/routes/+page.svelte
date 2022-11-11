<script lang="ts">
  import { page } from "$app/stores";
  import PaginateFetch from "$lib/components/paginateFetch.svelte";
  import Table from "$lib/components/table.svelte";
  import { fetchJson } from "$lib/utils";

  let data: any[] = [];

  const pageNo = Number($page.url.searchParams.get("page") ?? 1);
  const limit = Number($page.url.searchParams.get("limit") ?? 10);
</script>

<h1>Welcome to SvelteKit</h1>
<div class="my-3" />
<PaginateFetch
  {pageNo}
  {limit}
  getData={async (skip, limit) => {
    const all = await fetchJson(
      `https://jsonplaceholder.typicode.com/comments`
    );
    return all.slice(skip, skip + limit);
  }}
  bind:data
/>
<div class="my-3" />
<Table preview={0} rows={data} />
