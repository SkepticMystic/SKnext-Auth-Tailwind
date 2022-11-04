<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import "../app.css";
  import { page } from "$app/stores";
  import { handleSession } from "@lucia-auth/sveltekit/client";

  handleSession(page);
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <slot />
</main>
