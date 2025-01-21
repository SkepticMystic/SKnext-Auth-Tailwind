<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import type { Result, SID } from "$lib/interfaces";
  import type { TeamInviteOTP } from "$lib/models/OTPs";
  import { any_loading, Loader } from "$lib/utils/loader";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  export let pendingInvites: SID<
    Pick<TeamInviteOTP, "createdAt" | "data" | "expiresInMs" | "identifier">
  >[];

  const loader = Loader<`delete-invite-${string}`>();

  const deletePendingInvite = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this invite?")) return;

    loader.load(`delete-invite-${_id}`);

    const { data } = await axios.delete<Result>(`/api/team/invite/${_id}`);

    if (data.ok) {
      await invalidateAll();

      toast.success("Invite deleted");
    }

    loader.reset();
  };
</script>

<div class="flex gap-3">
  {#each pendingInvites as { _id, createdAt, data, identifier, expiresInMs }}
    <div class="flex flex-col gap-2 rounded-box border bg-base-100 p-3">
      <span>
        <span>{identifier.split("email:")[1]}</span> -
        <span class="capitalize">{data.role}</span>
      </span>
      <span class="">
        Expires: {expiresInMs
          ? new Date(createdAt.getTime() + expiresInMs).toLocaleString()
          : "Never"}
      </span>

      <button
        class="btn btn-error"
        disabled={any_loading($loader)}
        on:click={() => deletePendingInvite(_id)}
      >
        <Loading loading={$loader[`delete-invite-${_id}`]} />
        Delete
      </button>
    </div>
  {/each}
</div>
