import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { Webhook } from "svix"
import { internal } from "./_generated/api"

const http = httpRouter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePayload = async (req: Request): Promise<any> => {
    const svixHeaders = {
        'svix-id': req.headers.get('svix-id')!,
        'svix-signature': req.headers.get('svix-signature')!,
        'svix-timestamp': req.headers.get('svix-timestamp')!,
    }  

    const payload = await req.text();

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
    try {
        return  webhook.verify(payload, svixHeaders)
    } catch (error) {
        console.error("Error validating webhook Payload", error);
        return 
    }
};


const handler = httpAction(async (ctx, req) => {
    const event = await validatePayload(req);

    if (!event) {
        return new Response("Invalid Payload", { status: 400 });
    }

    switch (event.type) {
        case "user.created":
            const user = await ctx.runQuery(internal.user.get, {
                clerkId: event.data.id,
            })
            
            if (user) {
                console.log("Upadting user with new data ", event.data.id)
            }
        case "user.updated":
            console.log(event.data)
            console.log("updadting user with new data ", event.data.id)
            
            await ctx.runMutation(internal.user.create, {
                username: `${event.data.first_name} ${event.data.last_name || ""}`,
                email: event.data.email_addresses[0].email_address,
                clerkId: event.data.id,
                imageUrl: event.data.image_url,
                status: 'just came onboard! 🚀',
            })

            break;
        default:
            console.log("Unhandled event type", event.type)
    }

    return new Response("WebHook Processed ", { status: 200 });
});

http.route({
    path: "/clerk-auth-users-webhook",
    method: "POST",
    handler,
})

export default http;