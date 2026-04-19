import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaFileCirclePlus,
  FaRegFolderOpen,
  FaPenNib,
  FaCircleQuestion,
  FaXmark,
} from "react-icons/fa6";
import LocalBadge from "../common/LocalBadge";
import LongTutorial from "./LongTutorial";

export default function TopBar() {
  const location = useLocation();
  const isEditor = location.pathname.includes("/editor/");
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md md:rounded-2xl bg-slate-900 text-white shadow-sm">
                <FaPenNib className=" text-xs md:text-sm" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to="/pages/tools/drafting"
                    className="truncate text-base md:text-xl font-bold md:font-extrabold  text-slate-900"
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

            <button
              type="button"
              data-drafting-tutorial-trigger="true"
              onClick={() => setShowTutorial(true)}
              className="inline-flex items-center gap-2 rounded-md md:rounded-xl border border-slate-300 bg-white px-2 py-2 md:px-3.5 md:py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <FaCircleQuestion className="text-sm" />
              <span className="hidden sm:inline">Learn to use</span>
            </button>

            <Link
              to="/pages/tools/drafting/drafts"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-2 py-2 md:px-3.5 md:py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              <FaRegFolderOpen className="text-sm" />
              <span className="hidden sm:inline">Open Drafts</span>
            </Link>
          </div>
        </div>
      </header>

      {showTutorial ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-slate-900">
                  Learn to use Drafting Studio
                </h2>
                <p className="mt-1 text-xs md:text-sm text-slate-500">
                  A quick guide to help you get comfortable with the workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                aria-label="Close tutorial"
              >
                <FaXmark />
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <LongTutorial />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
