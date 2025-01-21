<script lang="ts">
  import { page } from "$app/stores";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import { onMount } from "svelte";
  import { toast } from "svelte-daisyui-toast";
  import Loading from "./Loading.svelte";

  export let data: any[];
  export let fetchOnMount: boolean = true;
  export let getData: (skip: number, limit: number) => Promise<any[]>;
  export let total: number | null = null;
  export let pageNo: number | null = null;
  export let limit: number | null = null;

  const loader = Loader<Dir>();

  let currPage = pageNo ?? Number($page.url.searchParams.get("page") ?? 1);
  let currLimit = limit ?? Number($page.url.searchParams.get("limit") ?? 50);

  $: totalPages = total ? Math.ceil(total / currLimit) : null;
  let skip = (currPage - 1) * currLimit;

  // First | Previous | Current | Next | Last
  type Dir = -2 | -1 | 0 | 1 | 2;

  const getMore = async (dir: Dir = 0) => {
    loader.load(dir);

    if (dir === -2) skip = 0;
    else if (dir === 2) {
      if (!totalPages) return;
      else skip = (totalPages - 1) * currLimit;
    } else skip += dir * currLimit;

    try {
      data = await getData(skip, currLimit);

      // Set page after completing fetch
      currPage = Math.floor(skip / currLimit) + 1;
    } catch (error) {
      toast.error(getHTTPErrorMsg(error));
    }

    loader.reset();
  };

  if (fetchOnMount) onMount(getMore);
</script>

<div>
  <div class="flex">
    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      disabled={any_loading($loader) || skip === 0}
      title="First"
      on:click={async () => await getMore(-2)}
    >
      <Loading loading={$loader[-2]}>≪</Loading>
    </button>
    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      disabled={any_loading($loader) || skip === 0}
      title="Previous"
      on:click={async () => await getMore(-1)}
    >
      <Loading loading={$loader[-1]}>←</Loading>
    </button>

    <button
      class="btn btn-ghost rounded-none border-0 font-bold"
      disabled={any_loading($loader)}
      title="Refresh"
      on:click={async () => await getMore(0)}
    >
      <Loading loading={$loader[0]}>
        {currPage}{total ? ` / ${totalPages}` : ""}
      </Loading>
    </button>

    <button
      class="btn btn-square btn-secondary rounded-none border-0"
      title="Next"
      disabled={any_loading($loader) ||
        (total ? currPage === totalPages : data.length < currLimit)}
      on:click={async () => await getMore(1)}
    >
      <Loading loading={$loader[1]}>→</Loading>
    </button>
    {#if total}
      <button
        class="btn btn-square btn-secondary rounded-none border-0"
        disabled={any_loading($loader) || currPage === totalPages}
        title="Last"
        on:click={async () => await getMore(2)}
      >
        <Loading loading={$loader[2]}>≫</Loading>
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
</div>
