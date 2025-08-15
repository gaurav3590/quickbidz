"use client";

import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseNotifications } from '@/hooks/useFirebaseNotifications';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function NotificationPermissionButton() {
  const { isNotificationsEnabled, enableNotifications } = useFirebaseNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    await enableNotifications();
    setIsLoading(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isNotificationsEnabled ? "outline" : "default"}
            size="sm"
            onClick={handleEnableNotifications}
            disabled={isNotificationsEnabled || isLoading}
            className={`${isNotificationsEnabled ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800' : ''}`}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isNotificationsEnabled ? (
              <Bell className="h-4 w-4 mr-2" />
            ) : (
              <BellOff className="h-4 w-4 mr-2" />
            )}
            {isNotificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isNotificationsEnabled 
            ? 'You will receive notifications for your auctions' 
            : 'Enable notifications to stay updated on your auctions'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 