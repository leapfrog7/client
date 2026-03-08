import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaBalanceScale,
  FaChartLine,
  FaHospitalSymbol,
  FaBook,
} from "react-icons/fa";
import { GiMedicalDrip } from "react-icons/gi";
import { BsFiletypePdf } from "react-icons/bs";
import { GoTasklist } from "react-icons/go";

const defaultLinks = [
  {
    title: "CGHS Units",
    subtitle: "Search CGHS hospitals and nearby units in Delhi-NCR",
    url: "/pages/public/cghs-units",
    icon: FaHospitalSymbol,
  },
  {
    title: "Find CGHS Rate",
    subtitle: "Check Latest CGHS rates in most convenient manner",
    url: "/pages/public/cghs-rates",
    icon: GiMedicalDrip,
  },
  {
    title: "NPS or UPS",
    subtitle:
      "Compare your retirement options with the most comprehensive tool",
    url: "/pages/public/nps-or-ups",
    icon: FaBalanceScale,
  },
  {
    title: "7th CPC Matrix",
    subtitle: "Seamlessly navigate the full pay matrix with ease",
    url: "/pages/public/7thCPC-paymatrix",
    icon: FaChartLine,
  },

  {
    title: "PDF Tools",
    subtitle: "Merge, split, rotate, compress and convert JPG to PDF",
    url: "/pages/public/pdf-utility",
    icon: BsFiletypePdf,
  },
  {
    title: "Task Manager",
    subtitle:
      "Built for Central Govt. officers for tracking tasks and follow-ups",
    url: "/pages/tools/task-tracker",
    icon: GoTasklist,
  },
  {
    title: "Resources",
    subtitle: "Search important rules and regulations in one place",
    url: "/pages/public/resources",
    icon: FaBook,
  },
];

const QuickLinksCarousel = ({
  title = "Quick and Free Links",
  linksData = defaultLinks,
}) => {
  return (
    <section className="my-3 w-full" aria-labelledby="quick-links-heading">
      <div className="max-w-7xl mx-auto px-0">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-2 md:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left">
              <div>
                <h2
                  id="quick-links-heading"
                  className="text-base md:text-xl lg:text-2xl font-semibold text-gray-800"
                >
                  {title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Useful tools you can start using right away
                </p>
              </div>

              <span className="inline-flex self-center sm:self-auto items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                Free Tools
              </span>
            </div>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-x-auto px-2 py-4">
            <div className="flex gap-4 pb-1">
              {linksData.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    to={link.url}
                    key={link.url}
                    className="min-w-[240px] max-w-[240px] rounded-lg border border-slate-200 bg-white p-2 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-xl">
                        <Icon />
                      </div>

                      <div className="min-w-0 text-left">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {link.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed line-clamp-3">
                          {link.subtitle}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5 md:p-6">
            {linksData.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  to={link.url}
                  key={link.url}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-xl">
                      <Icon />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-800 transition">
                        {link.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

QuickLinksCarousel.propTypes = {
  title: PropTypes.string,
  linksData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      url: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    }),
  ),
};

export default QuickLinksCarousel;
