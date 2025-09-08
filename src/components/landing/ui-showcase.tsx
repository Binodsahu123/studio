import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const uiImages = [
  { src: "https://picsum.photos/1024/768?random=1", alt: "Dashboard Light Mode", hint: "dashboard lightmode" },
  { src: "https://picsum.photos/1024/768?random=2", alt: "Dashboard Dark Mode", hint: "dashboard darkmode" },
  { src: "https://picsum.photos/1024/768?random=3", alt: "AI Image Generation Workflow", hint: "image generation" },
  { src: "https://picsum.photos/1024/768?random=4", alt: "AI ChatBot Interface", hint: "chatbot interface" },
  { src: "https://picsum.photos/1024/768?random=5", alt: "Templates Dashboard", hint: "templates gallery" },
];

export function UiShowcase() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            Designed for a World-Class User Experience
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Experience our clean, intuitive, and powerful interface, available in both light and dark modes. Every feature is designed to be accessible and easy to use.
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl"
          >
            <CarouselContent>
              {uiImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-2 sm:p-6">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1024}
                        height={768}
                        className="rounded-lg"
                        data-ai-hint={image.hint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex" />
            <CarouselNext className="hidden sm:inline-flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
