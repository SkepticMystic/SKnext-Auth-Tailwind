<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authHeader } from "$lib/auth/client";
  import ResultText from "$lib/components/resultText.svelte";
  import { errSucLoading } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  const { _lucia } = $page.data;

  let { err, loading } = errSucLoading();

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    loading = true;
    err = "";

    try {
      const { data } = await axios.delete("/api/user", authHeader(_lucia));
      if (data.ok) await goto("/signin");
    } catch (error) {
      console.log(error);
      err = getHTTPErrorMsg(error);
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
      class:loading
      disabled={loading}
      on:click={async () => await deleteUser()}
    >
      Delete Account
    </button>
  </div>

  <ResultText {err} />
{:else}
  <p class="text-lg">You are not logged in</p>
{/if}
