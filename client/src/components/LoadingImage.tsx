import FlickeringGrid from "./ui/flickering-grid";

type LoadingImageProps = {
  image: string;
  className?: string;
};
function LoadingImage({ image, className }: LoadingImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src={image}
        className="object-cover object-left-top w-full max-h-[500px] md:max-h-[600px] md:max-w-[700px]"
      />
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={4}
        gridGap={4}
        color="#6B7280"
        maxOpacity={0.8}
        flickerChance={0.1}
        height={1000}
        width={1000}
      />
    </div>
  );
}

export default LoadingImage;
