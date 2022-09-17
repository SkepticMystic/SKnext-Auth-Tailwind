<script lang="ts">
  import { page } from "$app/stores";
  import { authHeader, set_href } from "$lib/auth/client";
  import axios from "axios";

  const { _lucia } = $page.data;

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      const { data } = await axios.delete("/api/user", authHeader(_lucia));
      if (data.ok) set_href("/signin");
    } catch (error) {
      console.log(error);
    }
  };
</script>

<h1 class="text-xl">Profile</h1>

<div class="my-2" />

{#if _lucia}
  <p class="text-lg">Welcome {_lucia.user.email.split("@")[0]}</p>

  <div>
    <button class="btn" on:click={async () => await deleteAccount()}>
      Delete Account
    </button>
  </div>
{:else}
  <p class="text-lg">You are not logged in</p>
{/if}
