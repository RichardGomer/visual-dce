import { z } from "zod"

const InputType = z.array(z.object({
    variables: z.record(z.string(), z.string()),
    elements: z.array(z.string()),
    name: z.string().optional(),
}))

type TInput = z.infer<typeof InputType>

export { InputType, TInput }