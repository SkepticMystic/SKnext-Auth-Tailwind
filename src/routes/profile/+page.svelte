<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authHeader } from "$lib/auth/client";
  import ErrorText from "$lib/components/errorText.svelte";
  import Loading from "$lib/components/loading.svelte";
  import type { HTTPError } from "$lib/interfaces";
  import axios from "axios";

  const { _lucia } = $page.data;

  let loading = false;
  let err = "";

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    loading = true;
    err = "";

    try {
      const { data } = await axios.delete("/api/user", authHeader(_lucia));
      if (data.ok) await goto("/signin");
    } catch (error) {
      console.log(error);
      err = (<HTTPError>error)?.response?.data?.message;
    }

    loading = false;
  };
</script>

<h1 class="text-xl">Profile</h1>

<div class="my-2" />

{#if _lucia}
  <p class="text-lg">Welcome {_lucia.user.email.split("@")[0]}</p>

  <div class="my-4">
    <button
      class="btn btn-warning"
      disabled={loading}
      on:click={async () => await deleteUser()}
    >
      <Loading {loading}>Delete Account</Loading>
    </button>
  </div>

  <ErrorText {err} />
{:else}
  <p class="text-lg">You are not logged in</p>
{/if}
