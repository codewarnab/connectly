import { FC, ReactNode } from "react";
import ChatsLayout from "@/components/layouts/ChatsLayout";

type LayoutProps = {
    children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <div className="hidden md:flex md:ml-24 h-screen">
                <ChatsLayout>
                    {children}
                </ChatsLayout>
            </div>

            <div className="md:hidden flex flex-col h-screen pt-20 pb-20">
                {children}
            </div>
        </>
    );
}

export default Layout;