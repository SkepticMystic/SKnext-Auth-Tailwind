<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { ROLES, type Role } from "$lib/auth/roles";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { addToast } from "$lib/stores/toast";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  let { loading, err } = getProps();
  let email: string;
  let role: Role;

  const inviteToTeam = async () => {
    (loading = true), (err = "");

    try {
      const { data } = await axios.post("/api/team/invite", { email, role });
      if (data.ok) {
        addToast({
          type: "success",
          message: "Invite sent!",
          duration_ms: 3000,
        });
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
  <div class="flex flex-wrap gap-3 items-end">
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

    <div class="flex flex-wrap gap-3 items-center">
      <button
        class="btn btn-secondary"
        class:loading
        disabled={!email || !role || loading}
        on:click={inviteToTeam}
      >
        Invite to Team
      </button>

      <ResultText {err} />
    </div>
  </div>
</form>
