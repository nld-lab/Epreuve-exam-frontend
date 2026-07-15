import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  defaultTransition,
  fadeIn,
  fadeUp,
  pageTransition,
  scaleIn,
  slideFromLeft,
  slideFromRight,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

type MotionDivProps = Omit<ComponentProps<typeof motion.div>, "children"> & {
  children?: ReactNode;
};

type RevealDirection = "up" | "down" | "left" | "right" | "none" | "scale";

const directionVariants: Record<
  RevealDirection,
  typeof fadeUp | typeof fadeIn | typeof scaleIn | typeof slideFromLeft | typeof slideFromRight
> = {
  up: fadeUp,
  down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  left: slideFromLeft,
  right: slideFromRight,
  none: fadeIn,
  scale: scaleIn,
};

export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

type RevealProps = MotionDivProps & {
  direction?: RevealDirection;
  delay?: number;
  inView?: boolean;
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  inView = true,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const variants = directionVariants[direction];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (inView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={variants}
        transition={{ ...defaultTransition, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ ...defaultTransition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerContainerProps = MotionDivProps & {
  /** Si true, anime au scroll. Defaut false : anime au mount (fiable pour les listes async). */
  inView?: boolean;
};

export function StaggerContainer({
  children,
  className,
  inView = false,
  ...props
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // whileInView + donnees async = risque d'elements bloques a opacity: 0
  // si l'IntersectionObserver rate le mount. Preferer animate au mount.
  if (inView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

export function MountStagger({
  children,
  className,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MountItem({ children, className, ...props }: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}
