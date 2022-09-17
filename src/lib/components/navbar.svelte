<script lang="ts">
  import { page } from "$app/stores";
  import { set_href } from "$lib/auth/client";
  import { signOut } from "lucia-sveltekit/client";

  const { _lucia } = $page.data;
</script>

<nav>
  <ul class="flex flex-row gap-4">
    {#if _lucia}
      <li>
        <a class="link" href="/">Home</a>
      </li>
      <li>
        <a class="link" href="/profile">Profile</a>
      </li>
      <li>
        <button
          class="link"
          on:click={async () => (await signOut()) && set_href("/signin")}
        >
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
