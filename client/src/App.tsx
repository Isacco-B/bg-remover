/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Compare } from "./components/ui/compare";
import { FileUpload } from "./components/ui/file-upload";
import { useToast } from "./hooks/use-toast";
import { Button } from "./components/ui/button";
import { useConfetti } from "./hooks/use-confetti";
import axios from "axios";
import BlurIn from "./components/ui/blur-in";
import Img1 from "./assets/original.jpg";
import Img2 from "./assets/result.png";
import LoadingSkeleton from "./components/LoadingSkeleton";
import LoadingImage from "./components/LoadingImage";

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const triggerConfetti = useConfetti();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setImage(null);
      setResultImage(null);
      setImagePreview(null);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImagePreview(e.target?.result as string);
        setImage(file);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!image) return;
    handleSubmit();
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
        description: response.data.message || "Your image has been processed.",
      });
      triggerConfetti();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.response?.data?.message ||
            "There was a problem with your request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-4 md:gap-8">
        <LoadingImage image={imagePreview || Img1} />
        <div className="w-full md:max-w-2xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!isLoading && resultImage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full max-w-2xl">
        <img
          src={resultImage}
          className="object-contain w-full max-h-[500px] md:max-h-[600px] md:max-w-[700px]"
        />
        <p className="font-poppins text-lg md:text-xl text-center text-neutral-700 dark:dark:text-neutral-200">
          <strong>Success!</strong> Your background has been removed.{" "}
          <strong>Click</strong> the button below to <strong>download</strong>{" "}
          your image. If you're satisfied with the result, feel free to share it
          or try editing another image!
        </p>
        <div className="flex flex-col gap-4 md:gap-6 md:flex-row items-center justify-center w-full">
          <Button
            className="w-full font-poppins font-semibold text-lg"
            onClick={() => {
              const a = document.createElement("a");
              a.href = resultImage || "";
              a.download = "remove-bg.png";
              a.click();
            }}
          >
            Download
          </Button>
          <Button
            className="w-full font-poppins font-semibold text-neutral-600 dark:dark:text-neutral-300 text-lg"
            variant="outline"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
              setResultImage(null);
            }}
          >
            Upload new image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
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
              className="font-poppins font-bold text-neutral-700 dark:dark:text-neutral-200 m-0 text-4xl md:text-5xl lg:text-6xl text-center md:!text-left"
            />
            <p className="font-poppins font-normal text-neutral-400 dark:dark:text-neutral-300 text-xl m-0 !text-typo text-center md:!text-left">
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
