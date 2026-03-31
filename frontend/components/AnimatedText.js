'use client';
import { motion } from 'framer-motion';

export const AnimatedText = ({ text, className, delay = 0 }) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.07, 
        delayChildren: delay 
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 80,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 80,
      },
    },
  };

  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', paddingTop: '0.2em' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -100px 0px' }}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ 
          display: 'inline-block', 
          position: 'relative', 
          // removed overflow hidden to stop any clipping 
          lineHeight: '1.4',
          marginRight: '0.25em',
          verticalAlign: 'bottom'
        }}>
          <motion.span
            variants={child}
            style={{ 
              display: 'inline-block', 
              lineHeight: 'inherit'
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};
