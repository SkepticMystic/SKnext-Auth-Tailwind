<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { Lucia } from "lucia-sveltekit/client";
  import "../app.css";
</script>

<Lucia>
  <Navbar />
  <slot />
</Lucia>
