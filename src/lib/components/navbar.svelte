<script lang="ts">
  import { getUser, signOut } from "lucia-sveltekit/client";

  const user = getUser();
</script>

<nav class="navbar">
  <ul class="flex flex-row gap-4">
    {#if user}
      <li>
        <a class="link" href="/">Home</a>
      </li>
      <li>
        <a class="link" href="/profile">Profile</a>
      </li>
      <li>
        <button class="link" on:click={async () => await signOut("/signin")}>
          Signout
        </button>
      </li>
    {:else}
      <li>
        <a class="link" href="/signup">Signup</a>
      </li>
      <li>
        <a class="link" href="/signin">Signin</a>
      </li>
    {/if}
  </ul>
</nav>
