<script lang="ts">
  import ErrorText from "$lib/components/errorText.svelte";
  import Label from "$lib/components/label.svelte";
  import SuccessText from "$lib/components/successText.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import axios from "axios";

  let email: string;
  let err = "";
  let suc = "";
  let loading = false;

  const forgotPassword = async () => {
    loading = true;
    err = "";
    suc = "";

    try {
      const { data } = await axios.postForm("", { email });

      if (data?.data?.ok)
        suc = "Check your email for a link to reset your password.";
      else err = "There was an error sending the email.";
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }

    loading = false;
  };

  $: if (email) {
    err = "";
    suc = "";
  }
</script>

<form on:submit|preventDefault={async () => await forgotPassword()}>
  <Label lbl="Email">
    <input class="input" type="email" autocomplete="email" bind:value={email} />
  </Label>

  <button
    class="my-4 btn btn-primary"
    class:loading
    type="submit"
    disabled={!email || loading}
  >
    Send Password Reset Email
  </button>

  <ErrorText {err} />
  <SuccessText {suc} />
</form>
