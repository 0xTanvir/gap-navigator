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
    FileSearch,
    LifeBuoy,
    LogOut,
    HelpingHand,
    User2,
    Users,
    Menu,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus, Pencil, Trash2, MoreVertical, MoveLeft
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
    fileSearch: FileSearch,
    lifeBuoy: LifeBuoy,
    logOut: LogOut,
    helpingHand: HelpingHand,
    user2: User2,
    users: Users,
    menu: Menu,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    spinner: Loader2,
    plus: Plus,
    edit: Pencil,
    delete: Trash2,
    moreVertical: MoreVertical,
    moveLeft: MoveLeft,
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
}