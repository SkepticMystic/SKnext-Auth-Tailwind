// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface Locals {
		getSession: import("@lucia-auth/sveltekit").GetSession;
		getSessionUser: import("@lucia-auth/sveltekit").GetSessionUser;
		setSession: import("@lucia-auth/sveltekit").SetSession;
		clearSession: import("@lucia-auth/sveltekit").ClearSession;
	}
}

declare namespace Lucia {
	type Auth = import('$lib/auth/lucia').Auth;
	type UserAttributes = {
		email: string
		roles: (import('$lib/auth/roles').Role)[]
		emailVerified: boolean
	}
}