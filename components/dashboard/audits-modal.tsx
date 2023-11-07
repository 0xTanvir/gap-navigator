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
import {Button, buttonVariants} from "@/components/ui/button";
import * as z from "zod";
import {auditSchema} from "@/lib/validations/audits";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/lib/utils";
import {collection, addDoc} from "firebase/firestore";
import {toast} from "@/components/ui/use-toast";
import {db} from "@/firebase";

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

type FormData = z.infer<typeof auditSchema>

export function AuditsModal({open, setOpen, title, auditData, children}: ModalProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        reset
    } = useForm<FormData>({
        resolver: zodResolver(auditSchema),
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        console.log(data)
        try {
            const  docRef = await addDoc(collection(db, 'audits'),data)
            toast({
                title:'Audits create successfully'
            })
            reset();
            setOpen(false)
            setIsLoading(false)
        } catch (error) {
            console.error('Error saving form data:', error);
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <div>
                        <Label htmlFor="audits_name" className="block text-sm font-medium leading-6">
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
                                disabled={isLoading}
                                defaultValue={auditData ? auditData?.name : ''}
                                {...register("audits_name")}
                            />
                            {errors?.audits_name && (
                                <p className="px-1 mt-1.5 text-xs">
                                    {errors.audits_name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="audits_type"
                            className="block text-sm font-medium leading-6">
                            Audits Type
                        </Label>
                        <div className="mt-2">
                            <Select
                                defaultValue={auditData && auditData?.type}
                                autoComplete="off"
                                {...register('audits_type')}
                                onValueChange={(value) => {
                                    // @ts-ignore
                                    setValue('audits_type', value, {shouldValidate: true})
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Please select a audits"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(AuditsType).map((type) => (
                                        <SelectItem key={type} value={type.toLowerCase()}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>


                            {errors.audits_type && (
                                <p className="px-1 mt-1.5 text-xs text-red-600">
                                    {errors.audits_type.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset()
                                setOpen(false)
                            }}
                            className="mr-3"
                        >
                            Cancel
                        </Button>

                        <button
                            className={cn(buttonVariants(), "flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm")}
                            disabled={isLoading}>
                            {auditData ? 'Update' : 'Save'}
                        </button>


                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
};

AuditsModal.Button = DialogTrigger;