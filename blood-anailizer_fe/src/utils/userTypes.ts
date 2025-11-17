/**
 * User Types Configuration
 */

export type UserType = "Patient" | "Doctor";

export interface UserTypeOption {
  value: UserType;
  label: string;
  description: string;
}

export const USER_TYPE_OPTIONS: UserTypeOption[] = [
  {
    value: "Patient",
    label: "Patient",
    description: "I want to view and understand my blood test results"
  },
  {
    value: "Doctor",
    label: "Doctor / Healthcare Professional",
    description: "I'm a healthcare professional reviewing blood tests"
  }
];

export const DEFAULT_USER_TYPE: UserType = "Patient";
