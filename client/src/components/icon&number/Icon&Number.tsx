import Image from "next/image";
import styles from "./IconAndNumber.module.css";

interface Props {
    src: string;
    number: string | number;
}

export default function IconAndNumber ({src, number}: Props) {
    return (
        <div className={styles.container}>
            <Image
                src={src}
                alt="icono"
                width={20}
                height={20}
            />
            <p className={styles.text}>{number}</p>
        </div>
    )
}
