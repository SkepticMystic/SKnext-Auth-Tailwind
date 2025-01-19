<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { toast, Toaster } from "svelte-daisyui-toast";
  import "../app.css";

  toast.defaults.set({ clear_on_navigate: true, duration_ms: 10_000 });
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <slot />
</main>

<Toaster />
