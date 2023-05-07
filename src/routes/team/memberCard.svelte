<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROLES } from "$lib/auth/roles";
  import Label from "$lib/components/label.svelte";
  import type { Result, SID } from "$lib/interfaces";
  import { addToast } from "$lib/stores/toast";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import type { User } from "lucia-auth";

  export let member: SID<Pick<User, "email" | "role">>;

  const { user } = $page.data;
  const memberIsUser = user.userId === member._id;

  let { loadObj } = getProps();

  let newRole = member.role;

  const removeFromTeam = async () => {
    if (
      !confirm(`Are you sure you want to remove ${member.email} from the team?`)
    )
      return;
    loadObj["remove"] = true;

    try {
      const { data } = await axios.delete<Result>(
        `/api/team/member/${member._id}`
      );

      if (data.ok) {
        await invalidateAll();

        addToast({
          message: "Member removed from team",
          type: "success",
          duration_ms: 3_000,
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: getHTTPErrorMsg(error),
        type: "error",
      });
    }

    loadObj = {};
  };

  const changeRole = async () => {
    if (!confirm(`Are you sure you want to change ${member.email}'s role?`)) {
      newRole = member.role;
      return;
    }
    loadObj["changeRole"] = true;

    try {
      const { data } = await axios.put<Result>(
        `/api/team/member/${member._id}/role`,
        { newRole }
      );

      if (data.ok) {
        await invalidateAll();

        addToast({
          message: "Member role changed",
          type: "success",
          duration_ms: 3_000,
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: getHTTPErrorMsg(error),
        type: "error",
      });
    }

    loadObj = {};
  };

  const transferOwnership = async () => {
    if (!confirm(`Are you sure you want to make ${member.email} the owner?`)) {
      newRole = member.role;
      return;
    }
    loadObj["transferOwnership"] = true;

    try {
      const { data } = await axios.put<Result>(
        `/api/team/member/${member._id}/transferOwnership`
      );

      if (data.ok) {
        // Must hard reload for auth changes to take effect
        location.reload();

        addToast({
          message: "Ownership transferred",
          type: "success",
          duration_ms: 3_000,
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: getHTTPErrorMsg(error),
        type: "error",
      });
    }

    loadObj = {};
  };

  $: anyLoading = Object.keys(loadObj).length > 0;
</script>

<div
  class="p-3 border bg-base-100 rounded-box flex flex-col gap-3 min-w-[200px]"
>
  <span class="text-sm" class:font-semibold={memberIsUser}>{member.email}</span>
  <span class="text-sm capitalize">
    {member.role === "owner" ? "👑" : ""}
    {member.role}
  </span>

  <div class="flex gap-2 items-end">
    <Label lbl="Change Role">
      <select class="select" disabled={memberIsUser} bind:value={newRole}>
        {#each ROLES.filter((r) => r != "owner") as role}
          <option value={role}>{role}</option>
        {/each}
      </select>
    </Label>

    <button
      class="btn btn-secondary"
      class:loading={loadObj["changeRole"]}
      disabled={newRole === member.role || memberIsUser || anyLoading}
      on:click={changeRole}
    >
      {#if !loadObj["changeRole"]}
        Change
      {/if}
    </button>
  </div>

  <button
    class="btn btn-warning"
    class:loading={loadObj["transferOwnership"]}
    disabled={user.role !== "owner" || memberIsUser || anyLoading}
    on:click={transferOwnership}
  >
    {#if !loadObj["transferOwnership"]}
      Transfer Ownership
    {/if}
  </button>

  <button
    class="btn btn-error"
    class:loading={loadObj["remove"]}
    disabled={memberIsUser || anyLoading}
    on:click={removeFromTeam}
  >
    {#if !loadObj["remove"]}
      Remove
    {/if}
  </button>
</div>
