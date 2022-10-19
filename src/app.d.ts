// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface PageData {
		user: import("lucia-sveltekit/types").User | null;
	}
	interface Locals {
		getSession: import("lucia-sveltekit/types").GetSession
	}
}

declare namespace Lucia {
	type Auth = import('$lib/auth/lucia').Auth;
	type UserAttributes = {
		email: string
		roles: string[]
		emailVerified: boolean
	}
}