import React, { useEffect, useState } from "react";
import {
  fetchAuditsWithCount,
  fetchPaginatedData,
} from "@/lib/firestore/audit";
import { Audits } from "@/types/dto";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import AuditPagination from "@/components/admin/audit-pagination";
import { toast } from "sonner";

interface AdminAuditsProps {
  userId: string;
}

const AdminAudits = ({ userId }: AdminAuditsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [audit, setAudit] = useState<Audits | []>([]);
  const [pageAction, setPageAction] = useState("NEXT");
  const [searchName] = useState("");
  const [page, setPage] = useState(1);
  const [totalAuditCount, setTotalAuditCount] = useState(0);
  const [afterThis, setAfterThis] = useState(null);
  const [beforeThis, setBeforeThis] = useState(null);
  const PAGE_SIZE: number = 4;
  const fetchData = async () => {
    const entityObject = {
      collection: "",
      records_limit: PAGE_SIZE,
      pageAction: pageAction,
      page: page,
      fields: {
        // createdAt:true,
      },
      orderByField: "createdAt",
      orderByOrder: "asc",
      last_index: afterThis,
      first_index: beforeThis,
      whereFields: [
        {
          name: "name",
          value: searchName,
        },
      ],
    };
    try {
      const records = await fetchPaginatedData(entityObject);
      if (records?.length > 0) {
        const last_index = records.length - 1;
        const first_index = 0;
        // @ts-ignore
        setAfterThis(records[last_index][entityObject.orderByField]);
        // @ts-ignore
        setBeforeThis(records[first_index][entityObject.orderByField]);
        setAudit(records);
      } else {
        toast.warning("No data found");
      }
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    setPageAction("NEXT");
  };
  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
    setPageAction("PREVIOUS");
  };

  async function auditsCount() {
    const { totalCount } = await fetchAuditsWithCount(searchName);
    if (totalCount) {
      setTotalAuditCount(totalCount);
    }
  }

  useEffect(() => {
    auditsCount();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [page]);

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          heading="Audits"
          text="Manage audits."
        ></DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          {Array.from(Array(PAGE_SIZE)).map((_, index) => (
            <AuditItem.Skeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader heading="Audits" text="Manage audits."></DashboardHeader>

      <div>
        {audit?.length ? (
          <>
            <div className="divide-y divide-border rounded-md border">
              {audit.map((audit) => (
                <AuditItem
                  key={audit.uid}
                  userId={userId}
                  audit={audit}
                  setAudits={setAudit}
                />
              ))}
            </div>
            <AuditPagination
              totalAuditCount={totalAuditCount}
              page={page}
              setPage={setPage}
              PAGE_SIZE={PAGE_SIZE}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="audit" />
            <EmptyPlaceholder.Title>No audits</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any audits yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </>
  );
};

export default AdminAudits;
