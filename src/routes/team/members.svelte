<script lang="ts">
  import type { OID } from "$lib/interfaces";
  import type { User } from "lucia-auth";

  export let members: OID<Pick<User, "email" | "role">>[];
</script>

{#each members as { _id, email, role }}
  <div class="flex flex-wrap gap-3 items-center">
    <div class="flex flex-col gap-1">
      <span class="text-sm text-gray-500">{email}</span>
    </div>
    <span class="text-sm text-gray-500">{role}</span>
  </div>
{/each}
