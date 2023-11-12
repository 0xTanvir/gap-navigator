import {
    LucideProps,
    BookOpenCheck,
    Moon,
    SunMedium,
    Laptop,
    X,
    User,
    LayoutDashboard,
    CreditCard,
    LifeBuoy,
    LogOut,
    HelpingHand,
    User2,
    Users,
    Menu,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Facebook,
    Twitter,
    Youtube,
    Linkedin,
    Milestone,
    FilePlus2,
    FileQuestion,
    FileText,
    FileBarChart2,
    ArrowRight,
    Plus,
    MoreVertical,
    Trash,
    FileEdit,
    Lock,
    Building,
    Phone,
    Mail,
    UserPlus,
    ScanEye,
    ClipboardCheck,
    Copy,
} from "lucide-react"

export const Icons = {
    logo: BookOpenCheck,
    sun: SunMedium,
    moon: Moon,
    close: X,
    laptop: Laptop,
    user: User,
    layoutDashboard: LayoutDashboard,
    creditCard: CreditCard,
    lifeBuoy: LifeBuoy,
    logOut: LogOut,
    helpingHand: HelpingHand,
    user2: User2,
    users: Users,
    menu: Menu,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    spinner: Loader2,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    milestone: Milestone,
    filePlus: FilePlus2,
    fileQuestion: FileQuestion,
    audit: FileText,
    report: FileBarChart2,
    arrowRight: ArrowRight,
    add: Plus,
    ellipsis: MoreVertical,
    trash: Trash,
    fileEdit: FileEdit,
    lock: Lock,
    building: Building,
    phone: Phone,
    mail: Mail,
    userPlus: UserPlus,
    preview: ScanEye,
    evaluate: ClipboardCheck,
    copy: Copy,
    x: (props: LucideProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 13" {...props}>
            <path
                fill="currentColor"
                d="M7.142 5.502 11.609 0H10.55L6.671 4.777 3.573 0H0l4.685 7.224L0 12.994h1.059l4.096-5.045 3.272 5.044H12L7.141 5.502Zm-1.45 1.785-.475-.719L1.44.844h1.626l3.048 4.62.475.719 3.962 6.004H8.925l-3.233-4.9Z"
            />
        </svg>
    ),
    google: (props: LucideProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
        </svg>
    ),
    google2: (props: LucideProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
            <g>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z">
                </path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z">
                </path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z">
                </path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z">
                </path>
                <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
        </svg>
    ),
}