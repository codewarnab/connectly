import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

type MutationState = "idle" | "loading" | "success" | "error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMutationHandler = <T, P>(mutation: any) => {
    const [state, setState] = useState<MutationState>('idle');

    const mutationFn = useMutation(mutation);

    const mutate = useCallback(
        async (payload: P): Promise<T | null> => {
            setState('loading');
            try {
                const result = await mutationFn(payload);
                setState('success');
                return result as T; 
            } catch (error) {
                setState('error');
                console.error("Mutation Error ", error);
                return null; 
            } finally {
                setState('idle');
            }
        }, [mutationFn]);

    return { mutate, state };
};
