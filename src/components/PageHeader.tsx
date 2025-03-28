import Logo from '@/components/Logo';

type PageHeaderProps = {
    title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
    return (
        <header>
            <h1>{title}</h1>
            <Logo />
        </header>
    );
}