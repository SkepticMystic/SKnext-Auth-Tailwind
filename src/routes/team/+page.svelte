<script lang="ts">
  import Invite from "./invite.svelte";
  import Members from "./members.svelte";

  export let data;
</script>

<h1 class="text-2xl mb-7">Team</h1>

<h2 class="text-xl mt-7 mb-3">Invite a new member</h2>
<Invite />

<h2 class="text-xl mt-7 mb-3">Team Members</h2>
<Members members={data.members} />
