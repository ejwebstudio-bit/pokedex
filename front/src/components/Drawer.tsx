"use client";
import React, {
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DrawerSide = "top" | "bottom" | "left" | "right";

interface DrawerContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: DrawerSide;
}

interface DrawerProps {
  children?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};

function Drawer ({
  open,
  onOpenChange,
  side = "right",
}:DrawerProps)  {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <DrawerContext.Provider value={{ open, onOpenChange, side }}>
      <AnimatePresence>
        {open && (
          <React.Fragment>
            <DrawerOverlay key="overlay" />
              <DrawerContent key="content">
                <DrawerHeader>
                  <DrawerTitle className="items-start">Mon Profil</DrawerTitle>
                </DrawerHeader>
                <DrawerContentBody />
              </DrawerContent>
          </React.Fragment>
        )}
      </AnimatePresence>
    </DrawerContext.Provider>
  );
};

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  Omit<
    HTMLAttributes<HTMLDivElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  >
>(({ className, ...props }, ref) => {
  const { onOpenChange } = useDrawerContext();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 bg-black/50 dark:bg-black/70 ${className}`}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  Omit<
    HTMLAttributes<HTMLDivElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  >
>(({ className, children, ...props }, ref) => {
  const { onOpenChange, side } = useDrawerContext();

  const sideClasses: Record<DrawerSide, string> = {
    top: "inset-x-0 top-0 w-full h-auto max-h-[80vh] border-b border-gray-200 dark:border-gray-800 items-center",
    bottom:
      "inset-x-0 bottom-0 w-full h-auto max-h-[80vh] border-t border-gray-200 dark:border-gray-800 items-center",
    left: "inset-y-0 left-0 h-full w-80 max-w-[90vw] border-r border-gray-200 dark:border-gray-800 justify-center",
    right:
      "inset-y-0 right-0 h-full w-80 max-w-[90vw] border-l border-gray-200 dark:border-gray-800 justify-center",
  };

  const getMotionProps = () => {
    switch (side) {
      case "top":
        return {
          initial: { y: "-100%" },
          animate: { y: 0 },
          exit: { y: "-100%" },
        };
      case "bottom":
        return {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
        };
      case "left":
        return {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
        };
      case "right":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
        };
      default:
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`fixed z-50 bg-white dark:bg-black text-gray-900 dark:text-gray-50 shadow-lg flex flex-col ${sideClasses[side]} ${className}`}
      {...getMotionProps()}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-3 right-3 rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        aria-label="Close"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`grid gap-1.5 p-6 text-center sm:text-left ${className}`}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-auto flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 ${className}`}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2
        ${
          variant === "outline"
            ? "border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
            : "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
        } 
        ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

function DrawerContentBody() {
  const [activeSection, setActiveSection] = useState<"stats" | "preferences">("stats");

  return (
    <div className="flex flex-col h-full p-6 pt-0">
      {/* Onglets de navigation */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveSection("stats")}
          className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
            activeSection === "stats"
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Statistiques
        </button>
        <button
          onClick={() => setActiveSection("preferences")}
          className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
            activeSection === "preferences"
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Préférences
        </button>
      </div>

      {/* Section Statistiques */}
      {activeSection === "stats" && (
        <div className="space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Pokémons" value="—" icon="🔢" />
            <StatCard label="Équipes" value="—" icon="👥" />
            <StatCard label="Membres" value="—" icon="🧑‍🤝‍🧑" />
            <StatCard label="Complétion" value="—" icon="🏆" />
          </div>
          <p className="text-xs text-gray-400 italic mt-2">
            Les statistiques apparaîtront une fois la fonction Dashboard implémentée.
          </p>
        </div>
      )}

      {/* Section Préférences */}
      {activeSection === "preferences" && (
        <div className="space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Thème sombre</span>
            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
            </div>
          </div>
          <p className="text-xs text-gray-400 italic mt-2">
            Les préférences seront disponibles dans une mise à jour future.
          </p>
        </div>
      )}

      {/* Pied */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Pokédex App v1.0.0
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-800">
      <span className="text-lg">{icon}</span>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-50">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  Button,
};
