import { motion } from "framer-motion";

export const ScaleInText = ({ text = "" }) => {
    const lines = text.split('\n');
    let globalIndex = 0;

    return (
        <h1 className="font-serif text-5xl leading-[1.05] text-[#1a1a1a] sm:text-6xl md:text-7xl lg:text-8xl">
            {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                    {line.split('').map((char) => {
                        const i = globalIndex++;
                        return (
                            <motion.span
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.04, type: 'spring', stiffness: 150, damping: 10 }}
                                className="inline-block"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </h1>
    );
};
