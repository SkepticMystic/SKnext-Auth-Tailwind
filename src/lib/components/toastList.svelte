<script lang="ts">
  import { page } from "$app/stores";
  import { removeToast, toast, type Toast } from "$lib/stores/toast";
  import XMark from "./icons/xMark.svelte";
  import TimerWheel from "./timerWheel.svelte";

  const alertTypes: Record<Toast["type"], string> = {
    error: "alert-error",
    success: "alert-success",
    info: "alert-info",
  };
</script>

<div class="toast">
  {#each $toast as { id, message, type, duration_ms, showOnRoutes }, i (id)}
    {#if !showOnRoutes?.length || showOnRoutes.some( (r) => $page.url.pathname.startsWith(r) )}
      <div class="alert {alertTypes[type]}">
        <div class="flex justify-between grow">
          <span>{@html message}</span>
          {#if duration_ms}
            <!-- Only set the timeout when the toast is rendered. This allows it to work with showOnRoutes -->
            {@const _timer = setTimeout(() => removeToast(id), duration_ms)}

            <TimerWheel {duration_ms} on:click={() => removeToast(id)}>
              <XMark w="w-4" h="h-4" />
            </TimerWheel>
          {:else}
            <button
              class="btn btn-sm btn-circle btn-ghost"
              on:click={() => removeToast(id)}
            >
              <XMark w="w-4" h="h-4" />
            </button>
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>
