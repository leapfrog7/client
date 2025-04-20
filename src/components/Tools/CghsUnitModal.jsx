import PropTypes from "prop-types";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  //   FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt,
  FaNotesMedical,
} from "react-icons/fa";

const CghsUnitModal = ({ isOpen, unit, onClose }) => {
  if (!isOpen || !unit) return null;

  const {
    name,
    accreditation,
    address,
    contact,
    empanelledFor,
    cghsCode,
    validity,
    status,
    notes,
    googleData,
  } = unit;

  const formatAddress = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++)
      stars.push(<AiFillStar key={`full-${i}`} className="text-yellow-500" />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(
        <AiOutlineStar key={`empty-${i}`} className="text-gray-300" />
      );
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-10 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          🏥 {name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          {/* Address */}
          {formatAddress && (
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-red-500 mt-1" />
              <span>{formatAddress}</span>
            </div>
          )}

          {/* Accreditation */}
          {accreditation && (
            <div className="flex items-start gap-2">
              <FaShieldAlt className="text-blue-500 mt-1" />
              <span>
                <strong>Accreditation:</strong> {accreditation}
              </span>
            </div>
          )}

          {/* CGHS Code */}
          {cghsCode && (
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">🆔</span>
              <span>
                <strong>CGHS Code:</strong> {cghsCode}
              </span>
            </div>
          )}

          {/* Status */}
          {status && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-bold">📌</span>
              <span>
                <strong>Status:</strong> {status}
              </span>
            </div>
          )}

          {/* Validity */}
          {(validity?.from || validity?.to) && (
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">📅</span>
              <span>
                <strong>Validity:</strong>{" "}
                {validity.from
                  ? new Date(validity.from).toLocaleDateString()
                  : "—"}{" "}
                to{" "}
                {validity.to ? new Date(validity.to).toLocaleDateString() : "—"}
              </span>
            </div>
          )}

          {/* Contact Phone Numbers */}
          {(contact?.phone || googleData?.formattedPhoneNumber) && (
            <div className="md:col-span-2">
              <p className="flex items-center gap-2 font-semibold">
                {/* <FaPhone className="text-green-500" /> Contact Numbers: */}
                📞 Contact Details
              </p>
              <ul className="ml-6 list-disc mt-1">
                {contact.phone && <li>☎️ Provided by CGHS: {contact.phone}</li>}
                {googleData?.formattedPhoneNumber && (
                  <li>
                    📍 Listed on Google: {googleData.formattedPhoneNumber}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Email */}
          {contact?.email && (
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-orange-500 mt-1" />
              <span>{contact.email}</span>
            </div>
          )}

          {/* Website */}
          {(contact?.website || googleData?.website) && (
            <div className="flex items-start gap-2">
              <FaGlobe className="text-purple-500 mt-1" />
              <span>
                <strong>Website:</strong>{" "}
                <a
                  href={contact?.website || googleData?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit
                </a>
              </span>
            </div>
          )}

          {/* Google Rating */}
          {googleData?.rating && (
            <div className="md:col-span-2 mt-2">
              <p className="flex items-center gap-2">
                ⭐ Google Rating:
                {renderStars(googleData.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {googleData.rating} ({googleData.userRatingsTotal || 0}{" "}
                  reviews)
                </span>
              </p>
            </div>
          )}

          {/* Empanelled For */}
          {empanelledFor?.length > 0 && (
            <div className="md:col-span-2 mt-2">
              <p className="flex items-center gap-2 font-semibold">
                <FaNotesMedical className="text-teal-500" /> Empanelled For:
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {empanelledFor.map((item, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg text-xs md:text-sm shadow-sm flex items-center justify-center"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opening Hours */}
          {googleData?.openingHours?.length > 0 && (
            <div className="md:col-span-2 mt-4">
              <p className="font-semibold text-sm mb-2">🕒 Opening Hours</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                {googleData.openingHours.map((line, i) => {
                  const [day, ...rest] = line.split(":");
                  const time = rest.join(":").trim();

                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 shadow-sm"
                    >
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-600 text-xs md:text-sm">
                        {time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div className="md:col-span-2 mt-4">
              <p className="font-semibold text-lg mb-2">📝 Notes</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm text-gray-800 text-sm leading-relaxed">
                {notes ? (
                  notes
                ) : (
                  <span className="italic text-gray-500">
                    No notes available.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-700 text-white rounded hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

CghsUnitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  unit: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default CghsUnitModal;
