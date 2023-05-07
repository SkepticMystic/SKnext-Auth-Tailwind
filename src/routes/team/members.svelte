<script lang="ts">
  import type { SID } from "$lib/interfaces";
  import type { User } from "lucia-auth";
  import MemberCard from "./memberCard.svelte";

  export let members: SID<Pick<User, "email" | "role">>[];
</script>

<div class="flex gap-3">
  {#each members as member}
    <MemberCard {member} />
  {/each}
</div>
