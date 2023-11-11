import React from 'react';
import {formatDate} from "@/lib/utils";
import {Timestamp} from "firebase/firestore";

export default function IndexPage() {
    return (
        <div className="container grid items-center gap-2 pb-8 pt-6 md:py-10">
            <h2 className="text-base font-semibold leading-7">New Message 1</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci at atque, autem corporis
                distinctio, enim fugit illum, impedit in incidunt laboriosam natus rerum sequi voluptas!
            </p>
            <p>{formatDate(Timestamp.now())}</p>
        </div>
    );
};
