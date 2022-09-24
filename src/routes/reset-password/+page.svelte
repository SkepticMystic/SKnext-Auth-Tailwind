<script lang="ts">
  import { page } from "$app/stores";
  import { set_href } from "$lib/auth/client";
  import ErrorText from "$lib/components/errorText.svelte";
  import Label from "$lib/components/label.svelte";
  import SuccessText from "$lib/components/successText.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  const token = $page.url.searchParams.get("token");

  let newPass: string;
  let confirmPass: string;
  let err = "";
  let suc = "";
  let loading = false;

  const resetPassword = async () => {
    if (newPass !== confirmPass) return (err = "Passwords do not match");

    loading = true;
    err = "";
    suc = "";

    try {
      const { data } = await axios.postForm("", { newPass, token });
      if (data?.data?.ok) suc = "Password changed successfully";
      else err = "Something went wrong";

      set_href("/signin");
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }

    loading = false;
  };

  $: if (newPass || confirmPass) err = "";
</script>

<form on:submit|preventDefault={async () => await resetPassword()}>
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
    Sign in
  </button>

  <ErrorText {err} />
  <SuccessText {suc} />
</form>
