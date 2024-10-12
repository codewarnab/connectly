'use client';


import { NavigationBar } from '@/components/NaviGationBar';
import { NewGroup } from '@/components/new-group';
import { MobileChatContent } from '@/components/Mobile-Chat-Content';
import Image from 'next/image';

const ChatPage = () => {
  return (
    <>
      <NavigationBar trigger={<NewGroup />} />
      <div className='hidden md:grid h-full max-w-56 text-center mx-auto place-content-center'>
        <Image src='/connectly.png' alt='connectly' width={200} height={200} />
        <p className='text-sm mt-5 text-primary-main'>
          Welcome to connectly messenger! Start a new chat or select an existing
          one to get started.
        </p>
      </div>
      <div className='md:hidden flex flex-col space-y-2'>
        <MobileChatContent />
      </div>
    </>
  );
};

export default ChatPage;