import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImage {
  image_url: string;
  alt_text?: string | null;
  position: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  discount?: number;
  isDigital?: boolean;
}

export const ProductGallery = ({
  images,
  productName,
  discount = 0,
  isDigital = false,
}: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const currentImage = sortedImages[selectedIndex] || {
    image_url: "/placeholder.svg",
    alt_text: productName,
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg border group">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          className="object-cover w-full h-full transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {isDigital && (
            <Badge className="bg-primary text-primary-foreground">
              Dijital
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-lg px-3 py-1 ml-auto">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Navigation Arrows (show when multiple images) */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {sortedImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square relative overflow-hidden rounded-md border-2 transition-all ${
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
