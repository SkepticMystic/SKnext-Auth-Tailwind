<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROLES } from "$lib/auth/roles";
  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import type { Result, SID } from "$lib/interfaces";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import type { User } from "lucia";
  import { toast } from "svelte-daisyui-toast";

  export let member: SID<Pick<User, "email" | "role">>;

  const { user } = $page.data;
  const memberIsUser = user?.userId === member._id;

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
        `/api/team/member/${member._id}`,
      );

      if (data.ok) {
        await invalidateAll();

        toast.success("Member removed from team");
      }
    } catch (error) {
      console.log(error);
      toast.error(getHTTPErrorMsg(error));
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
        { newRole },
      );

      if (data.ok) {
        await invalidateAll();

        toast.success("Member role changed");
      }
    } catch (error) {
      console.log(error);
      toast.error(getHTTPErrorMsg(error));
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
        `/api/team/member/${member._id}/transferOwnership`,
      );

      if (data.ok) {
        // Must hard reload for auth changes to take effect
        location.reload();

        toast.success("Ownership transferred");
      }
    } catch (error) {
      console.log(error);
      toast.error(getHTTPErrorMsg(error));
    }

    loadObj = {};
  };

  $: anyLoading = Object.keys(loadObj).length > 0;
</script>

<div
  class="flex min-w-[200px] flex-col gap-3 rounded-box border bg-base-100 p-3"
>
  <span class="text-sm" class:font-semibold={memberIsUser}>{member.email}</span>
  <span class="text-sm capitalize">
    {member.role === "owner" ? "👑" : ""}
    {member.role}
  </span>

  <div class="flex items-end gap-2">
    <Label lbl="Change Role">
      <select class="select" disabled={memberIsUser} bind:value={newRole}>
        {#each ROLES.filter((r) => r != "owner") as role}
          <option value={role}>{role}</option>
        {/each}
      </select>
    </Label>

    <button
      class="btn btn-secondary"
      disabled={newRole === member.role || memberIsUser || anyLoading}
      on:click={changeRole}
    >
      <Loading loading={loadObj["changeRole"]}>Change</Loading>
    </button>
  </div>

  <button
    class="btn btn-warning"
    disabled={user?.role !== "owner" || memberIsUser || anyLoading}
    on:click={transferOwnership}
  >
    <Loading loading={loadObj["transferOwnership"]}>Transfer Ownership</Loading>
  </button>

  <button
    class="btn btn-error"
    disabled={memberIsUser || anyLoading}
    on:click={removeFromTeam}
  >
    <Loading loading={loadObj["remove"]}>Remove</Loading>
  </button>
</div>
