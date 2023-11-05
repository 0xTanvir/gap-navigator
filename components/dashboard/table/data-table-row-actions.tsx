import React, {useState} from 'react';
import {AuditsModal} from "@/components/dashboard/audits-modal";
import {Icons} from "@/components/icons";
import AuditsDeleteModal from "@/components/dashboard/audits-delete-modal";

interface AuditData {
    name: string
    type: string
}
interface DataTableRowActionsProps {
    audit: AuditData
    name:string
}

const DataTableRowActions = ({audit, name}: DataTableRowActionsProps) => {
    const [editOpenModal, setEditOpenModal] = useState<boolean>(false)
    const [state, setState] = useState<{ delete: boolean; confirmDelete: boolean }>({
        delete: false,
        confirmDelete: false,
    });

    const handleCancelClick = () => {
        setState({...state, delete: false, confirmDelete: false});
    };

    const handleSaveClick = () => {
        setState({...state, delete: false, confirmDelete: true});
    };
    return (
        <div className="flex justify-end items-center">
            <AuditsModal
                open={editOpenModal}
                setOpen={setEditOpenModal}
                title={"Edit Audits"}
                auditData={audit}
            >
                <Icons.edit
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => {
                        setEditOpenModal(true)
                    }}
                />
            </AuditsModal>

            <AuditsDeleteModal
                open={state.delete}
                onClose={handleCancelClick}
                title={`Are you sure want to delete ${name}?`}
                handleSaveClick={handleSaveClick}
            >
                <Icons.delete
                    className="cursor-pointer ml-3 text-muted-foreground"
                    onClick={() => setState({...state, delete: true, confirmDelete: false})}
                />
            </AuditsDeleteModal>
        </div>
    );
};

export default DataTableRowActions;