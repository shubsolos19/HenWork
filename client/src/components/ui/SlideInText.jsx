import { motion } from "framer-motion";

export const SlideInText = ({ text = "", className = "", baseDelay = 0 }) => {
    return (
        <p className={className}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: baseDelay + (i * 0.02), ease: "easeOut" }}
                    className="inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </p>
    );
};
