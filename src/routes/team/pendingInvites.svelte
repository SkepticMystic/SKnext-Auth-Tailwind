<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Loading from "$lib/components/daisyui/Loading.svelte";
  import type { Result, SID } from "$lib/interfaces";
  import type { TeamInviteOTP } from "$lib/models/OTPs";
  import { any_loading, Loader } from "$lib/utils/loader";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  interface Props {
    pendingInvites: SID<
      Pick<TeamInviteOTP, "createdAt" | "data" | "expiresInMs" | "identifier">
    >[];
  }

  let { pendingInvites }: Props = $props();

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
    <div class="rounded-box bg-base-100 flex flex-col gap-2 border p-3">
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
        onclick={() => deletePendingInvite(_id)}
      >
        <Loading loading={$loader[`delete-invite-${_id}`]} />
        Delete
      </button>
    </div>
  {/each}
</div>
