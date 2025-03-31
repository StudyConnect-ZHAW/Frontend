import Image from 'next/image';
import Link from 'next/link';

/**
 * Component representing a simple logo in the top right corner of each page.
 */
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