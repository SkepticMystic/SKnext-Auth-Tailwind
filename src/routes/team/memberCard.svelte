<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROLES, type Role } from "$lib/auth/roles";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import type { OID, Result } from "$lib/interfaces";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import type { User } from "lucia-auth";

  export let member: OID<Pick<User, "email" | "role">>;

  let { loading, suc, err } = getProps();

  const removeFromTeam = async () => {
    if (
      !confirm(`Are you sure you want to remove ${member.email} from the team?`)
    )
      return;
    (loading = true), (err = suc = "");

    try {
      const { data } = await axios.delete<Result>(
        `/api/team/member/${member._id}`
      );

      if (data.ok) {
        suc = "Member removed from team";
        await invalidateAll();
      }
    } catch (error) {
      console.log(error);
      alert(getHTTPErrorMsg(error));
    }

    loading = false;
  };

  const changeRole = async (e: Event) => {
    if (!confirm(`Are you sure you want to change ${member.email}'s role?`)) {
      (e.target as HTMLSelectElement).value = member.role;
      return;
    }
    (loading = true), (err = suc = "");

    const newRole = (e.target as HTMLSelectElement).value as Role;

    try {
      const { data } = await axios.put<Result>(
        `/api/team/member/${member._id}/role`,
        { newRole }
      );

      if (data.ok) {
        suc = "Member role changed";
        await invalidateAll();
      }
    } catch (error) {
      console.log(error);
      alert(getHTTPErrorMsg(error));
    }

    loading = false;
  };
</script>

<div
  class="p-3 border bg-base-100 rounded-box flex flex-col gap-3 min-w-[200px]"
>
  <span class="text-sm">{member.email}</span>
  <span class="text-sm">{member.role}</span>

  <div>
    <Label lbl="Change Role">
      <select class="select" value={member.role} on:change={changeRole}>
        {#each ROLES as role}
          <option value={role}>{role}</option>
        {/each}
      </select>
    </Label>
  </div>

  <button
    class="btn btn-error"
    class:loading
    disabled={loading || $page.data.user.userId === member._id.toString()}
    on:click={removeFromTeam}
  >
    Remove
  </button>

  <ResultText {suc} {err} />
</div>
