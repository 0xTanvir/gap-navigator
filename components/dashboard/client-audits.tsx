import React, { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AuditEvaluations } from "@/types/dto";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { toast } from "sonner";
import * as z from "zod";
import { auditFilterSchema } from "@/lib/validations/audit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuditsEvaluationByIds } from "@/lib/firestore/evaluation";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import ClientAuditItem from "@/components/dashboard/client-audit-item";

type FormData = z.infer<typeof auditFilterSchema>
const ClientAudits = () => {
  const [audits, setAudits] = useState<AuditEvaluations[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [auditName, setAuditName] = useState<string>("")
  const [currentAudits, setCurrentAudits] = useState<AuditEvaluations[] | []>([]);
  const [currentSliceAudits, setCurrentSliceAudits] = useState<AuditEvaluations[] | []>([]);
  const [filterData, setFilterData] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);

  const {user} = useAuth();
  const router = useRouter()
  const params = useSearchParams()
  const searchParams = params.get("status")

  const form = useForm<FormData>({
    resolver: zodResolver(auditFilterSchema),
    defaultValues: {
      auditName: ""
    },
  })

  function onSubmit(data: FormData) {
    setFilterData(true)
    if (data.auditName) {
      let filterData = audits.filter(audit => audit.name.toLowerCase().includes(data?.auditName?.toLowerCase() as string));
      setCurrentAudits(filterData)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    if (inputRef?.current?.value === "") {
      setCurrentAudits(audits)
      setFilterData(false)
    }
  }, [inputRef?.current?.value === ""]);

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize
  useEffect(() => {
    if (filterData) {
      setTotalData(currentAudits.length)
      setCurrentSliceAudits(currentAudits.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(audits.length)
      setCurrentSliceAudits(audits.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, audits, filterData, currentAudits, indexOfLastAudit, indexOfFirstAudit]);

  async function fetchAuditsEvaluation() {
    setIsLoading(true)
    try {
      if (user?.invitedAuditsList) {
        let data = await getAuditsEvaluationByIds(user.invitedAuditsList, user.email)
        if (searchParams !== null) {
          if (searchParams === "complete") {
            setAudits(data.filter(audit => audit.isCompleted === true))
          } else if (searchParams === "invited") {
            setAudits(data.filter(audit => audit.isCompleted === "invited"))
          } else if (searchParams === "draft") {
            setAudits(data.filter(audit => audit.isCompleted === false))
          }
        } else {
          setAudits(data)
        }
      }
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAuditsEvaluation();
  }, [user?.invitedAuditsList, searchParams]);

  if (isLoading) {
    return (
      <>
        <DashboardHeader heading="Audits" text="Manage audits."/>
        <div className="divide-border-200 divide-y rounded-md border">
          <ClientAudits.Skeleton/>
          <ClientAudits.Skeleton/>
          <ClientAudits.Skeleton/>
        </div>
      </>
    );
  }

  return (
    <Suspense>
      <div className="flex-1 space-y-4">
        <DashboardHeader heading="Audits" text="Manage audits."/>
        <div className="px-1.5 flex flex-col sm:flex-row  sm:items-end justify-end gap-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row  sm:items-end justify-end gap-3">
              <FormField
                control={form.control}
                name="auditName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Audit Name"
                        {...field}
                        ref={inputRef}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {/*<Button type="submit">*/}
              {/*  Submit*/}
              {/*</Button>*/}
              {form.getValues("auditName") &&
                  <Button
                      variant="destructive"
                      type="reset"
                      onClick={() => {
                        form.reset({
                          auditName: ""
                        })
                        form.setValue("auditType", "")
                        setAuditName("");
                        setCurrentAudits(audits)
                        setFilterData(false)
                      }}
                  >
                      <Icons.searchX/>
                  </Button>
              }

            </form>

          </Form>
          {
            searchParams !== null &&
              <Button
                  onClick={() => {
                    router.push("/audits")
                  }}
              >
                  <Icons.reLoad/>
              </Button>
          }
        </div>
        {currentSliceAudits.length ? (
          <>
            {
              currentSliceAudits.length ? (
                  <>
                    <div className="divide-y divide-border rounded-md border">
                      {currentSliceAudits.map((audit, index) => (
                        <ClientAuditItem key={index} audit={audit}/>
                      ))}
                    </div>

                    <CustomPagination
                      totalPages={Math.ceil(totalData / pageSize)}
                      setCurrentPage={setCurrentPage}
                    />
                  </>
                ) :
                <div className="divide-y divide-border rounded-md border">
                  <div className="text-center font-semibold py-10">No Data Found</div>
                </div>
            }
          </>
        ) : (
          <EmptyPlaceholder className="mt-3">
            <EmptyPlaceholder.Icon name="audit"/>
            <EmptyPlaceholder.Title>No audit found</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any audits yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </Suspense>
  );
};

ClientAudits.Skeleton = function ClientAuditsSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full"/>
      </div>
    </div>
  );
};

export default ClientAudits;
