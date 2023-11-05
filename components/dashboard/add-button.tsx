"use client"
import React from 'react';
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {useRouter, usePathname} from "next/navigation";

const AddButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Button
            type="button"
            onClick={() => {
                router.push(`${pathname}/new`)
            }}
        >
            <Icons.plus className="mr-1"/>
            Add Question
        </Button>
    );
};

export default AddButton;