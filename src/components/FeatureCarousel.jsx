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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto overflow-hidden z-10">
            <img
              src="/progress.png"
              srcSet="/progress.png 600w, progress.png 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Track your progress"
              className="mb-4 rounded-lg object-cover lg:max-h-96"
            />
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Track Your Progress
            </h2>
            <p className="text-sm sm:text-base">
              Option to get unattempted quiz
            </p>
            <p className="text-sm sm:text-base">
              See your progress in real-time
            </p>
          </div>
          <div className="flex flex-col items-center max-w-md mx-auto">
            <img
              src="/Bookmarks.png" // Replace with your image path
              srcSet="/Bookmarks.png 600w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Bookmark important questions"
              className="mb-4 rounded-lg object-cover lg:max-h-96"
            />
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Bookmark Important Questions
            </h2>
            <p className="text-sm sm:text-base">
              You can bookmark your questions topic-wise
            </p>
            <p className="text-sm sm:text-base">Available to you anytime</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gradient-to-r from-yellow-100 to-pink-50 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <img
              src="/quiz.png"
              srcSet="/quiz.png 600w, /quiz.png 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Customizable quizzes"
              className="mb-4 rounded-lg lg:object-cover"
            />

            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Customizable Quizzes
            </h2>

            <p className="text-sm sm:text-base">
              Create quizzes tailored to your needs
            </p>
            <p className="text-sm sm:text-base">
              Choose topics and difficulty levels
            </p>
          </div>
          <div className="flex flex-col items-center max-w-md mx-auto">
            <img
              src="/track.png"
              srcSet="/track.png 600w, /track.png 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Detailed analytics"
              className="mb-4 rounded-lg lg:object-cover"
            />
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Detailed Analytics
            </h2>
            <p className="text-sm sm:text-base">
              Get insights on your performance
            </p>
            <p className="text-sm sm:text-base pb-4">
              Analyze your strengths and weaknesses
            </p>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default FeatureCarousel;
