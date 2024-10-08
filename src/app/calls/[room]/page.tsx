"use client";

import { FC } from 'react';

const Room: FC<{ params: { room: string } }> = ({ params: {
    room
} }) => {
    return (
        <div>Room :{room} </div>
    )
}

export default Room; 