<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import axios from "axios";
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
      {#each ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"] as theme}
        <option value={theme}>{theme}</option>
      {/each}
    </select>

    {#if $page.data.user}
      <li><a class="link" href="/profile">Profile</a></li>
      <li>
        <button
          class="btn btn-ghost"
          on:click={async () => {
            await axios.post("/api/signout");
            await invalidateAll();
          }}>Sign out</button
        >
      </li>
    {/if}
  </ul>
</nav>
