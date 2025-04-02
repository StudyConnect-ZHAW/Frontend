import PageHeader from "@/components/PageHeader";
import WIPSection from "@/components/WIPSection";

export default function ProfilePage() {
    const user = {
        name: "Max Mustermann",
        email: "max@beispiel.de",
        avatarUrl: "https://i.pravatar.cc/150?img=3", // alternativ: "/avatar.png"
        bio: "Softwareentwickler mit Leidenschaft für TypeScript und UI/UX Design."
    };

    return (
        <main className="p-6">
            <PageHeader title="Profile" />

            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-6 border border-gray-200 mt-4">
                <img
                    src={user.avatarUrl}
                    alt="Profilbild"
                    className="w-24 h-24 rounded-full border border-gray-300 object-cover"
                />
                <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="mt-2">{user.bio}</p>
                </div>
            </div>

            <WIPSection />
        </main>
    );
}
