/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Compare } from "./components/ui/compare";
import { FileUpload } from "./components/ui/file-upload";
import { useToast } from "./hooks/use-toast";
import { Button } from "./components/ui/button";
import axios from "axios";
import BlurIn from "./components/ui/blur-in";
import Img1 from "./assets/original.jpg";
import Img2 from "./assets/result.png";
import FlickeringGrid from "./components/ui/flickering-grid";

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setImage(file);
  };

  useEffect(() => {
    if (!image) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const handleSubmit = async () => {
    if (!image) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select an image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/remove-background",
        formData
      );
      setResultImage(response.data.resultImage);
      toast({
        title: "Success!",
        description: "Your image has been processed.",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4 md:gap-4">
        <div className="relative w-full rounded-2xl max-w-[420px] h-[620px] overflow-hidden border">
          <img src={Img1} className="w-full h-full object-cover" />
          <FlickeringGrid
            className="z-0 absolute inset-0 size-full"
            squareSize={4}
            gridGap={4}
            color="#6B7280"
            maxOpacity={0.8}
            flickerChance={0.1}
            height={620}
            width={420}
          />
        </div>
        <div className="w-full md:max-w-sm space-y-4">
          <Button
            className="w-full font-poppins font-semibold text-neutral-600 text-lg"
            variant="outline"
            disabled
          >
            Upload new image
          </Button>
          <Button
            className="w-full font-poppins font-semibold text-lg"
            disabled
          >
            Download
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && resultImage) {
    return (
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4 md:gap-4">
        <div className="w-full md:max-w-2xl lg:max-w-lg">
          <Compare
            firstImage={Img1}
            secondImage={Img2}
            firstImageClassName="object-cover"
            secondImageClassname="object-cover"
            className="rounded-2xl w-[420px] h-[620px]"
            slideMode="hover"
            autoplay
            autoplayDuration={5000}
          />
        </div>
        <div className="w-full md:max-w-sm space-y-4">
          <Button
            className="w-full font-poppins font-semibold text-neutral-600 text-lg"
            variant="outline"
            onClick={() => {
              setImage(null);
              setResultImage(null);
            }}
          >
            Upload new image
          </Button>
          <a href={resultImage} download="result.webp">
            <Button className="w-full font-poppins font-semibold text-lg">
              Download
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <svg
        width="184"
        height="192"
        viewBox="0 0 184 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-neutral-500 absolute hidden lg:block top-[100px] right-[250px] transition ease-in-out transform-gpu"
      >
        <path
          d="M182.648 183.128C178.597 187.405 171.028 191.799 163.237 191.977C157.571 192.103 152.323 190.012 148.058 185.927C139.232 177.468 138.372 158.735 137.621 142.22C137.204 133.157 136.747 122.877 134.696 119.768C131.836 115.376 124.509 108.471 107.735 111.458C94.4152 113.834 81.7884 115.329 73.6959 107.665C64.5031 98.9588 66.3544 85.5644 68.5325 76.244C69.271 73.0119 70.4408 69.8949 72.0105 66.9765C67.2371 63.1964 63.8062 58.7353 62.4015 54.3978C60.8072 49.4882 61.1485 43.5448 61.4696 37.8066C61.9457 29.5112 62.3974 21.6751 57.4255 18.3185C52.9599 15.3123 37.4838 14.4287 30.2947 16.7929C23.7769 18.9234 13.5899 18.9589 1.99423 6.93367C1.6401 6.5666 1.36158 6.13357 1.17454 5.65932C0.987495 5.18506 0.895589 4.67887 0.904109 4.16963C0.912629 3.66038 1.02138 3.15807 1.22417 2.69136C1.42696 2.22466 1.71981 1.80269 2.086 1.44957C2.45218 1.09646 2.88452 0.819116 3.35835 0.63335C3.83218 0.447587 4.33822 0.357049 4.84756 0.366916C5.3569 0.376784 5.85958 0.486848 6.32689 0.690842C6.7942 0.894836 7.21699 1.18879 7.57112 1.55585C12.4264 6.59173 19.8904 12.0448 27.8628 9.42376C35.8352 6.80273 54.2649 6.8425 61.7549 11.8939C70.3895 17.7206 69.7629 28.6339 69.2095 38.2642C68.9095 43.5287 68.6214 48.5014 69.7664 52.0262C70.775 55.1189 73.3834 58.1558 76.531 60.6768C76.9819 60.2006 77.4049 59.754 77.8356 59.3765C82.0627 55.4357 86.9774 53.4477 91.2962 53.9361C96.6192 54.5284 100.113 58.7801 100.195 64.7704C100.25 70.0573 97.3594 73.7039 92.4487 74.5175C88.6575 75.1291 83.6402 73.9231 78.5462 71.2419C77.4414 73.3904 76.607 75.6679 76.0619 78.0227C73.2511 90.0426 74.1576 97.4483 79.0031 102.037C84.4653 107.21 95.0526 105.831 106.352 103.814C122.037 101.019 134.401 105.177 141.174 115.524C144.395 120.438 144.815 129.89 145.362 141.875C146.018 156.197 146.832 174.017 153.401 180.345C156.233 183.027 159.368 184.313 163.024 184.23C168.933 184.098 174.615 180.307 176.996 177.793C177.702 177.048 178.675 176.614 179.703 176.588C180.73 176.561 181.727 176.944 182.474 177.651C183.221 178.359 183.657 179.333 183.687 180.361C183.716 181.388 183.336 182.384 182.63 183.129L182.648 183.128ZM83.3056 64.9216C86.4005 66.4052 89.3016 67.1611 91.1914 66.8526C91.9094 66.7359 92.4752 66.6434 92.4525 64.8379C92.4131 61.8384 91.0498 61.6861 90.4681 61.6233C88.7028 61.4381 85.9689 62.5013 83.2972 64.9304L83.3056 64.9216Z"
          fill="currentColor"
        ></path>
      </svg>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center md:gap-4">
        <div className="flex flex-col md:flex-row lg:flex-col items-center lg:items-start gap-6 md:gap-8 md:max-w-2xl lg:max-w-lg">
          <Compare
            firstImage={Img1}
            secondImage={Img2}
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="w-full h-[300px] lg:h-[420px] rounded-4xl max-w-[320px] lg:max-w-[420px]"
            slideMode="hover"
            autoplay
            autoplayDuration={5000}
          />
          <div className="flex flex-col gap-4">
            <BlurIn
              word="Remove Image Background"
              className="font-poppins font-bold text-neutral-700 m-0 text-4xl md:text-5xl lg:text-6xl text-center md:!text-left"
            />
            <p className="font-poppins font-normal text-neutral-400 text-xl m-0 !text-typo text-center md:!text-left">
              100% Automatically and
              <span className="font-bold text-2xl ml-2">Free</span>
            </p>
          </div>
        </div>
        <div className="max-w-md mt-8 md:mt-28 shadow-xl shadow-stone-900/10 border rounded-2xl">
          <FileUpload onChange={handleImageUpload} />
        </div>
      </div>
    </div>
  );
};

export default App;
