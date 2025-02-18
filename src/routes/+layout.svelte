<script lang="ts">
  import Loading from "$lib/components/daisyui/Loading.svelte";
  import Navbar from "$lib/components/daisyui/Navbar.svelte";
  import { user } from "$lib/stores/user";
  import axios from "axios";
  import type { User } from "lucia";
  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-daisyui-toast";
  import "../app.css";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  toast.defaults.set({ clear_on_navigate: true, duration_ms: 10_000 });

  let loading = $state(true);
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
    {@render children?.()}
  </Loading>
</main>

<Toaster />
