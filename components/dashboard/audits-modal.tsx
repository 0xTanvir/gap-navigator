import React, {ReactNode} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {AuditsType} from "@/config/site";
import {Button} from "@/components/ui/button";

interface AuditData {
    name: string;
    type: string
}

interface ModalProps {
    open: boolean;
    title: string
    setOpen: (value: boolean) => void;
    auditData?: AuditData;
    children: ReactNode;
}

export function AuditsModal({open, setOpen, title, auditData, children}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {JSON.stringify(auditData)}

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
                                defaultValue={auditData?.name}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="audits_type" className="block text-sm font-medium leading-6">
                            Audits Type
                        </Label>
                        <div className="mt-2">
                            <Select defaultValue={auditData?.type}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Please select a audits"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Object.keys(AuditsType).map((type) => (
                                            <SelectItem key={type} value={type.toLowerCase()}>
                                                {type}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="mr-3"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                        >
                            {auditData ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
};

AuditsModal.Button = DialogTrigger;