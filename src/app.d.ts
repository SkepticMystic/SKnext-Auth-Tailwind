/// <reference types="@sveltejs/kit" />
declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
    }

    interface PageData {}
  }
}

/// <reference types="lucia" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/auth/lucia").Auth;

    type DatabaseUserAttributes = {
      email: string;
      team_id: string;
      role: import("$lib/auth/roles").Role;
      emailVerified: boolean;
      admin: boolean;
    };

    type DatabaseSessionAttributes = {};
  }
}

// THIS IS IMPORTANT!!!
export {};
