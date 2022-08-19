<script lang="ts">
  import { getSession } from "lucia-sveltekit/client";

  const session = getSession();

  console.log($session);
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
