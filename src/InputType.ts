import { z } from "zod"

const InputType = z.object({
    variables: z.record(z.string(), z.string()),
    elements: z.array(z.string())
})

type TInput = z.infer<typeof InputType>

export { InputType, TInput }