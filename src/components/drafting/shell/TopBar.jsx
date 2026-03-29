import { Link, useLocation } from "react-router-dom";
import { FaFileCirclePlus, FaRegFolderOpen, FaPenNib } from "react-icons/fa6";
import LocalBadge from "../common/LocalBadge";

export default function TopBar() {
  const location = useLocation();
  const isEditor = location.pathname.includes("/editor/");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <FaPenNib className="text-sm" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to="/pages/tools/drafting"
                  className="truncate text-base font-semibold tracking-tight text-slate-900"
                >
                  Drafting Studio
                </Link>
                <LocalBadge />
              </div>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                Structured workspace for routine official communications
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditor ? (
            <Link
              to="/pages/tools/drafting/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <FaFileCirclePlus className="text-sm" />
              <span className="hidden sm:inline">New Draft</span>
            </Link>
          ) : null}

          <Link
            to="/pages/tools/drafting/drafts"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <FaRegFolderOpen className="text-sm" />
            <span className="hidden sm:inline">Open Drafts</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
