<script lang="ts">
  import { authHeader, setLocation } from "$lib/auth/client";
  import axios from "axios";
  import { getSession } from "lucia-sveltekit/client";

  const session = getSession();

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("/api/user", authHeader($session));
      setLocation("/signin");
    } catch (error) {
      console.log(error);
    }
  };
</script>

<h1 class="text-xl">Profile</h1>

<div class="my-2" />

{#if $session}
  <p class="text-lg">Welcome {$session.user.user_id}</p>

  <div>
    <button class="btn" on:click={async () => await deleteAccount()}>
      Delete Account
    </button>
  </div>
{:else}
  <p class="text-lg">You are not logged in</p>
{/if}
