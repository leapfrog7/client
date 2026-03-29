import PropTypes from "prop-types";
import TopBar from "./TopBar";
import SideNav from "./SideNav";
import StatusBar from "./StatusBar";

DraftingLayout.propTypes = {
  children: PropTypes.node.isRequired,
  statusLabel: PropTypes.string,
  statusUpdatedAt: PropTypes.string,
};

export default function DraftingLayout({
  children,
  statusLabel,
  statusUpdatedAt,
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />

      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SideNav />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="min-w-0">{children}</section>
      </main>

      <StatusBar label={statusLabel} updatedAt={statusUpdatedAt} />
    </div>
  );
}
