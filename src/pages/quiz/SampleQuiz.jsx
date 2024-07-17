import { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { TailSpin } from "react-loader-spinner"; // Importing the loading spinner
import { IoReload } from "react-icons/io5";
import { MdPreview } from "react-icons/md";
import { Helmet } from "react-helmet";

const SampleQuizComponent = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); //for loader spinner
  const [showExplanation, setShowExplanation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions.slice(0, 10);
      setQuizData(selectedQuestions);
    } catch (error) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOptionClick = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  const handleNavigation = (direction) => {
    setCurrentQuestionIndex(currentQuestionIndex + direction);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 400); // Simulate server response time
  };

  const toggleExplanation = (index) => {
    setShowExplanation({
      ...showExplanation,
      [index]: !showExplanation[index],
    });
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (quizData.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const calculateScore = () => {
    return quizData.reduce((score, question, index) => {
      return (
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  const score = calculateScore();

  const getScoreClass = (score) => {
    if (score >= 8) {
      return "bg-green-300 text-green-800";
    } else if (score >= 5) {
      return "bg-yellow-300 text-yellow-800";
    } else {
      return "bg-red-300 text-red-800";
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      <Helmet>
        <title>Sample Quiz | UnderSigned</title>
        <meta
          name="description"
          content="Take our Sample Quiz to experience our platform's powerful quiz features. Perfect for LDCE aspirants, our quizzes help you track progress, bookmark important questions, and focus on unattempted questions."
        />
        <link
          rel="canonical"
          href="https://undersigned.netlify.app/pages/quiz/SampleQuiz"
        />
        <meta property="og:title" content="Sample Quiz | UnderSigned" />
        <meta
          property="og:description"
          content="Experience our Sample Quiz and discover our comprehensive tools designed to help you excel in your LDCE exams."
        />
        <meta
          property="og:url"
          content="https://undersigned.netlify.app/pages/quiz/SampleQuiz"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Sample Quiz | UnderSigned" />
        <meta
          name="twitter:description"
          content="Try our Sample Quiz to get a taste of our platform's features. Ideal for LDCE aspirants, our quizzes are designed to help you succeed."
        />
      </Helmet>
      <div className="flex items-center justify-between bg-cyan-100 mt-2 p-2 gap-4 md:gap-8">
        <h1 className="ml-2 text-lg md:text-xl lg:text-2xl text-gray-700 ">
          Sample Quiz*
        </h1>
        <a
          className="text-white bg-pink-600 py-2 px-4 rounded-md font-semibold mr-2 text-sm md:text-base"
          href="/subscribe"
        >
          Click to Subscribe
        </a>
      </div>
      {!isSubmitted ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold mb-2">{`Question ${
              currentQuestionIndex + 1
            }`}</h2>
            <p
              className="text-gray-800 mb-4 font-semibold text-sm md:text-lg"
              style={{ whiteSpace: "pre-line" }}
            >
              {currentQuestion.questionText}
            </p>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`block w-full text-left p-2 mb-2 border rounded-lg text-sm md:text-base ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? "bg-customCyan text-white"
                    : "bg-white text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm md:text-lg">
            <button
              onClick={() => handleNavigation(-1)}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handleNavigation(1)}
              disabled={currentQuestionIndex === quizData.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div>
            <button
              onClick={() => toggleExplanation(currentQuestionIndex)}
              className="my-6 px-4 py-2 bg-yellow-300 text-black rounded mx-auto flex items-center min-w-24 text-sm md:text-base"
            >
              {showExplanation[currentQuestionIndex]
                ? "Hide Answer"
                : "Show Answer"}
              {showExplanation[currentQuestionIndex] ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            {showExplanation[currentQuestionIndex] && (
              <div className="mt-2 text-gray-700 text-sm md:text-base">
                <p style={{ whiteSpace: "pre-line" }}>
                  <span className="text-green-800 font-semibold p-1">
                    {" "}
                    Answer -{" "}
                    <span className="bg-green-100 rounded-sm px-2">
                      {currentQuestion.correctAnswer}
                    </span>
                  </span>
                  <br /> {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          {currentQuestionIndex === quizData.length - 1 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-12 py-2 bg-gradient-to-b from-emerald-600 to-emerald-800 text-white rounded items-center"
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? (
                  <TailSpin color="#fff" height={20} width={20} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p
            className={`text-lg font-bold my-4 p-1 text-center rounded-lg ${getScoreClass(
              score
            )}`}
          >
            Your Score: {calculateScore()} / {quizData.length}
          </p>
          {quizData.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{`Question ${index + 1}: ${
                question.questionText
              }`}</p>
              <p
                className={`text-${
                  selectedAnswers[index] === question.correctAnswer
                    ? "green"
                    : "red"
                }-700 my-2`}
              >
                {`Your Answer: ${selectedAnswers[index]}`}
              </p>
              {selectedAnswers[index] !== question.correctAnswer && (
                <p className="text-green-800 font-semibold">{`Correct Answer: ${question.correctAnswer}`}</p>
              )}
              <button
                onClick={() => toggleExplanation(index)}
                className="mt-4 px-4 py-2 bg-yellow-200 text-black rounded flex items-center"
              >
                {showExplanation[index]
                  ? "Hide Explanation"
                  : "Show Explanation"}
                {showExplanation[index] ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              {showExplanation[index] && (
                <div className="mt-2 text-gray-700">
                  <p>
                    {question.correctAnswer} <br />
                    <br />
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-col items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 gap-4 mx-auto">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 sm:mb-4 flex items-center justify-center"
            >
              <span>Review Again</span> <MdPreview className="ml-2 text-lg" />
            </button>

            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-800 flex items-center justify-center"
            >
              <span>Take Another Quiz</span>{" "}
              <IoReload className="ml-2 text-lg" />
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-yellow-700 my-4 text-sm w-11/12">
        *The database for this sample quiz represents just under 1% of our
        comprehensive MCQ collection. <br />
        <span className="text-yellow-700">Subscribe to get full access.</span>
      </p>
    </div>
  );
};

SampleQuizComponent.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      questionText: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      correctAnswer: PropTypes.string,
      explanation: PropTypes.string,
    })
  ),
};

export default SampleQuizComponent;

const questions = [
  {
    questionText:
      "When a Drawing Officer receives an intimation from the Director, Postal Life Insurance, Kolkata, about a new policy or a Last Pay Certificate for a transferred subscriber, what should be done in the register?",
    options: [
      "Add the subscriber's name to the register without any remarks",
      "Note the particulars of the policy and the name of the transfer office in the remarks column of the register",
      "Send a confirmation letter to the subscriber without updating the register",
      "Notify the D/o Post and update only the subscriber's policy particulars",
    ],
    correctAnswer:
      "Note the particulars of the policy and the name of the transfer office in the remarks column of the register",
    explanation:
      "Rule 305 of GFR outlines the maintenance of a register for recovery of Postal Life Insurance (PLI) premia. Drawing officers must maintain a register in Form (GFR 20) to record PLI policy holders. The register should be up-to-date and organized in the alphabetical order according to surnames. \nRule 305(2)(ii): On receipt of an intimation from the Director, Postal Life Insurance, Kolkata, about the issue of a policy in favour of a subscriber authorizing the Drawing Officer to commence recovery from pay, or on receipt of a Last Pay Certificate in respect of the subscriber transferred from another office, the Drawing Officer should make a note of the particulars of the policy in the register. The name of the office from which the subscriber has been transferred should invariably be noted in the remarks column. Wherever a subscriber is transferred to another office or his policy is discharged, his name should be scored out from the register giving necessary remarks.",
  },
  {
    questionText:
      "A sanction to an advance or a non-refundable part withdrawal from Provident Fund (PF) shall, unless it is specifically renewed, lapse on the expiry of a period of ____________ except in case of withdrawals effected in installments.",
    options: ["1 month", "3 months", "6 months", "12 months"],
    correctAnswer: "3 months",
    explanation:
      "Rule 299- Currency of sanction of Provident Fund advance/withdrawal: \nA sanction to an advance or a non-refundable part withdrawal from Provident Fund shall, unless it is specifically renewed, lapse on the expiry of a period of three months. This will, however, not apply to withdrawals effected in installments. In such cases the sanction accorded for non-refundable withdrawals from Provident Fund will remain valid up to a particular date to be specified by the sanctioning authority in the sanction order itself.",
  },
  {
    questionText:
      "Which of the following statements is/are NOT correct? \n(1) Payments for services rendered or supplies made should ordinarily be released only after the services have been rendered or supplies made.\n (2) Advance payment can be made if demanded by firms against fabrication contracts, turn-key contracts etc. \n(3) Advance payment can be made if demanded by firms holding maintenance contracts for servicing of Air-conditioners, computers, other costly equipment, etc.",
    options: ["1, 2, 3", "1 only", "2 only", "NOTA"],
    correctAnswer: "NOTA",
    explanation:
      "Rule 172 of GFR relates to the Advance payment to supplier and has the following provisions:\n i) Ordinarily, payments for services rendered or supplies made should be released only after the services have been rendered or supplies made. \n ii) However, it may become necessary to make advance payments for example in the following types of cases :- a) Advance payment demanded by firms holding maintenance contracts for servicing of Air-conditioners, computers, other costly equipment, etc. b) Advance payment demanded by firms against fabrication contracts, turn-key contracts etc.",
  },
  {
    questionText:
      "An honorary worker should not be entrusted with work that involves exercise of _________________ as the holder of a civil post or exercise of authority in the name, or on behalf, of Government.",
    options: [
      "Executive Powers",
      "Judicial or Administrative Powers",
      "Both (a) and (b)",
      "Neither (a) nor (b)",
    ],
    correctAnswer: "Both (a) and (b)",
    explanation:
      "The principles to be followed for employing honorary workers in civil posts include using them only in exceptional circumstances, offering the position to those with a reputation for integrity and meritorious service, limiting their role to advisory capacity, paying them a nominal salary of Re.1 per month to bring them within the ambit of government rules, and subjecting them to the Indian Official Secrets Act, 1923. The work to be entrusted to him should not be such as would involve exercise of executive, administrative or judicial powers as the holder of a civil post or exercise of authority in the name, or on behalf, of Government.",
  },
  {
    questionText:
      "Which of the following is expected of government servants in their official dealings with Members of Parliament and State Legislatures?",
    options: [
      "They should promptly acknowledge letters from MPs and MLAs and provide them with requested information.",
      "They should not respond to letters from MPs and MLAs unless specifically instructed to do so by a higher authority.",
      "They should provide the requested information to MPs and MLAs even if it is confidential.",
      "They can refuse the request of Member of Parliament or of State Legislature at their own level.",
    ],
    correctAnswer:
      "They should promptly acknowledge letters from MPs and MLAs and provide them with requested information.",
    explanation:
      "GoI decision (Rule 3): Official dealings between the Administration and Members of Parliament and State Legislatures- a) Letters received from Members of Parliament and of State Legislatures should be acknowledged promptly. All such letters should receive careful consideration and should be responded to at an appropriate level and expeditiously. The officers should furnish to Members of Parliament and of State Legislatures when asked for, such information or statistics relating to matters of local importance as are readily available and are not confidential. In doubtful cases, instructions should be taken from a higher authority before refusing the request. \nb). While the official dealings of Government servants with Members of Parliament and of State Legislatures have to be regulated as stated in the previous paragraphs, it is necessary to invite the attention of Government servants to what is expected of them in their individual capacity in respect of their own grievances in the matter of conditions of service. Under the relevant Conduct Rules governing them, Government servants are prohibited from bringing or attempting to bring any political or other influence to bear upon any superior authority to further their interests in respect of matters pertaining to their service under the Government. Therefore, a Government servant is not expected to approach a Member of Parliament or of a State Legislature for sponsoring his individual case.",
  },
  {
    questionText:
      "As per the instructions under the Conduct Rules, what should a junior officer do if they receive oral instructions from the Minister or from his personal staff and the orders are in accordance with the norms, rules, regulations or procedures?",
    options: [
      "They should follow the instructions as it is accordance with rules and regulations",
      "They should take action after written confirmation is received.",
      "They should bring instructions to the notice of the Secretary or the Head of the Department, as the case may be, for information.",
      "None of the above",
    ],
    correctAnswer:
      "They should bring instructions to the notice of the Secretary or the Head of the Department, as the case may be, for information.",
    explanation:
      "GoI Decision: if a junior officer receives oral instructions from the Minister or from his personal staff and the orders are not in accordance with the norms, rules, regulations or procedures, they should seek further clear orders from the Secretary or the Head of the Department, as the case may be, about the line of action to be taken, stating clearly that the oral instructions are not in accordance with the rules, regulations, norms or procedures.",
  },
  {
    questionText:
      "What is the stance of the Indian government on central government servants joining the Moral Re-armament Movement?",
    options: [
      "They should actively participate in the movement in official capacity with the permission of Head of Office or Department.",
      "They may only participate in non-political activities in their individual capacity and should not associate with any activity in their official capacity.",
      "They should avoid joining the movement altogether.",
      "None of the above",
    ],
    correctAnswer:
      "They may only participate in non-political activities in their individual capacity and should not associate with any activity in their official capacity.",
    explanation:
      "GoI Decision (Rule 5)-Participation of Government servants in political activities: The Indian government has considered whether central government servants should be allowed to join and participate in the Moral Re-armament Movement. The decision is that they should not associate with any activities in their official capacity or with activities that are political or have a political slant, even in their individual capacity. Government servants should be cautious to avoid participating in political activities and should inform their Head of the Department about their association with the movement. \nNote - The Moral Re-armament Movement, now known as Initiatives of Change, is an international organization that promotes moral and spiritual values as a foundation for personal and societal change. It was founded in the 1930s by American minister Frank Buchman as a response to the social and political turmoil of the time. The movement aims to foster global understanding, reconciliation, and peace by encouraging individuals to commit to personal transformation based on honesty, purity and unselfishness.",
  },
  {
    questionText:
      "Which rule of the Central Civil Services (Conduct) Rules, 1964, allows government servants to express their personal views freely during interviews with the Administrative Reforms Commission?",
    options: ["Rule 9 (1)", "Rule 8(3)", "Rule 10(3)", "Rule 11 (2)"],
    correctAnswer: "Rule 10(3)",
    explanation:
      "Rule 10: Evidence before Committee or any other authority- \n(1) No government servant can give evidence in any enquiry conducted by any person, committee or authority, except with the previous sanction of the Government. \n(2) However, if such sanction has been accorded, the government servant giving evidence should not criticize the policy or action of the Central or State Government. \n(3) This rule does not apply to evidence given at an enquiry before an authority appointed by the Government, Parliament, or a State Legislature, evidence given in any judicial enquiry, or evidence given at any departmental enquiry ordered by authorities subordinate to the Government.",
  },
  {
    questionText:
      "CCS Pension Rules, 2021, are formulated under proviso to __________ and clause (5) of ___________ of the Constitution.",
    options: [
      "Article 309, Article 149",
      "Article 307, Article 148",
      "Article 309, Article 148",
      "Article 308, Article 150",
    ],
    correctAnswer: "Article 309, Article 148",
    explanation:
      "The President has made the CCS (Pension) Rules, 2021, in exercise of the powers conferred by the proviso to article 309 and clause (5) of article 148 of the Constitution and after consultation with the Comptroller and Auditor-General of India in relation to persons serving in the Indian Audit and Accounts Department.",
  },
  {
    questionText:
      "The _________________ can withhold or withdraw a pension, either permanently or for a specified period, if the pensioner is convicted of a serious crime or found guilty of grave misconduct.",
    options: [
      "President",
      "Appointing Authority",
      "Secretary, D/o P&PW",
      "Secretary of the concerned Ministry/ Department",
    ],
    correctAnswer: "Appointing Authority",
    explanation:
      "Rule 7- Pension and family pension subject to future good conduct.- \n(1)(a) Future good conduct shall be an implied condition of every grant of pension and its continuance under these rules. \n(b) the Appointing Authority may, by order in writing, withhold or withdraw a pension or a part thereof, whether permanently or for a specified period, if the pensioner is convicted of a serious crime or is found guilty of grave misconduct: Provided that where a part of pension is withheld or withdrawn, the amount of such pension shall not be reduced below the amount of minimum pension under rule 44.",
  },
  {
    questionText:
      "As per CCS (Pension) Rules, 2021, the judicial proceedings shall be deemed to be instituted when: \n1. The complaint or report of a police officer is made in the case of criminal proceedings. \n2. The date of first hearing in court in case of civil proceedings.",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    correctAnswer: "1 only",
    explanation:
      "For the purpose of CCS (Pension) Rules, 2021- (1)(a) Departmental proceedings shall be deemed to be instituted on the date on which the statement of charges is issued to the Government servant or pensioner, or if the Government servant has been placed under suspension from an earlier date, on such date; and \n(b) Judicial proceedings shall be deemed to be instituted (i) in the case of criminal proceedings, on the date on which the complaint or report of a police officer, of which the Magistrate takes cognizance, is made; and (ii) in the case of civil proceedings, on the date the suit is filed in the court.",
  },
  {
    questionText:
      "A Pension Fund in the form of a trust is created by the Central Government to pay pensions to Government servants who are absorbed into a PSU due to the conversion of a Government Department. Who of the following are included in the Board of Trustees of the Pension Fund?",
    options: [
      'Representatives of D/o Expenditure, Pension and Pensioner"s Welfare and Labour & Employment',
      "Representatives of concerned public sector undertaking, employees of the concerned public sector undertaking",
      "Experts in the relevant field to be nominated by the Central Government.",
      "All of the above",
    ],
    correctAnswer: "All of the above",
    explanation:
      'Rule 37(18) The Central Government shall create a Pension Fund in the form of a trust and the pensionary benefits of absorbed employees shall be paid out of such Pension Fund. \nRule 37(19)(a) The Secretary of the administrative Ministry of the public sector undertaking shall be the Chairperson of the Board of Trustees of the Pension Fund. (b) The Board of Trustees shall include representatives of the Department of Expenditure, Department of Pension and Pensioner"s welfare, Ministry of Labour and Employment, concerned public sector undertaking, employees of the concerned public sector undertaking and experts in the relevant field to be nominated by the Central Government.',
  },
  {
    questionText:
      "According to the Compulsory Retirement Pension rule, a government servant compulsorily retired from service may be granted a pension or retirement gratuity or both at a rate not less than ____________ of the full superannuation pension or gratuity admissible to him on the date of his compulsory retirement.",
    options: ["one-third", "one-half", "two-thirds", "three-fourths"],
    correctAnswer: "two-thirds",
    explanation:
      "Rule 40- Compulsory retirement pension- (1) A Government servant compulsorily retired from service as a penalty may be granted, by the authority competent to impose such penalty, pension or retirement gratuity or both at a rate not less than two-thirds and not more than full superannuation pension or gratuity or both admissible to him on the date of his compulsory retirement.",
  },
  {
    questionText:
      "Regarding the hierarchy within a Ministry/Department, identify the correct statements:",
    options: [
      "A Department is typically headed by a Secretary who also serves as the administrative head and principal policy advisor to the concerned Minister.",
      "Each Wing in a Department is headed by an Officer of Director/ DS level.",
      "A Branch is the lowest unit in a Department with a well-defined area of work.",
      "For the efficient disposal of business allotted to it, a Department is divided only into Divisions, Branches and Sections/Units/Cells.",
    ],
    correctAnswer:
      "A Department is typically headed by a Secretary who also serves as the administrative head and principal policy advisor to the concerned Minister.",
    explanation:
      "[Organizational Structure of Govt. of India] \n \n Ministry/Department: \n(i) A Ministry/Department is responsible for formulation of policies/schemes of the Government in relation to business allocated to it and also for their implementation, monitoring and review. \n(ii) For the efficient disposal of business allotted to it, a Department is divided into Wings, Divisions, Branches and Sections/Units/Cells. \n(iii) A Department is normally headed by a Secretary to the Government of India who acts as the administrative head of the Department and Principal Adviser of the Minister on all matters of policy and administration within the Department. \n(iv) The work in a Department is divided into wings with a Special Secretary/ Additional Secretary/Joint Secretary in charge of each Wing. \n(v) A Wing comprises of a number of Divisions each functioning under the charge of an officer of the level of Director/Joint Director/Deputy Secretary or equivalent officer, called Division Head. A Division may have branches, each under the charge of an Under Secretary or equivalent officer, as Branch Officer.",
  },
  {
    questionText:
      "Which of the following statements accurately describes Constitutional Bodies?",
    options: [
      "Constitutional Bodies are established under a specific statute or an Act of Parliament.",
      "They are constituted under the provisions of the Constitution of India.",
      "Both (a) and (b)",
      "Neither (a) nor (b)",
    ],
    correctAnswer:
      "They are constituted under the provisions of the Constitution of India.",
    explanation:
      "Constitutional Bodies: \nSuch bodies are constituted under the provisions of the Constitution of India, such as, Comptroller & Auditor General of India, Election Commission of India, Union Public Service Commission, etc. \n \n Statutory Bodies: \nSuch bodies are established under the statute or an Act of Parliament. They work within the scope, mandate and powers legally provided to them by an Act of the Parliament (e.g. Central Vigilance Commission, Central Information Commission, Central Board of Film Certification, National Commission for Backward Class etc.) \n \n Autonomous Bodies: \n Such bodies are established by the Government to discharge the activities/functions relating to execution/implementation of policies of the government. They are given autonomy to discharge their functions in accordance with the Memorandum of Associations etc. However, the Government's overall control exists to the extent of its policy framework on the subject. Some of the programmes and activities are funded fully or partly by the Government of India, generally through grants-in-aid. They are registered under the Societies Registration Act, 1861. Example: Central Board of Secondary Education, Indian Institute of Public Administration, etc. \n \n Central Public Sector Enterprises: \nCentral Public Sector Enterprise (CPSE) is the Company under the administrative control of Central Ministry/Department holding more than 50% of the equity by Central Govt. The subsidiaries of these companies, if registered in India wherein any CPSE has more than 50% equity are also categorised as CPSEs. It also covers certain statutory corporations like Airport Authority of India, Food Corporation of India and Central Warehousing Corporation. The shares of CPSEs are held by the President of India or his nominees and managed by Board of Directors which include official and nonofficial Directors/other shareholders or by the Holding companies. The departmentally run public enterprise, banking institutions and insurance companies are not covered under the definitions of CPSE.",
  },
  {
    questionText:
      "How are newspapers, magazines, and periodicals handled in the CRU?",
    options: [
      "They are registered and scanned before being forwarded to the concerned section.",
      "They are directly handed over to the Library without registration or scanning.",
      "They are registered but not scanned and handed over to the addressee.",
      "They are scanned and then destroyed to maintain confidentiality.",
    ],
    correctAnswer:
      "They are directly handed over to the Library without registration or scanning.",
    explanation:
      'In a government department"s Central Registry Unit, distinct protocols are followed for handling different types of Dak (official communications). \n \nNewspapers, magazines, and periodicals are not registered or scanned; they are directly handed over to the Library. Private Dak, such as LIC reminders or personal bills, also bypass registration and scanning and are handed over to the addressee, their Personal Assistant (PA), or Multi-Tasking Staff (MTS). In cases where Private Dak arrives via registered or speed post, it is not registered in the CRU system but is acknowledged in a paper register, requiring the signature of the addressee, PA, or MTS. \n \nFor official Dak addressed by office name, a more thorough process is followed: such Dak is opened, scanned, registered, and then electronically forwarded to the concerned section, with the original paper carrying the registration number being sent to the respective section. If the Dak contains bulky enclosures like brochures, only the covering letter is scanned and the enclosures are sent as hard copies, with notes about the enclosures entered in the registration. Important documents within such enclosures can be scanned by the Officer, Section, or Personal Staff against the registration number for record keeping. \n \nFor Dak addressed specifically to an officer or marked as Private/Classified, the CRU adheres to a protocol of non-disclosure: such Dak is not opened but is registered and electronically forwarded to the addressee. The registration number and date are marked on the unopened envelope, which is then sent to the concerned officer or their PA. It is the responsibility of the addressee or their PA to scan it and enter it into an eFile against the registration number.',
  },
  {
    questionText:
      'In the eFile system, how are urgency gradings like "Immediate", "Priority", and "Top Priority" assigned, and what special label is used for Rajya Sabha/Lok Sabha matters?',
    options: [
      "Urgency gradings are automatically assigned based on the content, and no special label is used for Rajya Sabha/Lok Sabha matters.",
      "These gradings are given by the user at the time of sending the file/receipt, and the label 'VIP' is specifically used for Rajya Sabha/Lok Sabha matters.",
      "Urgency gradings are assigned by an automated system after scanning the document, and 'Confidential' is the label for Rajya Sabha/Lok Sabha matters.",
      "The grading is decided by the department head only, and a 'Parliament Matter' label is used for Rajya Sabha/Lok Sabha matters.",
    ],
    correctAnswer:
      "These gradings are given by the user at the time of sending the file/receipt, and the label 'VIP' is specifically used for Rajya Sabha/Lok Sabha matters.",
    explanation:
      "Urgency grading: \n (i) The urgency grading advised are ‘Immediate', ‘Priority' and 'Top Priority'. The label 'Immediate' will be used only in cases requiring prompt attention. Amongst the rest, the 'Priority' label will be used for cases which merit disposal in precedence to others of ordinary nature. 'Top Priority' will be applied in extremely urgent cases. \n(ii) Where Lok Sabha/Rajya Sabha questions, motions, Bills are processed, separate specific file cover shall be used. Hence, it will not be necessary to use any other urgency grading. \n(iii) The grading of urgency assigned to a case will be reviewed by all concerned at different stages of its progress and where necessary, revised. This is particularly important for cases proposed to be referred to other departments. \n \n In eFile, 'Immediate', 'Priority' and 'Top Priority' are the urgency grading. These urgency grading are given by the user at the time of sending the file / receipt. Label “VIP” is used for the Rajya Sabha/Lok Sabha matters. The grading of urgency assigned to a case will be reviewed by all concerned at different stages of its progress and where necessary, revised.",
  },
  {
    questionText:
      "On days designated for Government business, who determines the order in which that business is arranged after consulting with the Leader of the House?",
    options: [
      "The Secretary-General",
      "The Leader of the House",
      "The Speaker after consultation with the Secretary-General",
      "The Speaker after consultation with the Leader of the House",
    ],
    correctAnswer:
      "The Speaker after consultation with the Leader of the House",
    explanation:
      "Rule 25 (Arrangement of Govt Business).\n On days allotted for the transaction of Government business, such business shall have precedence and the Secretary-General, shall arrange that business in such order as the Speaker may, after consultation with the Leader of the House, determine: \n \nProvided that such order of business shall not be varied on the day that business is set down for disposal unless the Speaker is satisfied that there is sufficient ground for such variation.",
  },
  {
    questionText:
      "On any given day, what is the maximum number of questions distinguished by an asterisk by the same member that can be placed for oral answer?",
    options: ["One", "Two", "Five", "Seven"],
    correctAnswer: "One",
    explanation:
      "Rule 37 (Questions). \n(1) Not more than one question distinguished by an asterisk by the same member and not more than twenty questions in all shall be placed on the list of questions for oral answer on any one day: \n \nProvided that when a question is postponed or transferred from one list of questions for oral answer to another, more than one question may stand in the name of one member and the total number of questions may exceed by such postponed or transferred question.",
  },
  {
    questionText:
      "If a member wishes to ask question on a matter which is currently under adjudication by a court of law in India, is this permissible?",
    options: [
      "Yes, as long as it doesn’t prejudice the outcome.",
      "No, such matters are off-limits for questioning.",
      "Yes, if the court is outside the jurisdiction of the central government.",
      "No, unless it has been more than five years since the matter began.",
    ],
    correctAnswer: "No, such matters are off-limits for questioning.",
    explanation:
      "Rule 41(2) [Questions] - \n \n The right to ask a question is governed by the following conditions, inter alia, namely:— It shall not ask for information on matter which is under adjudication by a court of law having jurisdiction in any part of India;",
  },
  {
    questionText:
      "In the event that the Minister cannot provide an answer at short notice, and the Speaker determines the question is of significant public interest to be addressed orally in the House, where can the question be placed?",
    options: [
      "At the end of the list of questions for the day it was originally scheduled.",
      "As the first question on the list for the day it would typically be due for an answer under rule 33.",
      "As decided by the Business Advisory Committee",
      "Any of the above",
    ],
    correctAnswer:
      "As the first question on the list for the day it would typically be due for an answer under rule 33.",
    explanation:
      "Rule 54 [Short Notice Question] \n \n 54(1) A question relating to a matter of public importance may be asked with notice shorter than ten clear days and the Speaker, if, is of the opinion that the question is of an urgent character, may direct that an enquiry may be made from the Minister concerned if such Minister is in a position to reply and, if so, on what date. \n \n 54(3) If the Minister is unable to answer the question at short notice and the Speaker is of the opinion that the question is of sufficient public importance to be orally answered in the House, the Speaker may direct that the question be placed as the first question on the list of questions for the day on which it would be due for answer under rule 33: Provided that not more than one such question shall be accorded first priority on the list of questions for any one day.",
  },
  {
    questionText:
      "Which of the following statements about the Select Committee on a Bill is/are correct? \n1. Non-members of the Select Committee cannot be present during its deliberations. \n2. Non-members can be present during deliberations but cannot address the Committee. \n3. A Minister can address the Committee without being a member, with permission from the Chairperson. \n4. All members of the House are free to sit in the body of the Select Committee.",
    options: ["1, 2 and 4", "2 and 3 only", "1, 3 and 4", "All of the above"],
    correctAnswer: "2 and 3 only",
    explanation:
      "[Select Committee on Bills] \n Rule 298- The members of a Select Committee on a Bill shall be appointed by the House when a motion that the Bill be referred to a Select Committee is made. \n \n Rule 299- Members who are not members of the Select Committee may be present during the deliberations of the Committee but shall not address the Committee or sit in the body of the Committee: \n Provided that a Minister may with the permission of the Chairperson address the Committee of which such Minister may not be a member.",
  },
  {
    questionText:
      "How many Departmentally Related Standing Committees are serviced by the Rajya Sabha Secretariat?",
    options: ["8", "12", "16", "24"],
    correctAnswer: "8",
    explanation:
      "[Departmentally Related Standing Committees]: \n \n \n1. A full-fledged system of 17 Departmentally Related Standing Committees came into being in April, 1993 covering under their jurisdiction all Central Ministries/Departments. The system of DRSCs was re-structured in July, 2004 when the number of DRSCs was increased from 17 to 24 and the membership of each DRSC has been reduced from 45 to 31 Members. \n \n2. Out of the 24 Committees, 8 Committees are serviced by the Rajya Sabha Secretariat and 16 Committees by the Lok Sabha Secretariat. \n \n \n3. Each DRSC comprises 31 members, with 21 from the Lok Sabha, nominated by the Speaker, and 10 from the Rajya Sabha, nominated by the Chairman. Ministries and Departments are allocated to each DRSC as specified, but the allocation can be altered by the Chairman of the Rajya Sabha and the Speaker in consultation. \n \n \n4. Ministers are not eligible for nomination to these committees. If a member becomes a minister after nomination, they cease to be a committee member. Each committee's Chairperson is appointed either by the Chairman of the Rajya Sabha or the Speaker. \n \n 5. The term of office for committee members is one year. The functions of the DRSCs include considering the Demands for Grants of the respective Ministries/Departments and reporting on them without suggesting cut motions. They also examine Bills related to the assigned Ministries/Departments, referred to them by the Chairman or Speaker, and report on them. These committees review the annual reports of Ministries/Departments and national basic long-term policy documents if referred and produce reports on them. However, they are not involved in the daily administration of the Ministries/Departments.",
  },

  {
    questionText:
      "Under the Right to Information Act, 2005, a non-Government organization is considered a 'public authority' if it is:",
    options: [
      "Operating in more than one state",
      "Substantially financed, directly or indirectly, by funds provided by the appropriate Government",
      "Registered under the Societies Registration Act and engaged in charitable activities.",
      "All of the above",
    ],
    correctAnswer:
      "Substantially financed, directly or indirectly, by funds provided by the appropriate Government",
    explanation:
      "Section 2(h): 'public authority' means any authority or body or institution of self-government established or constituted— \n \n(a) by or under the Constitution; \n(b) by any other law made by Parliament; \n(c) by any other law made by State Legislature; (ci) by notification issued or order made by the appropriate Government, and includes any—\n (i) body owned, controlled or substantially financed; \n(ii) non-Government organisation substantially financed, directly or indirectly by funds provided by the appropriate Government;",
  },
  {
    questionText:
      "According to the guidelines for digital publication of proactive disclosure under Section 4, which of the following should be included on the website of a public authority? \n1. Details of entitlements and services provided by the public authority to citizens. \n2. Detailed directory of key contacts, details of officials of the Public Authority. \n3. To present information from a user's perspective and avoid uploading the original documents in original formats.",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "All of the above",
    ],
    correctAnswer: "1 and 2 only",
    explanation:
      "GoI Decision (Section 4): The following principles additionally should also be kept in view to ensure that websites' disclosures are complete, easily accessible, technology and platform neutral and in a form which conveys the desired information in an effective and user-friendly manner: \n i) Websites should contain detailed information from the point of origin to the point of delivery of entitlements/services provided by the Public Authorities to citizens. \n ii) Orders of the public authority should be uploaded on the website immediately after they have been issued. \niii) Key contacts and official details of the public authority should be provided on the website. \n iv) The website should indicate which digitally held information is made available publicly over the internet and which is not. \nv) Transparency requirements should be considered at the design stage of electronic service delivery systems. \nvi) Information should be presented from a user's perspective and in open data formats to enable various uses. \n vii) Information must be presented from a user's perspective, which may require rearranging it, simplifying it, etc. However, original documents in original formats should continue to be made available because these are needed for community monitoring of Government's functioning. \n viii) Strict adherence to the National Data Sharing and Accessibility Policy to ensure that all publicly funded information is readily available. \nix) Every webpage displaying information proactively disclosed under the RTI Act should indicate the last updated date.",
  },
  {
    questionText:
      "Which of the following is an exemption under the Section 8 of RTI Act that can be waived in larger public interest? \n1. Information including commercial confidence, trade secrets of intellectual property. \n2. Information available to a person in his fiduciary relationship. \n3. Cabinet papers including records of deliberations of the Council of Ministers. \n4. Information which relates to personal information the disclosure of which has no relationship to any public activity or interest.",
    options: ["1, 2 and 3", "3 and 4", "1, 2 and 4", "All of the above"],
    correctAnswer: "1, 2 and 4",
    explanation:
      "Section 8: Exemption from disclosure of information- \n(1) Notwithstanding anything contained in this Act, there shall be no obligation to give any citizen - \n \n(a) information, disclosure of which would prejudicially affect the sovereignty and integrity of India, the security, strategic, scientific or economic interests of the State, relation with foreign State or lead to incitement of an offence; \n \n(b) information which has been expressly forbidden to be published by any court of law or tribunal or the disclosure of which may constitute contempt of court;\n \n (c) information, the disclosure of which would cause a breach of privilege of Parliament or the State Legislature; \n \n(d) information including commercial confidence, trade secrets of intellectual property, the disclosure of which would harm the competitive position of a third party, unless the competent authority is satisfied that larger public interest warrants the disclosure of such information; \n \n(e) information available to a person in his fiduciary relationship, unless the competent authority is satisfied that the larger public interest warrants the disclosure of such information; \n \n(f) information received in confidence from foreign Government; \n \n(g) information, the disclosure of which would endanger the life or physical safety of any person or identify the source of information or assistance given in confidence for law enforcement or security purposes; \n \n(h) information which would impede the process of investigation or apprehension or prosecution of offenders; \n \n(i) cabinet papers including records of deliberations of the Council of Ministers, Secretaries and other officers Provided that the decisions of Council of Ministers, the reasons thereof, and the material on the basis of which the decisions were taken shall be made public after the decision has been taken, and the matter is complete, or over Provided further that those matters which come under the exemptions specified in this section shall not be disclosed; \n \n(j) information which relates to personal information the disclosure of which has no relationship to any public activity or interest, or which would cause unwarranted invasion of the privacy of the individual unless the Central Public Information Officer or the State Public Information Officer or the Appellate Authority, as the case may be, is satisfied that the larger public interest justifies the disclosure of such information: Provided that the information which cannot be denied to the Parliament or a State Legislature shall not be denied to any person.",
  },

  {
    questionText:
      "Which of the following best describes 'contingent expenditure' as per the Delegation of Financial Power 1978? \n1. Expenditure on stores that is incurred for the management of an office or for the working of technical establishments. \n2. Expenditure on the assignment of funds included in a primary unit of appropriation to meet specified expenses. \n3. It does not include any expenditure, which has been specifically classified as falling under some other Head of expenditure, such as 'Works', 'Tools and Plant'. \n4. Expenditure that is incurred at periodical intervals.",
    options: ["1 and 2", "2 and 4", "3 and 4", "1 and 3"],
    correctAnswer: "1 and 3",
    explanation:
      "Rule 3- Definition: \n(c) 'Contingent expenditure' means all incidental and other expenditure including expenditure on stores which is incurred for the management of an office, for the working of technical establishment such as a laboratory, work-shop, industrial installation, store-depot, office expenses and the like but does not include any expenditure, which has been specifically classified as falling under some other Head of expenditure, such as 'Works', 'Tools and Plant';",
  },
  {
    questionText:
      "According to provisions of DFPR, 1978, a Subordinate Authority can sanction expenditure or advances of public money under which of the following conditions? \n1. When the expenditure is sanctioned by provisions of any law currently in force. \n2. When the expenditure is sanctioned under any general or special order of the President or other Competent Authority.",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    correctAnswer: "Both 1 and 2",
    explanation:
      "Rule 4- General limitations on power to sanction expenditure:\n(1) No expenditure shall be incurred from the public revenues except on legitimate objects of public expenditure. \n(2) A Subordinate Authority may sanction expenditure or advances of public money in those cases only in which it is authorized to do so by- \n(a) the provisions of any law for the time being in force; \n(b) these or any other rules issued by, or with the approval of the President; or \n(c) any general or special order of the President or other Competent Authority. \n(3) Nothing contained in sub-rule (2) shall empower any subordinate authority to sanction, without the previous consent of the Finance Ministry, any expenditure which involves the introduction of a new principle or practice likely to lead to increased expenditure in future unless the said expenditure has been subjected to scrutiny and agreed to by the Finance Ministry before its inclusion in the budget. \nA Subordinate Authority shall exercise the power to sanction expenditure subject to any general or special order, direction or stipulation which the authority delegating or redelegating such power may issue or prescribe from time to time.",
  },
  {
    questionText:
      "What are the core principles to be kept in mind when designing new schemes or sub-schemes, as per the guidelines? \n1. Economies of scale. \n2. Sharing of implementation machinery. \n3. Homogeneity of outcomes.",
    options: ["1 and 3", "2 and 3 only", "1 and 2 only", "All of the above"],
    correctAnswer: "1 and 2 only",
    explanation:
      'GoI Order [DoE"s OM dated 05.08.2016] (Rule 18): \nScheme and project formulation is crucial for effective implementation and avoiding time and cost overruns. For new schemes, a Concept Paper should be prepared, followed by stakeholder consultations and pilot studies. On-going schemes should undergo rationalization, merging, and dropping of redundant schemes. Similarly, project preparation should commence with a Feasibility Report, which helps establish the project is techno-economically sound and resources are available to finance the project. It provides a firm basis for starting land acquisition, approval of pre-investment activities, etc. In-principle approval for initiating a project will be granted by the Financial Adviser concerned after examining project feasibility and availability of financial resources. \nWhile designing new schemes/sub-schemes, the core principles to be kept in mind are economies of scale, separability of outcomes and sharing of implementation machinery. Schemes which share outcomes and implementation machinery should not be posed as independent schemes, but within a unified umbrella program with carefully designed convergence frameworks.',
  },
  {
    questionText:
      "Who chairs the Committee of Establishment Expenditure that appraises the cases for setting up new bodies?",
    options: [
      "Finance Minister",
      "Expenditure Secretary",
      "Cabinet Secretary",
      "Cabinet",
    ],
    correctAnswer: "Expenditure Secretary",
    explanation:
      'GoI Order [DoE"s OM dated 05.08.2016] (Rule 18): \nNo new Company, Autonomous Body, Institution/University or other Special Purpose Vehicle should be set up without the approval of the Cabinet/Committee of the Cabinet, irrespective of the outlay, or any delegation that may have been issued in the past. All such cases would be appraised by the Committee of Establishment Expenditure chaired by the Expenditure Secretary for which separate orders will be issued by the Pers. Division. If setting up of a New Body involves project work, combined CEE/ EFC/ PIB may be held.',
  },
];
