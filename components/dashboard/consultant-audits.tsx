import React, { useState, useEffect, Suspense, useCallback } from "react";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType, Audits } from "@/types/dto";
import { toast } from "sonner";
import useAudits from "./AuditsContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auditFilterSchema } from "@/lib/validations/audit";
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";

interface ConsultantAuditsProps {
  userId: string;
  userAuditsId: string[];
}

type FormData = z.infer<typeof auditFilterSchema>

export default function ConsultantAudits({
                                           userId,
                                           userAuditsId,
                                         }: ConsultantAuditsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [auditName, setAuditName] = useState<string>("")
  const [auditType, setAuditType] = useState<string>("")
  const {audits, dispatch} = useAudits();
  const [currentAudits, setCurrentAudits] = useState<Audits | []>([]);
  const [currentSliceAudits, setCurrentSliceAudits] = useState<Audits | []>([]);
  const [filterData, setFilterData] = useState(false)

  const params = useSearchParams()
  const searchParams = params.get("auditType")
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(auditFilterSchema),
    defaultValues: {
      auditName: "",
      auditType: searchParams ? searchParams : auditType
    },
  })

  function onSubmit(data: FormData) {
    setFilterData(true)
    if (data.auditName && data.auditType) {
      let filterData = audits.filter(audit => audit.type === data.auditType && audit.name === data.auditName);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    } else if (data.auditName) {
      let filterData = audits.filter(audit => audit.name === data.auditName);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    } else if (data.auditType) {
      setFilterData(true)
      let filterData = audits.filter(audit => audit.type === data.auditType);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    }
  }


  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize
  useEffect(() => {
    if (filterData) {
      setTotalData(currentAudits.length)
      setCurrentSliceAudits(currentAudits.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(audits.length)
      if (searchParams) {
        let x = audits.filter(audit => audit.type === searchParams)
        setCurrentSliceAudits(x.slice(indexOfFirstAudit, indexOfLastAudit))
      } else {
        setCurrentSliceAudits(audits.slice(indexOfFirstAudit, indexOfLastAudit))
      }

    }
  }, [totalData, audits, filterData, currentAudits, indexOfLastAudit, indexOfFirstAudit, searchParams]);

  useEffect(() => {
    async function fetchAudits() {
      try {
        const dbAudits = await getAuditsByIds(userAuditsId);
        dispatch({
          type: AuditActionType.ADD_MULTIPLE_AUDITS,
          payload: dbAudits,
        });
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.", {
          description: "Failed to fetch audits. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAudits();
  }, [userAuditsId]); // Run this effect when the userId changes

  const debounce = (call: any, delay: number) => {
    let timer: any
    return function (...args: any) {
      // @ts-ignore
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        call.apply(context, args)
      }, delay)
    }
  }
  const handleChange = (e: any) => {
    setAuditName(e.target.value)
  }
  const inputDebounce = useCallback(debounce(handleChange, 1000), [])

  useEffect(() => {
    if (auditName && auditType) {
      let filterData = audits.filter(audit => audit.type === auditType && audit.name === auditName);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    } else if (auditName) {
      let filterData = audits.filter(audit => audit.name === auditName);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    } else if (auditType) {
      setFilterData(true)
      let filterData = audits.filter(audit => audit.type === auditType);
      setCurrentAudits(filterData)
      setCurrentPage(1)
    } else if (auditType === "" && auditName === "") {
      setCurrentAudits(audits)
      setCurrentPage(1)
    }
  }, [auditType, auditName]);

  if (isLoading) {
    return (
      <>
        <DashboardHeader heading="Audits" text="Create and manage audits.">
          <AuditCreateButton userId={userId}/>
        </DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
        </div>
      </>
    );
  }

  return (
    <Suspense>
      <DashboardHeader heading="Audits" text="Create and manage audits.">
        <AuditCreateButton userId={userId}/>
      </DashboardHeader>

      <div className="px-1.5">
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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        inputDebounce(e)
                        form.setValue("auditName", e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div>
              <label htmlFor="auditType" className="block sr-only text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <select
                id="auditType"
                className="capitalize flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={auditType}
                placeholder="Select an audit type"
                {...form.register("auditType")}
                onChange={event => {
                  setAuditType(event.target.value)
                  form.setValue("auditType", event.target.value)
                }}
              >
                <option value="">all</option>
                <option value="private">Private</option>
                <option value="exclusive">Exclusive</option>
                <option value="public">Public</option>
              </select>
            </div>

            {(form.getValues("auditType") || form.getValues("auditName")) &&
                <Button
                    variant="destructive"
                    type="reset"
                    onClick={() => {
                      form.reset({
                        auditName: "",
                        auditType: ""
                      })
                      form.setValue("auditType", "")
                      setAuditType("");
                      setAuditName("");
                      setCurrentAudits(audits)
                      setFilterData(false)
                      router.push("/audits")
                    }}
                >
                    <Icons.searchX/>
                </Button>
            }

          </form>

        </Form>
      </div>

      <div>
        {audits?.length ? (
          <>
            {
              currentSliceAudits.length ? (
                  <>
                    <div className="divide-y divide-border rounded-md border">
                      {currentSliceAudits.map((audit) => (
                        <AuditItem key={audit.uid} userId={userId} audit={audit}/>
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
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="audit"/>
            <EmptyPlaceholder.Title>No audits created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any audits yet. Start creating audit.
            </EmptyPlaceholder.Description>
            <AuditCreateButton userId={userId} variant="outline"/>
          </EmptyPlaceholder>
        )}
      </div>
    </Suspense>
  );
}
