<script lang="ts">
  import { set_href } from "$lib/auth/client";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";

  let newPass: string;
  let confirmPass: string;
  let { err, suc, loading } = getProps();

  const resetPassword = async () => {
    if (newPass !== confirmPass) return (err = "Passwords do not match");

    loading = true;
    err = suc = "";

    try {
      const { data } = await axios.postForm<ActionResult>("", { newPass });
      if (data.type === "success") {
        suc = "Password changed successfully";
        set_href("/signin?previous=reset-password");
      } else err = "Something went wrong";
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }

    loading = false;
  };

  $: if (newPass || confirmPass) err = suc = "";
</script>

<form on:submit|preventDefault={resetPassword}>
  <Label lbl="New Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={newPass}
    />
  </Label>
  <Label lbl="Confirm Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={confirmPass}
    />
  </Label>

  <button
    class="my-4 btn btn-primary"
    class:loading
    type="submit"
    disabled={!newPass || !confirmPass || loading}
  >
    Reset Password
  </button>

  <ResultText {err} {suc} />
</form>
