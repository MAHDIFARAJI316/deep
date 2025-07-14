import { motion } from 'framer-motion';

const SampleAnimation = () => {
  return (
    <motion.div
      className="w-24 h-24 bg-purple-500 rounded-lg mt-8"
      animate={{
        scale: [1, 1.5, 1.5, 1, 1],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      }}
    />
  );
};

export default SampleAnimation; 