<script lang="ts">
  import type { TW } from "$lib/interfaces/tailwind";

  interface Props {
    loading: boolean | undefined;
    size?: TW.Size;
    animation?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
    children?: import("svelte").Snippet;
  }

  let {
    loading,
    size = "sm",
    animation = "spinner",
    children,
  }: Props = $props();

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
  ></span>
{:else}
  {@render children?.()}
{/if}
