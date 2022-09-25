<script lang="ts">
  import { page } from "$app/stores";
  import { authHeader } from "$lib/auth/client";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { errSucLoading } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  const { _lucia } = $page.data;

  let newPass = "";
  let confirmPass = "";
  let { err, loading, suc } = errSucLoading();

  const changePassword = async () => {
    if (newPass !== confirmPass) return (err = "Passwords do not match");

    loading = true;
    err = "";
    suc = "";

    try {
      const { data } = await axios.put(
        "/api/user/changePassword",
        { newPass },
        authHeader(_lucia)
      );

      if (data.ok) {
        suc = "Password changed successfully";
        newPass = "";
        confirmPass = "";
      } else err = "Something went wrong";
    } catch (error) {
      console.log(error);
      err = getHTTPErrorMsg(error);
    }

    loading = false;
  };

  $: if (newPass || confirmPass) {
    err = "";
    suc = "";
  }
</script>

<h2 class="text-xl">Change Password</h2>

<form on:submit|preventDefault={async () => await changePassword()}>
  <Label lbl="New Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={newPass}
    />
  </Label>
  <Label lbl="Password">
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
    Change Password
  </button>

  <ResultText {err} {suc} />
</form>
