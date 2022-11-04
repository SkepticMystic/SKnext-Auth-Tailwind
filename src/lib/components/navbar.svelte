<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { getUser, signOut } from "@lucia-auth/sveltekit/client";
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  onMount(() => themeChange(false));

  const mySignOut = async () => {
    await goto("/signin");
    await signOut();
    await invalidateAll();
  };

  const user = getUser();
</script>

<nav class="px-4 navbar shadow bg-base-200">
  <ul class="navbar-start flex flex-row gap-4">
    {#if $user}
      <li>
        <a class="link" href="/">Home</a>
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
  <ul class="navbar-end flex flex-row gap-4">
    <select class="select select-sm text-xs" data-choose-theme>
      {#each ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"] as theme}
        <option value={theme}>{theme}</option>
      {/each}
    </select>

    {#if $user}
      <li><a class="link" href="/profile">Profile</a></li>
      <li>
        <button class="link" on:click={mySignOut}> Signout </button>
      </li>
    {/if}
  </ul>
</nav>
