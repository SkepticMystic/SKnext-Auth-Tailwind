<script lang="ts">
  import type { TW } from "$lib/interfaces/tailwind";

  export let loading: boolean | undefined;
  export let size: TW.Size = "sm";
  export let animation:
    | "spinner"
    | "dots"
    | "ring"
    | "ball"
    | "bars"
    | "infinity" = "spinner";

  const loadingSizes: Record<TW.Size, `loading-${TW.Size}`> = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  };

  const loadingAnimations: Record<
    typeof animation,
    `loading-${typeof animation}`
  > = {
    spinner: "loading-spinner",
    dots: "loading-dots",
    ring: "loading-ring",
    ball: "loading-ball",
    bars: "loading-bars",
    infinity: "loading-infinity",
  };
</script>

{#if loading}
  <span
    class="{loadingSizes[size]} {loadingAnimations[animation]}"
    class:loading
  />
{:else}
  <slot />
{/if}
