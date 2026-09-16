"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type AdminRouteProps = {
    link:{
        url: string;
        text: string;
        blank: boolean;
    }

}

export default function AdminRoute({link}:AdminRouteProps) {
    const pathname = usePathname()
    const isActive = pathname === link.url

    return (
        <Link
            className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                isActive ? "bg-gray-100 text-gray-900" : ""
            }`}
            href={link.url}
            target={link.blank ? "_blank" : undefined}
        >
            {link.text}
        </Link>
    )
}
