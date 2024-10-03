import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const create = internalMutation({
    args: {
        username: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        status: v.string(),
        clerkId: v.string(),
    },
    async handler(ctx, args) {
        return ctx.db
            .insert('users', args)
    },
})


export const get = internalQuery(
    {
        args: {
            clerkId: v.string(),

        },
        async handler(ctx, args) {
            return ctx.db
                .query('users')
                .withIndex('by_clerkId', q => q.eq("clerkId", args.clerkId))
                .unique()
        },
    }
)