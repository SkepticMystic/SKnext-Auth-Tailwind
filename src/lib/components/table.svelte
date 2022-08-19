<script lang="ts">
  export let rows: { [col: string]: string | number }[];
  export let headers: string[] = [];

  headers = headers.length ? headers : Object.keys(rows[0]);
</script>

<table class="custom-table">
  <thead>
    <tr>
      {#each headers as header}
        <th class="capitalize">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each Object.values(row) as value}
          <td>{value}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
