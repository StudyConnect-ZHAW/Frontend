import Logo from '@/components/Logo';

type Props = {
    /** Optional title shown in the header. */
    title?: string;

    /** Whether to show the logo. Defaults to true. */
    showLogo?: boolean;
};

/**
 * Component that represents the top header for a page, including the optional title and the logo.
 *
 * @param title The title of the page to be shown in the header. Optional.
 * @param showLogo Whether to display the logo in the header. Defaults to true.
 */
export default function PageHeader({ title, showLogo = true }: Props) {
    return (
        <header className="flex items-center justify-between mb-2">
            {title && <h1 className="text-4xl font-bold text-primary">{title}</h1>}
            {showLogo && <Logo />}
        </header>
    );
}