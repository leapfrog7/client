import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const FeatureCarousel = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        emulateTouch={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <img
              src="https://via.placeholder.com/300x200"
              srcSet="https://via.placeholder.com/600x400 600w, https://via.placeholder.com/300x200 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Track your progress"
              className="mb-4 rounded-lg"
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
              src="https://via.placeholder.com/300x200"
              srcSet="https://via.placeholder.com/600x400 600w, https://via.placeholder.com/300x200 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Bookmark important questions"
              className="mb-4 rounded-lg"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <img
              src="https://via.placeholder.com/300x200"
              srcSet="https://via.placeholder.com/600x400 600w, https://via.placeholder.com/300x200 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Customizable quizzes"
              className="mb-4 rounded-lg"
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
              src="https://via.placeholder.com/300x200"
              srcSet="https://via.placeholder.com/600x400 600w, https://via.placeholder.com/300x200 300w"
              sizes="(max-width: 640px) 300px, 600px"
              alt="Detailed analytics"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Detailed Analytics
            </h2>
            <p className="text-sm sm:text-base">
              Get insights on your performance
            </p>
            <p className="text-sm sm:text-base">
              Analyze your strengths and weaknesses
            </p>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default FeatureCarousel;
