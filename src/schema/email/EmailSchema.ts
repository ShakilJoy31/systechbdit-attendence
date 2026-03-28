import { z } from "zod";

export const emailSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().optional(),
  projectName: z.string().min(1, "Project name is required"),
});

export type EmailSchemaData = z.infer<typeof emailSchema>;

export interface EmailType {
  firstName: string;
  lastName?: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
  country?: string;
  projectName: string;
}
