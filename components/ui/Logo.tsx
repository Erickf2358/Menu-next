import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
                <Image
                    fill
                    src="/logo.svg"
                    alt="Logo de Quiosco"
                />
            </div>
        </div>
    )
}