<script lang="ts">
  import { run } from 'svelte/legacy';

  import RowCount from "./rowCount.svelte";

  interface Props {
    rows: Record<string, any>[];
    headers?: string[];
    preview?: number;
    indexCol?: boolean;
  }

  let {
    rows,
    headers = $bindable([]),
    preview = 30,
    indexCol = false
  }: Props = $props();

  run(() => {
    headers = headers.length ? headers : Object.keys(rows[0] ?? {});
  });
</script>

<div>
  {#key rows}
    {#if preview}
      <div class="my-3">
        <RowCount {preview} max={rows.length} />
      </div>
    {/if}

    <table class="table">
      <thead>
        <tr>
          {#if indexCol}
            <th>Index</th>
          {/if}
          {#each headers as header}
            <th class="capitalize">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows.slice(0, preview || rows.length) ?? [] as row, i}
          <tr class="hover:bg-base-200">
            {#if indexCol}
              <td>{i + 1}</td>
            {/if}
            {#each headers as header}
              <td>{row[header]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/key}
</div>
