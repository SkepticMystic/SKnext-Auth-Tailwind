<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { toast, Toaster } from "svelte-daisyui-toast";
  import "../app.css";
  import { onMount } from "svelte";
  import axios from "axios";
  import type { User } from "lucia";
  import { user } from "$lib/stores/user";
  import Loading from "$lib/components/Loading.svelte";

  toast.defaults.set({ clear_on_navigate: true, duration_ms: 10_000 });

  let loading = true;
  onMount(async () => {
    const { data } = await axios.get<{ user: User | undefined }>("/api/init");

    user.set(data.user);

    loading = false;
  });
</script>

<header>
  <Navbar />
</header>

<main class="mx-14 my-4">
  <Loading {loading}>
    <slot />
  </Loading>
</main>

<Toaster />
