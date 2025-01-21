<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { ROLES } from "$lib/auth/roles";
  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import type { Result, SID } from "$lib/interfaces";
  import { user } from "$lib/stores/user";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import axios from "axios";
  import type { User } from "lucia";
  import { toast } from "svelte-daisyui-toast";

  export let member: SID<Pick<User, "email" | "role">>;

  const loader = Loader<
    "remove-member" | "change-role" | "transfer-ownership"
  >();

  const memberIsUser = $user?.userId === member._id;

  let newRole = member.role;

  const removeFromTeam = async () => {
    if (
      !confirm(`Are you sure you want to remove ${member.email} from the team?`)
    ) {
      return;
    }

    loader.load("remove-member");

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

    loader.reset();
  };

  const changeRole = async () => {
    if (!confirm(`Are you sure you want to change ${member.email}'s role?`)) {
      newRole = member.role;
      return;
    }

    loader.load("change-role");

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

    loader.reset();
  };

  const transferOwnership = async () => {
    if (!confirm(`Are you sure you want to make ${member.email} the owner?`)) {
      newRole = member.role;
      return;
    }

    loader.load("transfer-ownership");

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

    loader.reset();
  };
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
      disabled={newRole === member.role || memberIsUser || any_loading($loader)}
      on:click={changeRole}
    >
      <Loading loading={$loader["change-role"]}>Change</Loading>
    </button>
  </div>

  <button
    class="btn btn-warning"
    disabled={$user?.role !== "owner" || memberIsUser || any_loading($loader)}
    on:click={transferOwnership}
  >
    <Loading loading={$loader["transfer-ownership"]}>
      Transfer Ownership
    </Loading>
  </button>

  <button
    class="btn btn-error"
    disabled={memberIsUser || any_loading($loader)}
    on:click={removeFromTeam}
  >
    <Loading loading={$loader["remove-member"]}>Remove</Loading>
  </button>
</div>
