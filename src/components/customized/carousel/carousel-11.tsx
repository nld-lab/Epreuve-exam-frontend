"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Togo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Benin.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/langfr-250px-Flag_of_Gabon.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Togo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/langfr-250px-Flag_of_Gabon.svg.png",
];

export default function SlideScale() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  console.log("current :", current);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto hidden w-full max-w-2xl md:block">
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent className="py-1">
          {images.map((image, index) => (
            <CarouselItem
              className={cn("h-26 w-40 basis-[33%] ", {})}
              key={image}
            >
              <img
                alt="dddepth-248"
                className={cn(
                  "size-full object-contain transition-transform",
                  {
                    "scale-[0.6]": index !== current - 1,
                  }
                )}
                src={image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
