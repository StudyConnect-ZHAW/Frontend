'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import GroupCard, { Group } from "@/components/GroupCard";
import SearchField from "@/components/SearchField";
import SortField from "@/components/SortField";
import { FiPlus, FiX } from "react-icons/fi";

// -----------------------------------------------------------------------------
//   💾  Dummy‑Seed‑Daten  –  später einfach durch API‑Calls oder Server‑Actions
// -----------------------------------------------------------------------------
const initialGroups: Group[] = [
  {
    id: "1",
    name: "Frontend Wizards",
    description: "Discuss React, Vue & design systems.",
    members: 42,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "2",
    name: "AI Enthusiasts",
    description: "All about GPT‑4‑o and beyond.",
    members: 137,
    createdAt: new Date("2024-04-01"),
  },
];
// -----------------------------------------------------------------------------

type SortOption = "newest" | "oldest" | "mostLiked" | "alphabet";

export default function GroupsPage() {
  const { t } = useTranslation(['groups', 'common']);

  // ────────────────────────────────────────────────────────────────────────────
  // THEME
  // ────────────────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const borderAndShadowColor = theme === "dark" ? "#ec3349" : "#FDBA15";

  // ────────────────────────────────────────────────────────────────────────────
  // STATE
  // ────────────────────────────────────────────────────────────────────────────
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>(initialGroups);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ────────────────────────────────────────────────────────────────────────────
  const filteredMyGroups = useMemo(() => {
    const text = search.toLowerCase();

    const bySearch = myGroups.filter((g) => g.name.toLowerCase().includes(text));

    return bySearch.sort((a, b) => {
      switch (sort) {
        case "alphabet":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "mostLiked":
          return b.members - a.members; // ⚠️  ersetze „members“ durch echte Likes, wenn vorhanden
        default:
          return 0;
      }
    });
  }, [search, sort, myGroups]);

  // ────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ────────────────────────────────────────────────────────────────────────────
  const handleJoin = useCallback(
    (id: string) => {
      const grp = allGroups.find((g) => g.id === id);
      if (!grp) return;
      setMyGroups((prev) => [...prev, grp]);
    },
    [allGroups]
  );

  const handleLeave = useCallback((id: string) => {
    setMyGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleCreate = useCallback((name: string, desc: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      description: desc,
      members: 1,
      createdAt: new Date(),
    };
    setAllGroups((prev) => [...prev, newGroup]);
    setMyGroups((prev) => [...prev, newGroup]);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader title={t('title')} />

      {/* ————————————————— Action‑Bar ————————————————— */}
      <div className="flex flex-wrap gap-4 mb-6 px-4 sm:px-8">
        <button
          onClick={() => setShowJoinModal(true)}
          className="px-4 py-2 rounded border-2 font-semibold transition hover:shadow"
          style={{ borderColor: borderAndShadowColor }}
        >
          Join Group
        </button>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded border-2 font-semibold transition hover:shadow"
          style={{ borderColor: borderAndShadowColor }}
        >
          Create new Group
        </button>

        <div className="flex-grow" />

        {/* Sortierung */}
        <div className="w-40 min-w-[8rem]">
          <SortField value={sort} onChange={(val) => setSort(val as SortOption)} />
        </div>
      </div>

      {/* Suche */}
      <div className="mb-8 px-4 sm:px-8 max-w-sm">
        <SearchField
          placeholder="Search my groups…"
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* My Groups Grid */}
      <div className="px-4 sm:px-8">
        {filteredMyGroups.length === 0 ? (
          <p className="text-gray-600">You haven’t joined any groups yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {filteredMyGroups.map((g) => (
              <GroupCard
                key={g.id}
                group={g}
                joined
                onJoin={() => { }}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Join‑Modal */}
      {showJoinModal && (
        <Modal onClose={() => setShowJoinModal(false)}>
          <h3 className="text-lg font-semibold mb-4">Available Groups</h3>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {allGroups.map((g) => {
              const joined = myGroups.some((mg) => mg.id === g.id);
              return (
                <GroupCard
                  key={g.id}
                  group={g}
                  joined={joined}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                />
              );
            })}
          </div>
        </Modal>
      )}

      {/* Create‑Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// GENERIC MODAL WRAPPER
// ═════════════════════════════════════════════════════════════════════════════
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--sidebar-bg)] rounded-[15px] p-6 max-h-[80vh] overflow-y-auto w-full max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl hover:opacity-70"
        >
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CREATE GROUP MODAL
// ═════════════════════════════════════════════════════════════════════════════
function CreateGroupModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, desc: string) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    onCreate(name.trim(), desc.trim());
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Create new Group</h3>
      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          disabled={name.trim() === ""}
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#ec3349] text-white font-semibold disabled:opacity-50"
        >
          <FiPlus /> Create
        </button>
      </div>
    </Modal>
  );
}