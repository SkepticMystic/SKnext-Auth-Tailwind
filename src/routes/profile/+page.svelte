<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import ChangePassword from "./changePassword.svelte";
  import type { Result } from "$lib/interfaces";

  let { err, loading } = getProps();

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    (loading = true), (err = "");

    try {
      const { data } = await axios.delete<Result>("/api/user");
      if (data.ok) await goto("/signin");
    } catch (error) {
      console.log(error);
      err = getHTTPErrorMsg(error);
    }

    loading = false;
  };
</script>

<h1 class="text-2xl">Profile</h1>
<div class="my-3" />

{#if $page.data.user}
  <p class="text-lg">Welcome {$page.data.user.email.split("@")[0]}</p>

  <div class="my-5">
    <ChangePassword />
  </div>

  <div class="my-5">
    <button
      class="btn btn-error"
      class:loading
      disabled={loading}
      on:click={deleteUser}
    >
      Delete Account
    </button>
  </div>

  <ResultText {err} />
{:else}
  <p class="text-lg">You are not logged in</p>
{/if}
