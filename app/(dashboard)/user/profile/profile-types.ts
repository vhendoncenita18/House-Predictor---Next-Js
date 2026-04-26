export type ProfileUser = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  birthdate: string;
  username: string;
  avatarUrl: string | null;
  utype: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileResponse = {
  user: ProfileUser;
};

export type ErrorResponse = {
  error?: string;
};

export type ProfileFormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthdate: string;
  avatarUrl: string;
};

export type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type SessionUser = {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  gender?: string;
  birthdate?: string;
  username?: string;
  avatarUrl?: string | null;
  utype?: string;
};

export const emptyProfileForm: ProfileFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  birthdate: "",
  avatarUrl: "",
};

export const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
