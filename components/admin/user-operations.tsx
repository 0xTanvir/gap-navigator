import React from 'react';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

const UserOperations = () => {
  return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
              className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
            <Icons.ellipsis className="h-4 w-4"/>
            <span className="sr-only">Open</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
                className="flex cursor-pointer items-center"
            >
              <Icons.userPlus className="mr-2 h-4 w-4"/>
              Role change
            </DropdownMenuItem>

            <DropdownMenuSeparator/>

          </DropdownMenuContent>

        </DropdownMenu>
      </>
  );
};

export default UserOperations;