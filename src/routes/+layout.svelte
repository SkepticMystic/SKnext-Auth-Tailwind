<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { getSession, Lucia } from "lucia-sveltekit/client";
  import "../app.css";
</script>

<Navbar />

<Lucia>
  <slot />
</Lucia>
