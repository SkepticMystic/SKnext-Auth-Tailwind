<script lang="ts">
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";

  let email: string;
  let { err, suc, loading } = getProps();

  const forgotPassword = async () => {
    (loading = true), (err = suc = "");

    try {
      const { data } = await axios.postForm<ActionResult>("", { email });

      if (data.type === "success")
        suc = "Check your email for a link to reset your password.";
      else err = "There was an error sending the email.";
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }

    loading = false;
  };

  $: if (email) err = suc = "";
</script>

<form on:submit|preventDefault={forgotPassword}>
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

  <ResultText {err} {suc} />
</form>
