import pusher from "@/lib/pusher";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { channel, event ,data} = await req.json();
    

    try {
        await pusher.trigger(channel, event, data); 
    } catch (error) {
        console.error("error sending pusher event", error);
    } 

    return NextResponse.json({ success: true },{status: 200});

} 