<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import "../app.css";
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <slot />
</main>
