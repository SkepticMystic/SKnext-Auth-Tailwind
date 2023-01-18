/// <reference types="@sveltejs/kit" />
declare namespace App {
	interface Locals {
		validate: import("@lucia-auth/sveltekit").Validate;
		validateUser: import("@lucia-auth/sveltekit").ValidateUser;
		setSession: import("@lucia-auth/sveltekit").SetSession;
	}
}

/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/auth/lucia').Auth;
	type UserAttributes = {
		email: string
		roles: (import('$lib/auth/roles').Role)[]
		emailVerified: boolean
	}
}