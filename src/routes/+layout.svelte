<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { handleSilentRefresh } from "lucia-sveltekit/client";
  import "../app.css";

  handleSilentRefresh();
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <slot />
</main>
