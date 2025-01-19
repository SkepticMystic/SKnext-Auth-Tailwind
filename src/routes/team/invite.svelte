<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { ROLES, type Role } from "$lib/auth/roles";
  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  let { loading, err } = getProps();
  let email: string;
  let role: Role;

  const inviteToTeam = async () => {
    (loading = true), (err = "");

    try {
      const { data } = await axios.post("/api/team/invite", { email, role });
      if (data.ok) {
        toast.success("Invite sent!");
        (email = ""), (role = "member");

        await invalidateAll();
      }
    } catch (error) {
      console.log(error);
      err = getHTTPErrorMsg(error);
    }

    loading = false;
  };

  $: if (email || role) err = "";
</script>

<form class="flex flex-col gap-3">
  <div class="flex flex-wrap items-end gap-3">
    <Label lbl="Email">
      <input
        type="email"
        class="input"
        autocomplete="email"
        bind:value={email}
      />
    </Label>

    <Label lbl="Role">
      <select class="select" bind:value={role}>
        {#each ROLES as role}
          <option value={role}>{role}</option>
        {/each}
      </select>
    </Label>

    <div class="flex flex-wrap items-center gap-3">
      <button
        class="btn btn-secondary"
        disabled={!email || !role || loading}
        on:click={inviteToTeam}
      >
        <Loading {loading} />
        Invite to Team
      </button>

      <ResultText {err} />
    </div>
  </div>
</form>
