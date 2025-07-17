import { z } from "zod";

export const formSchema = z.object({
  substation: z
    .literal(5, {
      errorMap: () => ({ message: "Only substation 5 is allowed" }),
    }),

  dateOfReading: z
    .string()
    .min(1, "Date of Reading is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please select a valid date",
    }),

  totalUnitConsumed: z
    .string()
    .min(1, "Total Units Consumed is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Total Units Consumed must be a positive number",
    }),

  temperature: z
    .string()
    .min(1, "Temperature is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Temperature must be a positive number",
    }),

  transformers: z
    .array(
      z.object({
        transformerId: z.string().min(1, "Transformer ID is required"),
        voltage: z
          .string()
          .min(1, "Voltage is required")
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Voltage must be a positive number",
          }),
        current: z
          .string()
          .min(1, "Current is required")
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Current must be a positive number",
          }),
        power: z
          .string()
          .min(1, "Power is required")
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Power must be a positive number",
          }),
      })
    )
    .min(1, "At least one transformer is required"),

  areas: z.array(
    z.object({
      name: z.string().min(1, "Area name is required"),
      power: z
        .string()
        .min(1, "Power consumption is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: "Power consumption must be a positive number",
        }),
    })
  ),
});
