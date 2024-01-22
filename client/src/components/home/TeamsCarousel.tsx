
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import MaxWidthWrapper from "../MaxWidthWrapper"

import Autoplay from "embla-carousel-autoplay"
import Heading from "../Heading"


export function TeamsCarousel() {
  return (
    <MaxWidthWrapper>
      <Heading heading="Teams" />
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="sm:w-full w-56 mx-auto"
      >
        <CarouselContent>
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/6 sm:basis-1/3 basis-1/2">
              <div >
                <Card >
                  <CardContent className="flex aspect-square items-center justify-center p-0 object-contain">
                    <img src="https://punekabaddiassociation.com/wp-content/uploads/2023/09/38afcff0-e84b-4704-8938-e9b917df10f4.jpeg" alt="team-logo" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </MaxWidthWrapper>
  )
}
