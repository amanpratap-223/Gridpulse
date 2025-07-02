import { z } from "zod";

export const formSchema = z.object({
  SNo: z
    .string()
    .min(1, "Serial Number is required")
    .regex(/^[0-9]+$/, "Serial Number must be numeric"),

  substation: z
    .string()
    .min(1, "Substation name is required"),

  dateOfReading: z
    .string()
    .min(1, "Date of Reading is required"),

  totalUnitConsumed: z
    .string()
    .min(1, "Total Units Consumed is required")
    .regex(/^[0-9]+$/, "Must be a number"),

  temperature: z
    .string()
    .min(1, "Temperature is required")
    .regex(/^[0-9]+$/, "Must be a number"),

  transformers: z
    .array(
      z.object({
        transformerId: z
          .string()
          .min(1, "Transformer ID is required"),

        voltage: z
          .string()
          .min(1, "Voltage is required")
          .regex(/^[0-9]+$/, "Must be a number"),

        current: z
          .string()
          .min(1, "Current is required")
          .regex(/^[0-9]+$/, "Must be a number"),

        power: z
          .string()
          .min(1, "Power is required")
          .regex(/^[0-9]+$/, "Must be a number")
      })
    )
    .min(1, "At least one transformer is required"),

  areas: z.array(
    z.object({
      name: z
        .string()
        .min(1, "Area name is required")
        .regex(/^[A-Za-z ]+$/, "Only alphabets are allowed"),

      power: z
        .string()
        .min(1, "Power consumption is required")
        .regex(/^[0-9]+$/, "Must be a number")
    })
  )
});
