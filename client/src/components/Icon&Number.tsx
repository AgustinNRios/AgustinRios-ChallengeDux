import Image from "next/image";

interface Props {
    src: string;
    number: string | number;
}

export default function IconAndNumber ({src, number}: Props) {
    return (
        <div className="flex flex-row gap-1 scale-75 sm:scale-100">
            <Image
                src={src}
                alt="icono"
                width={20}
                height={20}
            />
            <p className="text-gray-500 text-sm">{number}</p>
        </div>
    )
}
