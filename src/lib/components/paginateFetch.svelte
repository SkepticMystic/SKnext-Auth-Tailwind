<script lang="ts">
  import { page } from "$app/stores";
  import { DEFAULT_LIMIT } from "$lib/const";
  import { fetchJson, getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import { onMount } from "svelte";
  import ResultText from "./resultText.svelte";
  import Loading from "./Loading.svelte";

  export let data: any[];
  export let fetchOnMount: boolean = true;
  export let getUrl: ((skip: number, limit: number) => string) | null = null;
  export let getData: ((skip: number, limit: number) => Promise<any[]>) | null =
    null;
  export let total: number | null = null;
  export let pageNo: number | null = null;
  export let limit: number | null = null;

  let currPage = pageNo ?? Number($page.url.searchParams.get("page") ?? 1);
  let currLimit =
    limit ?? Number($page.url.searchParams.get("limit") ?? DEFAULT_LIMIT);

  $: totalPages = total ? Math.ceil(total / currLimit) : null;
  let skip = (currPage - 1) * currLimit;

  // First | Previous | Current | Next | Last
  type Dir = -2 | -1 | 0 | 1 | 2;
  let { loadObj, err } = getProps<Dir>();

  const getMore = async (dir: Dir = 0) => {
    loadObj[dir] = true;

    if (dir === -2) skip = 0;
    else if (dir === 2) {
      if (!totalPages) return;
      else skip = (totalPages - 1) * currLimit;
    } else skip += dir * currLimit;

    try {
      if (getUrl) data = await fetchJson(getUrl(skip, currLimit));
      else if (getData) data = await getData(skip, currLimit);
      else throw new Error("No data source provided");

      // Set page after completing fetch
      currPage = Math.floor(skip / currLimit) + 1;
    } catch (error) {
      err = getHTTPErrorMsg(error);
    }

    loadObj = {};
  };

  if (fetchOnMount) onMount(getMore);

  $: anyLoading = Object.keys(loadObj).length > 0;
</script>

<div>
  <div class="flex">
    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      disabled={anyLoading || skip === 0}
      title="First"
      on:click={async () => await getMore(-2)}
    >
      <Loading loading={loadObj[-2]}>≪</Loading>
    </button>
    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      disabled={anyLoading || skip === 0}
      title="Previous"
      on:click={async () => await getMore(-1)}
    >
      <Loading loading={loadObj[-1]}>←</Loading>
    </button>

    <button
      class="btn btn-ghost rounded-none border-0 font-bold"
      disabled={anyLoading}
      title="Refresh"
      on:click={async () => await getMore(0)}
    >
      <Loading loading={loadObj[0]}>
        {currPage}{total ? ` / ${totalPages}` : ""}
      </Loading>
    </button>

    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      title="Next"
      disabled={anyLoading ||
        (total ? currPage === totalPages : data.length < currLimit)}
      on:click={async () => await getMore(1)}
    >
      <Loading loading={loadObj[1]}>→</Loading>
    </button>
    {#if total}
      <button
        class="btn btn-square btn-secondary rounded-none border-0"
        disabled={anyLoading || currPage === totalPages}
        title="Last"
        on:click={async () => await getMore(2)}
      >
        <Loading loading={loadObj[2]}>≫</Loading>
      </button>
    {/if}
    <div class="mx-2" />
    <select
      class="select"
      bind:value={currLimit}
      on:change={async () => {
        skip = 0;
        await getMore();
      }}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      {#if total}<option value={total}>All</option>{/if}
    </select>
  </div>

  <ResultText {err} />
</div>
