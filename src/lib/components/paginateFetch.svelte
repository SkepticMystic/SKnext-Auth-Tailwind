<script lang="ts">
  import { fetchJson, getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import { onMount } from "svelte";
  import ResultText from "./resultText.svelte";

  export let data: any[];
  export let getUrl: ((skip: number, limit: number) => string) | null = null;
  export let getData: ((skip: number, limit: number) => Promise<any[]>) | null =
    null;
  export let page: number;
  export let limit: number;
  let skip = (page - 1) * limit;

  type Dir = -1 | 0 | 1;
  let { loadObj, err } = getProps<Dir>();
  loadObj[0] = true;

  const getMore = async (dir: Dir = 0) => {
    loadObj[dir] = true;

    skip += dir * limit;

    try {
      if (getUrl) data = await fetchJson(getUrl(skip, limit));
      else if (getData) data = await getData(skip, limit);
      else throw new Error("No data source provided");

      page = Math.floor(skip / limit) + 1;
    } catch (error) {
      err = getHTTPErrorMsg(error);
    }

    loadObj = {};
  };

  onMount(getMore);
</script>

<div>
  <div class="flex">
    <button
      class="btn btn-secondary btn-square btn-sm border-0 rounded-none"
      class:loading={loadObj[-1]}
      disabled={Object.keys(loadObj).length > 0 || skip === 0}
      on:click={async () => await getMore(-1)}
    >
      {#if !loadObj[-1]} ← {/if}
    </button>

    <button
      class="btn btn-ghost btn-square btn-sm border-0 rounded-none font-bold cursor-default"
      class:loading={loadObj[0]}
      title="Page {page}"
    >
      {#if !loadObj[0]} {page} {/if}
    </button>

    <button
      class="btn btn-secondary btn-square btn-sm border-0 rounded-none"
      class:loading={loadObj[1]}
      disabled={Object.keys(loadObj).length > 0 || data?.length < limit}
      on:click={async () => await getMore(1)}
    >
      {#if !loadObj[1]} → {/if}
    </button>
  </div>

  <ResultText {err} />
</div>
