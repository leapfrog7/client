import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "tailwindcss/tailwind.css";

const slides = [
  {
    image: "/N_carousel3.png",
    s_image: "/small_image3.png",
    title: "Smart Exam Tools",
    features: [
      "Track your progress in real-time for every topic",
      "Get detailed explanations for each question to enhance retention.",
    ],
  },
  {
    image: "/N_carousel4.png",
    s_image: "/small_image4.png",
    title: "Smart Exam Tools",
    features: [
      "Real Time Dashboard to track your preparation",
      "Bookmark important questions for easy revision",
      "Receive instant results and scores after every quiz.",
    ],
  },
  {
    image: "/N_carousel2.png",
    s_image: "/small_image2.png",
    title: "Ace Exams with PYQs",
    features: [
      "Practice with real previous year questions (2016 year onwards)",
      "Save your progress and resume at your own pace",
      "Get your score as per UPSC marking scheme",
    ],
  },
  {
    image: "/N_carousel1.png",
    s_image: "/small_image1.png",
    title: "Your Feedback Shapes Us",
    features: [
      "Rate question to help us improve",
      "Report errors to ensure accuracy and precision",
    ],
  },
];

const NewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-4 relative w-full lg:w-11/12 mx-auto overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 flex items-center flex-col 2xl:flex-row"
          >
            <div className="min-h-48 w-full 2xl:w-1/3 p-6 bg-gray-100 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-3">{slide.title}</h2>
              <ul className="list-disc list-inside">
                {slide.features.map((feature, i) => (
                  <li key={i} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={slide.image}
              alt={slide.title}
              className="hidden md:block w-full 2xl:w-2/3 object-cover"
            />
            <img
              src={slide.s_image}
              alt={slide.title}
              className="mt-2 block md:hidden object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-4" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCarousel;
