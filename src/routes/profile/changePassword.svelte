<script lang="ts">
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getHTTPErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  let newPass = "";
  let confirmPass = "";
  let { err, loading, suc } = getProps();

  const changePassword = async () => {
    if (newPass !== confirmPass) return (err = "Passwords do not match");

    loading = true;
    err = suc = "";

    try {
      const { data } = await axios.put("/api/user/changePassword", { newPass });

      if (data.ok) {
        newPass = confirmPass = "";
        suc = "Password changed successfully";
      } else err = "Something went wrong";
    } catch (error) {
      console.log(error);
      err = getHTTPErrorMsg(error);
    }

    loading = false;
  };

  $: if (newPass || confirmPass) err = suc = "";
</script>

<h2 class="text-xl">Change Password</h2>

<form on:submit|preventDefault={changePassword}>
  <Label lbl="New Password">
    <input
      class="input input-sm"
      class:input-error={err}
      class:input-success={suc}
      type="password"
      autocomplete="new-password"
      bind:value={newPass}
    />
  </Label>
  <Label lbl="Password">
    <input
      class="input input-sm"
      class:input-error={err}
      class:input-success={suc}
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
