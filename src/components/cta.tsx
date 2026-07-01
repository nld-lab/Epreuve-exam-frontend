import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="px-0 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl border-y bg-muted/50 p-1 sm:rounded-xl sm:border-x">
        <div className="sm:shadow/5 relative flex flex-col justify-between gap-0 overflow-hidden border bg-background px-10 sm:rounded-lg md:flex-row md:gap-8">
          {/* Circuit Board - Light Pattern */}
          <div
            className="max-sm:mask-b-from-75% pointer-events-none absolute inset-0 -top-0.5 -left-1 z-0 not-dark:opacity-60"
            style={{
              backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
              backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
            }}
          />

          <div className="relative isolate pt-12 pb-0 md:pb-12">
            <h2 className="font-medium text-4xl tracking-[-0.04em] lg:text-5xl/[1.2]">
              Accédez à vos sujets d'examen
            </h2>
            <p className="mt-2 text-muted-foreground text-xl tracking-[-0.015em] sm:mt-4 ">
              Accédez à vos sujets d'examen passés en quelques clics.
            </p>
            <Button className="mt-5 sm:mt-10" size="lg">
              Explorer les sujets <ArrowUpRight />
            </Button>
          </div>
          <img
            alt="mobile view of the app"
            className="mask-b-from-75% relative isolate mt-auto max-w-xs md:h-75 md:w-auto md:max-w-none"
            src="/mobile.png"
          />
        </div>
      </div>
    </div>
  );
};

export default CTA;
