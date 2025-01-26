<script lang="ts">
  import type { SID } from "$lib/interfaces";
  import type { User } from "lucia";
  import MemberCard from "./memberCard.svelte";

  interface Props {
    members: SID<Pick<User, "email" | "role">>[];
  }

  let { members }: Props = $props();
</script>

<div class="flex gap-3">
  {#each members as member}
    <MemberCard {member} />
  {/each}
</div>
