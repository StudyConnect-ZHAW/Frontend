/**
 * Component representing the footer displayed at the bottom of the pages.
 */
export default function Footer() {
  return (
    <footer className="w-full text-center text-sm text-secondary p-4">
      © {new Date().getFullYear()} StudyConnect | All Rights Reserved.
    </footer>
  );
}