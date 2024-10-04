import { ConvexError } from 'convex/values';
import { getUserDataById } from './_utils';
import { query } from './_generated/server';

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError('Not authenticated');
        
        const currentUser = await getUserDataById({
            ctx,
            clerkId: identity.subject,
        });
        if (currentUser === undefined || currentUser === null) throw new ConvexError('User not found');

        const friendRequests = await ctx.db
            .query('friend_requests')
            .withIndex('by_receiver', q => q.eq('receiver', currentUser._id))
            .collect();

        if (!friendRequests.length) return [];  // Return an empty array if no friend requests

        const requestsWithSender = await Promise.all(
            friendRequests.map(async friendRequest => {
                const sender = await ctx.db.get(friendRequest.sender);
                if (!sender) throw new ConvexError('Sender not found');

                return { ...friendRequest, sender };
            })
        );

        return requestsWithSender;
    },
});
