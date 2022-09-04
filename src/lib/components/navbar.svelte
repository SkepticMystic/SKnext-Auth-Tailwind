<script lang="ts">
  import { page } from "$app/stores";
  import { signOutUser } from "$lib/auth/client";

  const { lucia } = $page.data;
</script>

<nav>
  <ul class="flex flex-row gap-4">
    {#if lucia}
      <li>
        <a class="link" href="/">Home</a>
      </li>
      <li>
        <a class="link" href="/profile">Profile</a>
      </li>
      <li>
        <button
          class="link"
          on:click={async () => await signOutUser(lucia?.access_token)}
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
