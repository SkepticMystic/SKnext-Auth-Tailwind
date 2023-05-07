<script lang="ts">
  import { page } from "$app/stores";
  import { signout } from "$lib/auth/client";
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  onMount(() => themeChange(false));
</script>

<nav class="px-4 navbar shadow bg-base-200">
  <ul class="navbar-start flex flex-row gap-4">
    {#if $page.data.user}
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
    <select class="select text-xs" data-choose-theme>
      {#each ["acid", "aqua", "autumn", "black", "bumblebee", "business", "cmyk", "coffee", "corporate", "cupcake", "cyberpunk", "dark", "dracula", "emerald", "fantasy", "forest", "garden", "halloween", "lemonade", "light", "lofi", "luxury", "night", "pastel", "retro", "synthwave", "valentine", "winter", "wireframe"] as theme}
        <option value={theme}>{theme}</option>
      {/each}
    </select>

    {#if $page.data.user}
      <li><a class="link" href="/profile">Profile</a></li>
      <li><a class="link" href="/team">Team</a></li>
      <li>
        <button class="btn btn-ghost" on:click={signout}>Sign out</button>
      </li>
    {/if}
  </ul>
</nav>
