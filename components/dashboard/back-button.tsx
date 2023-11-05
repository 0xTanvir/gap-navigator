"use client"
import React from 'react';
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const BackButton = () => {
    const router = useRouter()
    return (
        <>
            <Button
                type="button"
                className="mb-3"
                onClick={() => router.back()}
            >
                <Icons.moveLeft className="mr-3"/>
                Back
            </Button>
        </>
    );
};

export default BackButton;