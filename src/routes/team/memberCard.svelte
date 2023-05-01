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

  const memberIsUser = $page.data.user.userId === member._id.toString();

  let { loadObj, suc, err } = getProps();

  let newRole = member.role;

  const removeFromTeam = async () => {
    if (
      !confirm(`Are you sure you want to remove ${member.email} from the team?`)
    )
      return;
    (loadObj["remove"] = true), (err = suc = "");

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

    loadObj = {};
  };

  const changeRole = async () => {
    if (!confirm(`Are you sure you want to change ${member.email}'s role?`)) {
      newRole = member.role;
      return;
    }
    (loadObj["changeRole"] = true), (err = suc = "");

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

    loadObj = {};
  };

  $: anyLoading = Object.keys(loadObj).length > 0;
</script>

<div
  class="p-3 border bg-base-100 rounded-box flex flex-col gap-3 min-w-[200px]"
>
  <span class="text-sm">{member.email}</span>
  <span class="text-sm">{member.role}</span>

  <div class="flex gap-2 items-end">
    <Label lbl="Change Role">
      <select class="select" bind:value={newRole}>
        {#each ROLES as role}
          <option value={role}>{role}</option>
        {/each}
      </select>
    </Label>

    <button
      class="btn btn-secondary"
      class:loading={loadObj["changeRole"]}
      disabled={memberIsUser || anyLoading || newRole === member.role}
      on:click={changeRole}
    >
      Change
    </button>
  </div>

  <button
    class="btn btn-error"
    class:loading={loadObj["remove"]}
    disabled={memberIsUser || anyLoading}
    on:click={removeFromTeam}
  >
    Remove
  </button>

  <ResultText {suc} {err} />
</div>
