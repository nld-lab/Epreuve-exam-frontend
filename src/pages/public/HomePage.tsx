import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Download,
  FileText,
  MapPin,
  Search,

} from "lucide-react";
import { useAnnees, useFilieres, usePoles } from "@/hooks/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CTA from "@/components/cta";

const steps = [
  {
    icon: Building2,
    title: "Choisissez un pôle",
    description: "Sélectionnez le campus où vous étudiez parmi nos implantations.",
  },
  {
    icon: Search,
    title: "Filtrez par filière",
    description: "Parcourez les épreuves par filière, année d'étude et session.",
  },
  {
    icon: Download,
    title: "Consultez le PDF",
    description: "Visualisez ou téléchargez le sujet en un clic.",
  },
];

export function HomePage() {
  const { data: poles, isLoading, isError } = usePoles();
  const { data: filieres } = useFilieres();
  const { data: annees } = useAnnees();

  const totalEpreuves =
    poles?.reduce((sum, p) => sum + (p._count?.epreuves ?? 0), 0) ?? 0;

  return (
    <div className="space-y-20 pb-8">
      {/* Hero — full bleed avec grid pattern */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-fade" aria-hidden />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-32 -right-20 size-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-16 md:px-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Retrouvez toutes vos{" "}
              <span className="text-gradient-primary">épreuves d'examens</span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              Consultez, recherchez et téléchargez les sujets passés par pôle,
              filière et année d'étude — en quelques secondes.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-w-44 shadow-lg shadow-primary/20">
                <Link to="/epreuves">
                  Explorer les épreuves
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-44">
                <Link to="/epreuves">Rechercher un sujet</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { value: poles?.length ?? "—", label: "Pôles" },
              { value: filieres?.length ?? "—", label: "Filières" },
              { value: totalEpreuves, label: "Épreuves" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-primary/10 bg-card/60 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Comment ça marche</h2>
          <p className="mt-2 text-muted-foreground">
            Trois étapes pour accéder à vos sujets d'examen
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card
              key={step.title}
              className="group relative overflow-hidden border-primary/10 bg-card/50 transition-all hover:border-primary/25 hover:shadow-md hover:shadow-primary/5"
            >
              <div className="absolute -right-4 -top-4 text-7xl font-black text-primary/5 select-none">
                {i + 1}
              </div>
              <CardContent className="relative space-y-3 pt-6">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pôles */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 md:text-3xl">
              <Building2 className="size-7 text-primary" />
              Nos pôles
            </h2>
            <p className="mt-1 text-muted-foreground">
              {annees?.length ?? 0} niveaux d'étude · {filieres?.length ?? 0} filières
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/epreuves">
              Voir tout le catalogue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {isError && (
          <p className="text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            Impossible de charger les pôles. Vérifiez que l'API est démarrée.
          </p>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {poles?.map((pole) => (
              <Link key={pole.id} to={`/poles/${pole.id}`} className="group">
                <Card className="h-full overflow-hidden border-primary/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                  <div className="h-1 bg-linear-to-r from-primary/80 via-primary to-primary/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardContent className="space-y-3 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {pole.nom}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-1 border-primary/10 bg-primary/5 text-primary"
                      >
                        <MapPin className="size-3" />
                        {pole.pays}
                      </Badge>
                    </div>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="size-4 text-primary/70" />
                      {pole._count?.epreuves ?? 0} épreuve(s) disponible(s)
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {poles?.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                Aucun pôle disponible pour le moment.
              </p>
            )}
          </div>
        )}
      </section>

      {/* CTA final */}
      <CTA />
    </div>
  );
}
