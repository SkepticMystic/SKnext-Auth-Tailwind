<script lang="ts">
  import { signOutUser } from "$lib/auth/client";
  import { getSession } from "lucia-sveltekit/client";

  const session = getSession();
  console.log($session?.user);
</script>

<nav>
  <ul class="flex flex-row gap-4">
    {#if $session}
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/profile">Profile</a>
      </li>
      <li>
        <button on:click={async () => await signOutUser()}> Signout </button>
      </li>
    {:else}
      <li>
        <a href="/signup">Signup</a>
      </li>
      <li>
        <a href="/signin">Signin</a>
      </li>
    {/if}
  </ul>
</nav>
