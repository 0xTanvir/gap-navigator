import React, {ReactNode} from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AuditsType} from "@/config/site";

interface ModalProps {
    open: boolean;
    title: string
    setOpen: (value: boolean) => void;
    data?: object;
    children: ReactNode;
}

export function AuditsModal({open, setOpen, title, data, children}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {JSON.stringify(data)}

                <form className="space-y-3">
                    <div>
                        <Label htmlFor="first_name" className="block text-sm font-medium leading-6">
                            Audits Name
                        </Label>
                        <div className="mt-2">
                            <Input
                                id="audits_name"
                                variant="flat"
                                placeholder="Audits Name"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="audits_name"
                                autoCorrect="off"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="audits_type" className="block text-sm font-medium leading-6">
                            Audits Type
                        </Label>
                        <div className="mt-2">
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Please select a audits"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Object.keys(AuditsType).map((type) => (
                                            <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end pt-2">
                        <button
                            type="button"
                            className="mt-3 mr-5 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                            onClick={() => setOpen(false)}
                        >
                            Submit
                        </button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
};

AuditsModal.Button = DialogTrigger;