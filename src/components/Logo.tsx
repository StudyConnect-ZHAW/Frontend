import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <Link href="/">
            <Image
                src='/logo.png'
                alt='Logo'
                width={128}
                height={128}
                priority
            />
        </Link >
    );
}