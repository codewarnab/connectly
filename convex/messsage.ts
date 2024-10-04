import { ConvexError , v} from "convex/values";
import { getUserDataById } from "./_utils";
import { mutation } from "./_generated/server";


export const create = mutation({
    args: {
        conversationId: v.id(),
        type : v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError('Not authenticated');

        const currentUser = await getUserDataById({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) throw new ConvexError('User not found');

        const membership = await ctx.db.query("converation_members", q => q.eq("memberId", currentUser._id));
        
       
    },
});