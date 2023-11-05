import React, {ReactNode} from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface AuditsDeleteModalProps {
    open: boolean;
    onClose: () => void;
    handleSaveClick: () => void;
    title: string;
    children: ReactNode;
}

const AuditsDeleteModal = ({open, onClose, title, handleSaveClick, children}: AuditsDeleteModalProps) => {
    return (
        <AlertDialog open={open}>
            {children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onClose()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => handleSaveClick()}
                    >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>


        </AlertDialog>
    );
};

export default AuditsDeleteModal;