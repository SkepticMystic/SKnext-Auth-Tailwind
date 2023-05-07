<script lang="ts">
  import { page } from "$app/stores";
  import { signout } from "$lib/auth/client";
  import { onMount } from "svelte";
  import Bars3 from "./icons/bars3.svelte";
  import { themeChange } from "theme-change";

  onMount(() => themeChange(false));

  const routes: {
    side: "center" | "right";
    label: string;
    href: string;
    /** Only show if user is authenticated */
    authed: boolean;
  }[] = [
    {
      side: "center",
      label: "Tasks",
      href: "/tasks",
      authed: true,
    },
    {
      side: "center",
      label: "Projects",
      href: "/projects",
      authed: true,
    },
    {
      side: "right",
      label: "Team",
      href: "/team",
      authed: true,
    },
    {
      side: "right",
      label: "Profile",
      href: "/profile",
      authed: true,
    },
    {
      side: "right",
      label: "Sign in",
      href: "/signin",
      authed: false,
    },
    {
      side: "right",
      label: "Sign up",
      href: "/signup",
      authed: false,
    },
  ];
</script>

<nav class="navbar bg-base-100 px-5">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost normal-case text-xl">Generic App</a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <ul class="flex gap-5 items-center">
      {#each routes as { side, authed, href, label }}
        {#if side === "center" && authed === !!$page.data.user}
          <li>
            <a class="link" {href}>{label}</a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>

  <!-- Mobile menu -->
  <div class="navbar-end flex lg:hidden">
    <div class="dropdown dropdown-left">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost">
        <Bars3 />
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
      >
        <!-- Shows all routes, not just those for a given `side` -->
        {#each routes as { authed, href, label }}
          {#if authed === !!$page.data.user}
            <li>
              <a class="link" {href}>{label}</a>
            </li>
          {/if}
        {/each}

        {#if $page.data.user}
          <li>
            <button class="link" on:click={signout}> Sign out </button>
          </li>
        {/if}
      </ul>
    </div>
  </div>

  <div class="navbar-end hidden lg:flex">
    <ul class="flex gap-5 items-center">
      <select
        class="select select-bordered select-sm text-xs"
        data-choose-theme
      >
        {#each ["acid", "autumn", "black", "bumblebee", "business", "cmyk", "coffee", "corporate", "cupcake", "cyberpunk", "dracula", "emerald", "fantasy", "forest", "garden", "halloween", "lemonade", "light", "lofi", "luxury", "night", "pastel", "retro", "valentine", "winter"] as theme}
          <option value={theme}>{theme}</option>
        {/each}
      </select>

      {#each routes as { side, authed, href, label }}
        {#if side === "right" && authed === !!$page.data.user}
          <li>
            <a class="link" {href}>{label}</a>
          </li>
        {/if}
      {/each}

      {#if $page.data.user}
        <li>
          <button class="btn btn-sm btn-ghost" on:click={signout}>
            Sign out
          </button>
        </li>
      {/if}
    </ul>
  </div>
</nav>
