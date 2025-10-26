import React, { useCallback,useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import ClassNames from 'embla-carousel-class-names'
import DOMPurify from 'dompurify'

interface GalleryItem {
  _id: string;
  name: string;
  img_url: string;
  description?: string;
  date?: string;
  category: string;
}

export default function ImageCarousel({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop:false },
    [Autoplay({ delay: 5000 }), WheelGesturesPlugin(), ClassNames({ snapped: 'is-snapped' })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const Description = galleryItems.find((item) => item.description)?.description || ''
  const [showFull, setShowFull] = useState(false);
  return (
    <div className="embla">
      <div className="embla__viewport w-[100vw] sm:w-[90vw]" ref={emblaRef}>
        <div className="embla__container" >
          {galleryItems.map(item => (
            <div
            className="embla__slide relative shrink-0 grow-0 basis-full md:basis-1/3 flex items-center justify-center mx-1"
            key={item._id}
          >
            <img
              className="embla__slide__img w-[100%] h-auto object-cover rounded-xl overflow-hidden"
              src={item.img_url}
              alt={item.name}
            />
          </div>
          
          ))}
        </div>
      </div>
      <div className="nav-btns">
        <button
          className="embla__prev border rounded-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white w-10 h-10 flex items-center justify-center"
          onClick={scrollPrev}>
          <ChevronLeft />
        </button>
        <button
          className="embla__next border rounded-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white w-10 h-10 flex items-center justify-center"
          onClick={scrollNext}>
          <ChevronRight />
        </button>
      </div>
    {Description && (
      <div className="mt-3 text-justify text-black-200 text-sm md:text-base w-[65vw]">
        <p
          className={`${showFull ? 'line-clamp-none' : 'line-clamp-4'} whitespace-pre-line`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Description) }}
        ></p>
        <button
          className="mt-1 text-blue-400 hover:text-blue-300 underline"
          onClick={() => setShowFull((prev) => !prev)}
        >
          {showFull ? 'Show less' : 'Know more'}
        </button>
      </div>
    )}
    </div>
  )
}