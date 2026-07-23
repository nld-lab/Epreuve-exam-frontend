import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import CTA from "@/components/cta";
import {
  MountItem,
  MountStagger,
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import SlideScale from "@/components/customized/carousel/carousel-11";

const steps = [
  {
    icon: Building2,
    title: "Choisissez un pôle",
    description:
      "Sélectionnez le campus où vous étudiez parmi nos implantations.",
  },
  {
    icon: Search,
    title: "Filtrez par filière",
    description:
      "Parcourez les épreuves par filière, année d'étude et session.",
  },
  {
    icon: Download,
    title: "Consultez le sujet",
    description: "Visualisez le PDF ou téléchargez le sujet en un clic.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: poles, isLoading, isError } = usePoles();
  const { data: filieres } = useFilieres();
  const { data: annees } = useAnnees();

  const totalEpreuves =
    poles?.reduce((sum, p) => sum + (p._count?.epreuves ?? 0), 0) ?? 0;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/epreuves?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/epreuves");
    }
  };

  return (
    <div className="space-y-20 pb-8">
      {/* Hero — full bleed */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b">
        <div className="absolute inset-0">
          <img
            src="/hero-image.png"
            alt=""
            className="size-full object-cover brightness-80"
          />
        </div>
        <div
          className="pointer-events-none absolute -top-130 left-100 size-200 -translate-x-1/2 rounded-full bg-white/70 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-32 -right-20 size-64 rounded-full bg-white/70 blur-3xl"
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/60 dark:to-black/60" />

        <div className="relative mx-auto flex min-h-svh w-full max-w-5xl items-center justify-center px-4 pt-20 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20">
          <MountStagger className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 md:gap-8">
            <MountItem className="w-full">
              <div className="mx-auto h-32 w-full max-w-60 sm:h-32 sm:max-w-60 md:h-32 md:max-w-60">
                <img
                  src="/esgis_logo.png"
                  alt="ESGIS"
                  className="size-full object-contain"
                />
              </div>
            </MountItem>

            <MountItem className="w-full">
              <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Retrouvez toutes vos épreuves{" "}
                <span className="text-gradient-primary">d'examens</span>
              </h1>
            </MountItem>

            <MountItem className="w-full">
              <p className="mx-auto max-w-xl text-base text-foreground/80 sm:max-w-2xl sm:text-lg">
                Consultez, recherchez et téléchargez les sujets passés par pôle,
                filière et année d'étude en quelques secondes.
              </p>
            </MountItem>

            <MountItem className="w-full max-w-2xl pt-1 sm:pt-2">
              <form onSubmit={handleSearch} className="w-full" role="search">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <InputGroup className="h-12 flex-1 border-2 border-primary bg-white text-base dark:border-primary dark:bg-white">
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="search"
                      name="q"
                      placeholder="Rechercher par matière, titre..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Rechercher une épreuve"
                    />
                  </InputGroup>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 bg-secondary shadow-lg shadow-primary/20 sm:px-8"
                  >
                    Rechercher
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </MountItem>

            <MountItem className="w-full pt-2 sm:pt-4 space-y-4">
              <SlideScale />
              <div className="mx-auto grid max-w-md grid-cols-3 gap-4 rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm lg:hidden sm:max-w-lg sm:gap-8 sm:p-5">
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-secondary md:text-3xl">
                    {poles?.length ?? "—"}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground sm:text-xs">
                    Pôles
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-secondary md:text-3xl">
                    {filieres?.length ?? "—"}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground sm:text-xs">
                    Filières
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-secondary md:text-3xl">
                    + {totalEpreuves ?? "—"}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground sm:text-xs">
                    Épreuves
                  </p>
                </div>
              </div>
            </MountItem>
          </MountStagger>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="space-y-8 px-4 lg:px-60">
        <Reveal className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Comment ça marche</h2>
          <p className="mt-2 text-muted-foreground">
            Trois étapes pour accéder à vos sujets d'examen
          </p>
        </Reveal>

        <StaggerContainer
          inView
          className="grid md:gap-10 gap-6 md:grid-cols-3"
        >
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <Card className="group relative h-full overflow-hidden border-primary/10 bg-card/50 transition-all hover:border-primary/25 hover:shadow-md hover:shadow-primary/5">
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Pôles */}
      <section className="space-y-6 px-4 lg:px-60 py-20 bg-foreground/10">
        <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 md:text-3xl">
              <Building2 className="size-7 text-primary" />
              Nos pôles
            </h2>
            <p className="mt-1 text-muted-foreground">
              {annees?.length ?? 0} niveaux d'étude · {filieres?.length ?? 0}{" "}
              filières
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/epreuves">
              Voir tout le catalogue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

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
          <StaggerContainer
            inView
            className="grid md:gap-6 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {poles?.map((pole) => (
              <StaggerItem key={pole.id}>
                <Link to={`/poles/${pole.id}`} className="group block h-full">
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
              </StaggerItem>
            ))}
            {poles?.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                Aucun pôle disponible pour le moment.
              </p>
            )}
          </StaggerContainer>
        )}
      </section>

      {/* CTA final */}
      <CTA />
    </div>
  );
}
