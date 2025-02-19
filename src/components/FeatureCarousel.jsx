import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const FeatureCarousel = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={7000}
        emulateTouch={true}
        swipeable={true} // Ensure touch swipe is enabled
        useKeyboardArrows={true} // Allow keyboard arrows for navigation
        preventMovementUntilSwipeScrollTolerance={true} // Add this line
        swipeScrollTolerance={50} // Add this line
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-xl transition-transform transform p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl shadow-md">
              <img
                src="/progress.png"
                srcSet="/progress.png 600w, /progress.png 300w"
                sizes="(max-width: 640px) 300px, 600px"
                alt="Track Your Progress"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 text-center tracking-wide">
              📊 Track Your Progress
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 text-center leading-relaxed">
              Stay updated with real-time insights as you complete quizzes and
              monitor your growth effortlessly.
            </p>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
              Learn More →
            </button>
          </div>

          <div className="flex flex-col items-center max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-xl transition-transform transform p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl shadow-md">
              <img
                src="/Bookmarks.png"
                srcSet="/Bookmarks.png 600w"
                sizes="(max-width: 640px) 300px, 600px"
                alt="Bookmark Important Questions"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 text-center tracking-wide">
              🔖 Bookmark Important Questions
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 text-center leading-relaxed">
              Save crucial questions topic-wise and access them anytime,
              enhancing your revision efficiency.
            </p>

            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
              Explore Bookmarks →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-xl transition-transform transform hover:scale-105 p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl shadow-md">
              <img
                src="/quiz.png"
                srcSet="/quiz.png 600w, /quiz.png 300w"
                sizes="(max-width: 640px) 300px, 600px"
                alt="Customizable Quizzes"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 text-center tracking-wide">
              🎯 Customized Quiz Experience
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 text-center leading-relaxed">
              Choose between random questions from any topic or focus
              exclusively on unattempted quizzes for a tailored study session.
            </p>

            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
              Start a Quiz →
            </button>
          </div>

          <div className="flex flex-col items-center max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-xl transition-transform transform hover:scale-105 p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-xl shadow-md">
              <img
                src="/track.png"
                srcSet="/track.png 600w, /track.png 300w"
                sizes="(max-width: 640px) 300px, 600px"
                alt="Progress Dashboard"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 text-center tracking-wide">
              📊 Progress Dashboard
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 text-center leading-relaxed">
              Monitor your growth, identify key areas for improvement, and
              achieve your learning goals efficiently.
            </p>

            <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
              View Dashboard →
            </button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default FeatureCarousel;
