import Logo from '@/components/Logo';

type PageHeaderProps = {
    /** Optional title shown in the header. */
    title?: string;
};

/**
 * Component that represents the top header for a page, including the optional title and the logo.
 *
 * @param title The title of the page to be shown in the header. Optional.
 */
export default function PageHeader({title}: PageHeaderProps) {
    return (
        <header className="flex items-center justify-between">
            {title && <h1 className="text-4xl font-bold text-foreground">{title}</h1>}
            <Logo/>
        </header>
    );
}