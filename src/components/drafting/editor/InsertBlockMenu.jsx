import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { TEMPLATE_TYPE_LABELS } from "../features/constants/templateTypes";

InsertBlockMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  insertableBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      zone: PropTypes.string,
    }),
  ).isRequired,
  onAddBlock: PropTypes.func.isRequired,
  draftType: PropTypes.string,
};

const FRIENDLY_LABELS = {
  subject_block: "Subject",
  body_paragraph: "Body Paragraph",
  body_table: "Table",
  intro_phrase_block: "Body Text",
  salutation_block: "Salutation",
  to_block: "To",
  copy_to_block: "Copy To",
  signoff_block: "Closing Line",
  signature_block: "Signatory Name",
  designation_contact_block: "Signatory Details",
  enclosure_block: "Enclosure",
  endorsement_block: "Endorsement",
  communication_label: "Form of Communication",
  document_number: "Document Number",
  do_number: "D.O. Number",
  government_identity: "Government Identity",
  department_identity: "Department Identity",
  place_date_line: "Place and Date",
  contact_line: "Contact Line",
  recipient_identity_block: "Recipient Details",
  press_forwarding_block: "Press Forwarding",
  gazette_forwarding_block: "Gazette Forwarding",
  embargo_note: "Embargo Note",
  id_note_footer: "I.D. Note Footer",
  sender_name_block: "Sender Name",
  sender_designation_block: "Sender Designation",
  complimentary_close: "Complimentary Close",
  bulleted_list_block: "List",
  quoted_order_block: "Quoted Order",
};

const TYPE_PRIORITIES = {
  office_memorandum: [
    "subject_block",
    "body_paragraph",
    "body_table",
    "to_block",
    "enclosure_block",
    "copy_to_block",
    "signature_block",
    "designation_contact_block",
  ],
  office_order: [
    "body_paragraph",
    "body_table",
    "copy_to_block",
    "enclosure_block",
    "subject_block",
    "signature_block",
    "designation_contact_block",
  ],
  letter: [
    "to_block",
    "subject_block",
    "salutation_block",
    "body_paragraph",
    "body_table",
    "signoff_block",
    "signature_block",
    "designation_contact_block",
    "copy_to_block",
    "enclosure_block",
  ],
  do_letter: [
    "salutation_block",
    "body_paragraph",
    "body_table",
    "complimentary_close",
    "recipient_identity_block",
    "contact_line",
    "signature_block",
  ],
  note: [
    "subject_block",
    "body_paragraph",
    "body_table",
    "to_block",
    "copy_to_block",
    "enclosure_block",
    "id_note_footer",
  ],
  notification: [
    "body_paragraph",
    "body_table",
    "subject_block",
    "copy_to_block",
    "enclosure_block",
    "gazette_forwarding_block",
    "signature_block",
    "designation_contact_block",
  ],
  blank: [
    "body_paragraph",
    "body_table",
    "subject_block",
    "to_block",
    "copy_to_block",
    "salutation_block",
    "signoff_block",
    "signature_block",
    "designation_contact_block",
  ],
};

const TYPE_ADVANCED_ALLOWLIST = {
  office_memorandum: [
    "subject_block",
    "body_paragraph",
    "body_table",
    "to_block",
    "copy_to_block",
    "enclosure_block",
    "endorsement_block",
    "signature_block",
    "designation_contact_block",
  ],
  office_order: [
    "body_paragraph",
    "body_table",
    "copy_to_block",
    "enclosure_block",
    "endorsement_block",
    "signature_block",
    "designation_contact_block",
    "subject_block",
  ],
  letter: [
    "to_block",
    "subject_block",
    "salutation_block",
    "body_paragraph",
    "body_table",
    "signoff_block",
    "signature_block",
    "designation_contact_block",
    "copy_to_block",
    "enclosure_block",
    "endorsement_block",
  ],
  do_letter: [
    "salutation_block",
    "body_paragraph",
    "body_table",
    "complimentary_close",
    "recipient_identity_block",
    "contact_line",
    "signature_block",
    "sender_name_block",
    "sender_designation_block",
  ],
  note: [
    "subject_block",
    "body_paragraph",
    "body_table",
    "to_block",
    "copy_to_block",
    "id_note_footer",
    "enclosure_block",
    "endorsement_block",
    "signature_block",
    "designation_contact_block",
  ],
  notification: [
    "body_paragraph",
    "body_table",
    "subject_block",
    "copy_to_block",
    "enclosure_block",
    "gazette_forwarding_block",
    "endorsement_block",
    "signature_block",
    "designation_contact_block",
    "press_forwarding_block",
    "embargo_note",
  ],
  blank: null,
};

const DEFAULT_PRIORITY = [
  "body_paragraph",
  "body_table",
  "subject_block",
  "to_block",
  "copy_to_block",
  "salutation_block",
  "signoff_block",
  "signature_block",
  "designation_contact_block",
  "enclosure_block",
];

function normalizeBlocks(insertableBlocks) {
  return insertableBlocks.map((item) => ({
    ...item,
    displayLabel: FRIENDLY_LABELS[item.type] || item.label,
  }));
}

export default function InsertBlockMenu({
  open,
  onClose,
  insertableBlocks,
  onAddBlock,
  draftType = "",
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { commonBlocks, advancedBlocks } = useMemo(() => {
    const normalized = normalizeBlocks(insertableBlocks);
    const priority = TYPE_PRIORITIES[draftType] || DEFAULT_PRIORITY;
    const allowlist = TYPE_ADVANCED_ALLOWLIST[draftType] || null;

    const filtered = allowlist
      ? normalized.filter((item) => allowlist.includes(item.type))
      : normalized;

    const common = [];
    const advanced = [];

    filtered.forEach((item) => {
      if (priority.includes(item.type)) {
        common.push(item);
      } else {
        advanced.push(item);
      }
    });

    common.sort((a, b) => priority.indexOf(a.type) - priority.indexOf(b.type));

    advanced.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));

    return {
      commonBlocks: common,
      advancedBlocks: advanced,
    };
  }, [insertableBlocks, draftType]);

  if (!open) return null;

  const handleAdd = (type) => {
    onAddBlock(type);
    onClose();
  };

  const draftTypeLabel = TEMPLATE_TYPE_LABELS[draftType] || "this draft";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/35 p-4 sm:items-center">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Add to draft
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Showing the most useful items for {draftTypeLabel}.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">
              Common items
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {commonBlocks.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleAdd(item.type)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="text-sm font-medium text-slate-900">
                    {item.displayLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {advancedBlocks.length > 0 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {showAdvanced ? "Hide more options" : "Show more options"}
              </button>

              {showAdvanced && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-800">
                    More options
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {advancedBlocks.map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => handleAdd(item.type)}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                      >
                        <div className="text-sm font-medium text-slate-900">
                          {item.displayLabel}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <p className="text-xs text-slate-500">
            Start with the common items. Use more options only when needed.
          </p>
        </div>
      </div>
    </div>
  );
}
