<script lang="ts">
  import Invite from "./invite.svelte";
  import Members from "./members.svelte";
  import PendingInvites from "./pendingInvites.svelte";

  export let data;
</script>

<h1 class="mb-7 text-2xl">Team</h1>

{#if data.pendingInvites.length}
  <h2 class="mb-3 mt-7 text-xl">Pending Invites</h2>
  <PendingInvites pendingInvites={data.pendingInvites} />
{/if}

<h2 class="mb-3 mt-7 text-xl">Invite a new member</h2>
<Invite />

<h2 class="mb-3 mt-7 text-xl">Team Members</h2>
<Members members={data.members} />
