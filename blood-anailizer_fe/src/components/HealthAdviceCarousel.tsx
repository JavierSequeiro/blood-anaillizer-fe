import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import {
  Heart,
  Activity,
  Apple,
  Droplet,
  TrendingUp,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { motion, AnimatePresence } from "motion/react";

const healthAdvices = [
  {
    icon: Heart,
    title: "Heart Health",
    advice:
      "Maintain a healthy heart by exercising 150 minutes per week. Regular physical activity strengthens your cardiovascular system.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Apple,
    title: "Nutrition Tips",
    advice:
      "Eat a balanced diet rich in fruits, vegetables, and whole grains. Limit saturated fats and sodium for optimal cardiovascular health.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Activity,
    title: "Stay Active",
    advice:
      "Take breaks every hour to stretch and move. Small bursts of activity throughout the day add up to big health benefits.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Droplet,
    title: "Hydration Matters",
    advice:
      "Drink at least 8 glasses of water daily. Proper hydration supports blood circulation and overall cardiovascular function.",
    color: "from-cyan-500 to-blue-400",
  },
  {
    icon: TrendingUp,
    title: "Monitor Progress",
    advice:
      "Regular blood tests help track your biomarkers over time. Early detection of changes can prevent serious health issues.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Brain,
    title: "Stress Management",
    advice:
      "Practice stress-reduction techniques like meditation or yoga. Chronic stress negatively impacts heart health and blood pressure.",
    color: "from-indigo-500 to-purple-500",
  },
];

export function HealthAdviceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % healthAdvices.length,
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAdvice = healthAdvices[currentIndex];
  const Icon = currentAdvice.icon;

  return (
    <Card className="overflow-hidden relative h-full">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentAdvice.color} opacity-10`}
      />
      <div className="relative p-6 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-full bg-gradient-to-br ${currentAdvice.color}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold">
                  {currentAdvice.title}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center max-w-sm mx-auto">
                {currentAdvice.advice}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {healthAdvices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gray-800"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to advice ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}