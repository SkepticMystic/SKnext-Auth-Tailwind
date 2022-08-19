<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { Lucia } from "lucia-sveltekit/client";
  import "../app.css";
</script>

<Lucia>
  <header>
    <Navbar />
  </header>
  <main class="mx-14 my-4">
    <slot />
  </main>
</Lucia>
