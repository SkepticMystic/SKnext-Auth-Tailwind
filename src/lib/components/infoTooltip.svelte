<script lang="ts">
  interface Props {
    tip: string;
  }

  let { tip }: Props = $props();
</script>

<div class="tooltip" data-tip={tip}>
  <span class="btn btn-square btn-ghost btn-xs">❔</span>
</div>
