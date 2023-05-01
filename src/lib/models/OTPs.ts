import { Users } from "$lib/auth/lucia";
import type { Role } from "$lib/auth/roles";
import { ONE_DAY_MS } from "$lib/const";
import { err, suc } from "$lib/utils";
import mongoose, { Model } from "mongoose";

const OTP_KINDS = [
  "email-verification",
  "password-reset",
  "team-invite",
] as const;
type OTPKind = typeof OTP_KINDS[number];

const IDENTIFIER_FIELDS = ["_id", "email"] as const;
type IdentifierField = typeof IDENTIFIER_FIELDS[number];

// Every OTP has the following properties
export interface OTPBase {
  /** The token that the user will use to verify the OTP */
  token: string;
  /** Milliseconds since createdAt when the OTP expires */
  expiresInMs?: number;
  createdAt: Date;
  /** The kind of OTP this is */
  kind: OTPKind;
  /** The identifier of the user that this OTP is for */
  identifier: `${IdentifierField}:${string}`;
}

// OTPs can be of different kinds
// We use this to prevent one token from being used for multiple purposes
export interface EmailVerificationOTP extends OTPBase {
  identifier: `_id:${string}`;
  kind: "email-verification";
  data?: undefined;
}

export interface PasswordResetOTP extends OTPBase {
  identifier: `_id:${string}`;
  kind: "password-reset";
  data?: undefined;
}

export interface TeamInviteOTP extends OTPBase {
  // Some tokens can only identify the user by email, not userId (they might not have signed up yet)
  identifier: `email:${string}`;
  kind: "team-invite";
  data: {
    team_id: string;
    role: Role;
    createdBy: string;
  };
}

export type OTP = EmailVerificationOTP | PasswordResetOTP | TeamInviteOTP;

const modelName = "OTPs";
export const OTPs: Model<OTP> = mongoose.models[modelName] ||
  mongoose.model<OTP>(
    modelName,
    new mongoose.Schema(
      {
        identifier: {
          type: String,
          required: true,
        },
        token: {
          type: String,
          // Use the crypto Web API to generate a random token
          default: crypto.randomUUID,
        },
        expiresInMs: {
          type: Number,
          default: ONE_DAY_MS,
        },
        kind: {
          type: String,
          required: true,
          enum: OTP_KINDS,
        },
        data: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
      { timestamps: true },
    ),
    modelName,
  );

/**
 * Check if an OTP is expired.
 *   If it doesn't have an expiry date, it's never expired
 */
const isExpired = (
  { createdAt, expiresInMs }: Pick<OTP, "expiresInMs" | "createdAt">,
) => {
  if (expiresInMs === undefined) return false;

  return (createdAt.getTime() + expiresInMs) < Date.now();
};

/** A more type-safe option than OTPs.create */
const create = async <T extends OTP>(
  options: Omit<T, "token" | "createdAt">,
) => OTPs.create(options);

/**
 * Return an existing OTP if it exists and is not expired,
 *   or create a new one if it doesn't exist or is expired.
 */
const getOrCreate = async (
  options: Omit<OTP, "token" | "createdAt">,
) => {
  const { identifier, kind } = options;

  // Check if there is an existing OTP for that user of that kind
  const existing = await OTPs.findOne({ identifier, kind }).exec();

  if (existing) {
    if (isExpired(existing)) {
      console.log("Existing OTP expired, creating new one");

      const [newOTP, _removeOld] = await Promise.all([
        create(options),
        existing.deleteOne(),
      ]);

      return newOTP;
    } else {
      console.log("Existing OTP not expired, returning it");
      return existing;
    }
  } else {
    console.log("No existing OTP, creating new one");
    return create(options);
  }
};

/**
 * Given a token, and the kind of OTP, returns the OTP if it exists and is not expired.
 *
 * If the OTP is expired, it will be deleted.
 */
const validateToken = async <T extends OTP = OTP>(
  input: Pick<T, "token" | "kind">,
) => {
  const { token, kind } = input;

  const otp = (await OTPs.findOne({ token, kind }).exec()) as
    | (mongoose.Document<unknown, any, T> & T)
    | null;

  if (!otp) {
    console.log("OTP not found");
    return err("otp_not_found");
  }

  if (isExpired(otp)) {
    console.log("OTP expired");
    await otp.deleteOne();
    return err("otp_expired");
  }

  return suc(otp);
};

/** Given an OTP,
 *   parse the identifier,
 *   find the user,
 *   make sure the identifier value matches,
 *   and return the user in Lucia format.
 *
 * If the user is not found,
 *   or the identifier value doesn't match,
 *   it will return an error, but it **won't** delete the OTP.
 *
 * Use this to check if a user exists to decide how to handle their OTP.
 */
const getTokenUser = async (otp: Pick<OTP, "identifier">) => {
  // Parse the identifier
  const [idField, ...rest1] = otp.identifier.split(":") as [
    IdentifierField,
    ...string[],
  ];

  const id = { field: idField, value: rest1.join(":") };

  if (!IDENTIFIER_FIELDS.includes(id.field)) {
    return err({ id, message: "invalid_identifier_field" as const });
  }

  // Find the user
  const rawUser = await Users.findOne({ [id.field]: id.value }).lean();
  if (!rawUser) {
    return err({ id, message: "user_not_found" as const });
  }

  // Make sure the identifier value matches
  // NOTE: Mongo will just find the first user in the db if either of these are undefined
  //  so we need to check for that
  if (rawUser[id.field] !== id.value) {
    return err({ id, message: "identifier_value_mismatch" as const });
  }

  // Convert to the shape auth.getUser would return
  const { _id, ...rest2 } = rawUser;
  const user = { userId: _id.toString(), ...rest2 };

  return suc({ id, user });
};

/**
 * Given a token, and the kind of OTP, returns the user and the OTP if it exists and is not expired.
 *
 * If the OTP is expired, or the user is not found, it will be deleted.
 */
const validateUserToken = async (input: Pick<OTP, "token" | "kind">) => {
  const validate = await validateToken(input);
  if (!validate.ok) return err(validate.error);

  const otp = validate.data;

  const userCheck = await getTokenUser(otp);
  if (!userCheck.ok) {
    await otp.deleteOne();
    return err(userCheck.error);
  }

  const { user } = userCheck.data;
  return suc({ user, otp });
};

const handleLinks = {
  "email-verification": async (input: { idValue: string; url: URL }) => {
    const { url, idValue } = input;

    // We know there were no existing email-verification OTPs,
    //   since we just created the user
    //   so we can create a new one without checking for existing
    const otp = await OTP.create({
      identifier: `_id:${idValue}`,
      kind: "email-verification",
    });

    const href =
      `${url.origin}/api/verify-email?token=${otp.token}&_id=${idValue}`;
    console.log(href);
    console.log("TODO: sendEmail");
  },

  "password-reset": async (input: { idValue: string; url: URL }) => {
    const { url, idValue } = input;

    const otp = await OTP.getOrCreate({
      identifier: `_id:${idValue}`,
      kind: "password-reset",
    });

    const href = `${url.origin}/reset-password?token=${otp.token}`;
    console.log(href);
    console.log("TODO: sendEmail");
  },

  "team-invite": async (
    input: { idValue: string; url: URL; data: TeamInviteOTP["data"] },
  ) => {
    const { url, idValue, data } = input;

    const otp = await OTP.create<TeamInviteOTP>({
      identifier: `email:${idValue}`,
      kind: "team-invite",
      data,
    });

    const href =
      `${url.origin}/api/team/join?token=${otp.token}&team_id=${data.team_id}`;
    console.log(href);
    console.log("TODO: sendEmail");
  },
} satisfies Record<
  OTPKind,
  (input: any) => Promise<void>
>;

export const OTP = {
  isExpired,
  create,
  getOrCreate,
  validateToken,
  getTokenUser,
  validateUserToken,
  handleLinks,
};
