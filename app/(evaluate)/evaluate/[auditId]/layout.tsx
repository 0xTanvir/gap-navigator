"use client";
import { useAuth } from "@/components/auth/auth-provider";
import { useParams, useRouter } from "next/navigation";
import useEvaluation from "../evaluate-context";
import { useEffect, useState } from "react";
import { getAudit } from "@/lib/firestore/audit";
import { Audit, EvaluationActionType, Questions } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { MainNav } from "@/components/nav/main-nav";
import { dashboardConfig } from "@/config/dashboard";
import { Evaluate } from "@/types/dto";
import {
  DocsSidebarNav,
  DocsSidebarNavItems,
  DocsSidebarNavSkeleton,
  childrenSkeleton,
} from "@/app/(evaluate)/evaluate/sidebar-nav";
import { ProfileNav } from "@/components/nav/profile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteFooter } from "@/components/site-footer";
import { SidebarNavItem } from "@/types";
import { getQuestionsById } from "@/lib/firestore/question";
import { getAllEvaluations } from "@/lib/firestore/evaluation";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const { loading, user, isAuthenticated } = useAuth();
  const { auditId } = useParams();
  const { evaluation, dispatch } = useEvaluation();
  const [evaluateLoading, setEvaluateLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvaluation = async (auditId: string) => {
      try {
        const audit = await getAudit(auditId);
        const evaluations = await getAllEvaluations(auditId);
        const questions = await getQuestionsById(auditId);
        const sideBarNav = getSidebarNav(audit, questions);
        let evaluate = {} as Evaluate;
        if (isAuthenticated) {
          // public, private, exclusive
          // use case for audit.type
          switch (audit.type) {
            case "public":
              toast({
                variant: "success",
                description: `you are authenticated and audit is public so you can do it.`,
              });
              break;
            case "private":
              if (user?.role === "consultant") {
                toast({
                  variant: "success",
                  description: `you are authenticated and audit is private so you can do it.`,
                });
              } else {
                toast({
                  variant: "error",
                  description: `You do not have access to this evaluation. please ask your consultant to give you access.`,
                });
                router.push("/");
                return;
              }
              break;
            case "exclusive":
              if (user?.role === "consultant") {
                toast({
                  variant: "success",
                  description: `you are authenticated and audit is exclusive so you can do it.`,
                });
              } else if (user?.role === "client") {
                if (audit.exclusiveList?.includes(user?.uid)) {
                  toast({
                    variant: "success",
                    description: `you are authenticated client and audit is exclusive so you can do it.`,
                  });
                }
                toast({
                  variant: "error",
                  description: `You do not have access to this evaluation.`,
                });
                router.push("/");
                return;
              } else {
                toast({
                  variant: "error",
                  description: `You do not have access to this evaluation.`,
                });
                router.push("/");
                return;
              }
              break;
          }
        } else {
          if (audit.type === "public") {
            // User is unauthenticated but audit is public
            // so we can do it continue and show the popup
            // for first name, last name, and email
            toast({
              variant: "success",
              description: `you are unauthenticated but audit is public so you can do it.`,
            });
          } else {
            toast({
              variant: "error",
              description: `You must be logged in to view this evaluation.`,
            });
            router.push("/login");
            return;
          }
        }

        const currentEvaluation = {
          ...audit,
          questions,
          sideBarNav,
          evaluate,
          evaluations
        };
        dispatch({
          type: EvaluationActionType.ADD_EVALUATION,
          payload: currentEvaluation,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: `Error fetching evaluation: ${error}.`,
        });
      } finally {
        setEvaluateLoading(false);
      }
    };

    if (auditId) {
      fetchEvaluation(auditId as string);
    } else {
      setEvaluateLoading(false);
    }
  }, [auditId]);

  let content: any;
  let childrenContent: any;
  if (evaluateLoading || loading) {
    content = (
      <>
        <DocsSidebarNavSkeleton>
          <DocsSidebarNavItems.Skeleton />
        </DocsSidebarNavSkeleton>

        <DocsSidebarNavSkeleton>
          <DocsSidebarNavItems.Skeleton />
          <DocsSidebarNavItems.Skeleton />
          <DocsSidebarNavItems.Skeleton />
          <DocsSidebarNavItems.Skeleton />
        </DocsSidebarNavSkeleton>
      </>
    );
    childrenContent = childrenSkeleton();
  } else {
    content = <DocsSidebarNav items={evaluation.sideBarNav} />;
    childrenContent = children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={dashboardConfig.mainNav}>
            <DocsSidebarNav items={evaluation.sideBarNav} />
          </MainNav>
          <nav className="flex gap-2">
            <ProfileNav />
            <ModeToggle />
          </nav>
        </div>
      </header>
      <div className="container flex-1">
        <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
            {content}
          </aside>
          {childrenContent}
        </div>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}

export function getSidebarNav(
  audit: Audit,
  questions: Questions
): SidebarNavItem[] {
  const items = questions.map((question) => ({
    title: question.name,
    href: `/evaluate/${audit.uid}/${question.uid}`,
  }));

  return [
    {
      title: "Getting Started",
      items: [
        {
          title: audit.name,
          href: `/evaluate/${audit.uid}`,
        },
      ],
    },
    {
      title: "Questions",
      items: items,
    },
  ];
}