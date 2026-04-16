export default function DraftingStudioTutorial() {
  const sections = [
    {
      title: "What is the Drafting Studio?",
      content: (
        <>
          <p>
            The Drafting Studio is designed to reduce the effort involved in
            preparing official communications. In government drafting, a large
            part of the work is not just writing the content, but also taking
            care of formatting, alignment, spacing, signatory details, headers,
            and the structure prescribed in the Central Secretariat Manual of
            Office Procedure (CSMOP).
          </p>
          <p className="mt-3">
            The purpose of the Drafting Studio is to remove this formatting
            overhead so that users can focus on what matters most: the substance
            of the communication.
          </p>
        </>
      ),
    },
    {
      title: "Why was it built?",
      content: (
        <>
          <p>
            In routine office work, drafting often takes more time than it
            should because users have to repeatedly manage the correct placement
            of document number, department and office identity, place and date
            line, form of communication, addressee details, signatory details,
            and paragraph alignment.
          </p>
          <p className="mt-3">
            All of these are important, but they are mechanical tasks. The
            Drafting Studio is built to handle these routine requirements
            automatically.
          </p>
        </>
      ),
    },
    {
      title: "How the Drafting Studio works",
      content: (
        <>
          <p>
            The drafting process has been broken down into separate blocks,
            broadly in line with the structure followed in CSMOP-based
            communication formats.
          </p>
          <p className="mt-3">
            These blocks represent the common parts of an official
            communication, such as:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>Document Number Block</li>
            <li>Department Identity Block</li>
            <li>Place and Date Block</li>
            <li>Type of Communication Block</li>
            <li>Subject Block</li>
            <li>Body Block</li>
            <li>Signatory Details Block</li>
            <li>Addressee Block</li>
            <li>Copy To / Enclosure blocks, wherever required</li>
          </ul>

          <p className="mt-4">
            This block-based structure makes drafting easier because each part
            of the communication is already placed where it is supposed to
            appear. Users do not have to manually format each element every
            time.
          </p>
        </>
      ),
    },
    {
      title: "Office Profile",
      content: (
        <>
          <p>
            The Office Profile stores the basic information that remains common
            across documents, such as the name of Ministry, Department or
            Office, Hindi version of office identity where required, place, and
            signatory details.
          </p>
          <p className="mt-3">
            Once this profile is set, these details can auto-populate in future
            drafts. This saves time and ensures consistency.
          </p>
        </>
      ),
    },
    {
      title: "Signatory Setup",
      content: (
        <>
          <p>
            Users can save multiple signatories in advance. This is especially
            useful in offices where drafts may be issued under different
            officers.
          </p>
          <p className="mt-3">
            Instead of typing the name, designation, and related details
            repeatedly, the user can simply choose the required signatory from
            the saved list.
          </p>
        </>
      ),
    },
    {
      title: "Document Profile and Preferences",
      content: (
        <>
          <p>
            Each document can have its own formatting preferences, such as font
            family, font size, paragraph spacing, line spacing, and page
            margins.
          </p>
          <p className="mt-3">
            Users can also save default preferences so that every new draft
            begins in a familiar format. Once the profile and preferences are
            configured, the user does not need to repeatedly adjust the same
            settings in every document.
          </p>
        </>
      ),
    },
    {
      title: "Main benefit",
      content: (
        <>
          <p>
            Once the profiles and preferences are set, the user no longer needs
            to worry about the mechanics of formatting the document.
          </p>
          <p className="mt-3">The Studio already takes care of:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>alignment of blocks</li>
            <li>structure of the communication</li>
            <li>recurring office details</li>
            <li>signatory details</li>
            <li>page setup preferences</li>
          </ul>

          <p className="mt-4">
            As a result, the user can concentrate more fully on drafting the
            actual content.
          </p>
        </>
      ),
    },
    {
      title: "Preview and output",
      content: (
        <>
          <p>
            The Preview option helps users see how the communication is likely
            to appear in a Word-style printable format.
          </p>
          <p className="mt-3">
            This is useful for checking structure, spacing between blocks,
            placement of signatory details, and the overall visual appearance
            before final download.
          </p>
        </>
      ),
    },
    {
      title: "Privacy and data security",
      content: (
        <>
          <p>
            One of the most important design features of the Drafting Studio is
            privacy. Official communications can often be sensitive in nature.
            Keeping this in mind, the Drafting Studio is designed to function
            completely on the client side.
          </p>

          <p className="mt-3">This means:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>your draft content is not sent to our servers</li>
            <li>your profile data is not processed on the server</li>
            <li>the tool works within your browser itself</li>
            <li>saved profiles and settings remain on your own system</li>
          </ul>

          <p className="mt-4">
            Users can also export and import their profiles and settings, which
            makes it easier to move to another device when needed.
          </p>
        </>
      ),
    },
    {
      title: "A practical limitation",
      content: (
        <>
          <p>
            Because the tool is designed to work fully on the client side, there
            are certain technical limitations in browser-based copying and
            printing.
          </p>
          <p className="mt-3">
            In some cases, when using direct copy-text or browser print options,
            a part of the formatting may not be preserved exactly as intended.
            For this reason, the recommended approach is to use the{" "}
            <span className="font-semibold">Download DOCX</span> option.
          </p>
          <p className="mt-3">
            This allows the document to be downloaded in MS Word format, after
            which the user can print it directly from Word, save it as PDF, or
            make any last-minute edits if required.
          </p>
        </>
      ),
    },
    {
      title: "Drafting from phone",
      content: (
        <>
          <p>
            One of the strongest use cases of the Drafting Studio is that it
            makes official drafting possible even from a mobile phone.
          </p>
          <p className="mt-3">
            Because the formatting is already handled by the system, the user
            does not need to worry about alignment, spacing, or structure on a
            small screen.
          </p>
          <p className="mt-3">
            When combined with the built-in voice-to-text feature available on
            most phones, a user can prepare a draft quickly and conveniently,
            even while away from a desktop.
          </p>
        </>
      ),
    },
    {
      title: "Paragraph Bank",
      content: (
        <>
          <p>
            To make drafting even faster, the Drafting Studio includes a
            Paragraph Bank. It allows users to save text snippets, lines, or
            standard paragraphs that are frequently used in official
            communications.
          </p>
          <p className="mt-3">
            For example, a commonly used line such as{" "}
            <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-800">
              This issues with the approval of the Competent Authority.
            </span>{" "}
            can be saved once and inserted later in a single click.
          </p>
        </>
      ),
    },
    {
      title: "Smart Paragraphs",
      content: (
        <>
          <p>
            Within the Paragraph Bank, there is also a feature called Smart
            Paragraph. This is meant for text that is mostly fixed, but contains
            a few variable details.
          </p>
          <p className="mt-3">
            For example, in a sanction order, most of the text may remain the
            same every time, while only details such as amount, name of payee,
            date, file number, or sanction period may change.
          </p>
          <p className="mt-3">
            In such cases, the user can create a Smart Paragraph using
            placeholders such as{" "}
            <span className="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-slate-800">
              {"{{amount}}"}
            </span>
            . When the paragraph is inserted into the draft, the Studio will
            prompt the user to fill in the required value, and the paragraph
            will be generated instantly with those values inserted.
          </p>
        </>
      ),
    },
    {
      title: "Recommended workflow",
      content: (
        <>
          <p>A simple way to use the Drafting Studio is:</p>

          <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">
            <li>Set up your Office Profile</li>
            <li>Save your common Signatories</li>
            <li>Set your Document Settings and defaults</li>
            <li>Create commonly used entries in the Paragraph Bank</li>
            <li>Start drafting by filling the relevant blocks</li>
            <li>Use Preview to check the document</li>
            <li>
              Download the file as DOCX for final printing or PDF conversion
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "In simple terms",
      content: (
        <>
          <p>The Drafting Studio is meant to help users:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>draft faster</li>
            <li>avoid routine formatting work</li>
            <li>maintain consistency in official communications</li>
            <li>reuse office profiles and signatory details</li>
            <li>insert common paragraphs in one click</li>
            <li>preserve privacy by keeping drafting entirely on the device</li>
            <li>work even from a mobile phone with voice typing support</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          Tutorial
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Drafting Studio
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          The Drafting Studio is built to remove the repetitive burden of
          formatting official communications, so that users can focus on content
          instead of layout, alignment, and structure.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <article
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {section.title}
            </h2>
            <div className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {section.content}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
