<script lang="ts">
  import { ROW_PREVIEW_LIMIT } from "$lib/const/index";
  import type { Primitive } from "$lib/interfaces";
  import RowCount from "./rowCount.svelte";

  export let rows: { [col: string]: Primitive | Primitive[] }[];
  export let headers: string[] = [];
  export let preview: number = ROW_PREVIEW_LIMIT;
  export let indexCol: boolean = false;

  $: headers = headers.length ? headers : Object.keys(rows[0] ?? {});
</script>

<div>
  {#key rows}
    {#if preview}
      <div class="my-3">
        <RowCount {preview} max={rows.length} />
      </div>
    {/if}

    <table class="table table-zebra">
      <thead>
        <tr>
          {#if indexCol} <th>Index</th> {/if}
          {#each headers as header}
            <th class="capitalize">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows.slice(0, preview || rows.length) ?? [] as row, i}
          <tr>
            {#if indexCol} <td>{i + 1}</td> {/if}
            {#each headers as header}
              <td>{row[header]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/key}
</div>
