import { useTheme } from "next-themes"
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

const Statuses = [
  '👋 Speak Freely',
  '🟢 Available',
  '🌙 Do Not Disturb',
  '💤 Away',
  '🔴 Busy',
]

const ProfileDialogContent = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <Card className='border-0'>
        <CardTitle>Profile</CardTitle>
        <div>
          <Avatar> 
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </Card>
      <div className="flex flex-col gap-y-y-6"> 

        <div className="flex items-center space-x-2">
          <UserRound/>
        </div>
        
    </div>

    </div>
  )
}

export default ProfileDialogContent