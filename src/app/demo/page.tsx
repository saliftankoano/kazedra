"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import NextImage from "next/image";

export default function Demo() {
  const [topImage, setTopImage] = useState<string | null>(null);
  const [bottomImage, setBottomImage] = useState<string | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const combineImages = async () => {
    const postImg1 = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({
        modelImage: modelImage,
        lowerBodyItem: "pants",
        bottomClothingImage: bottomImage,
        upperBodyItem: "shirt",
        upperClothingImage: topImage,
        bottomPrompt:
          "Realistic photo of a model wearing pants. Don't change face features",
        topPrompt:
          "Realistic photo of a model wearing a shirt. Don't change face features",
      }),
    });
    console.log(postImg1.json());
    if (topImage && bottomImage && modelImage) {
      setIsProcessing(true);
      setProgress(0);
      const newImage = "";
      setProgress(80);
    }
  };

  const resetCombinator = () => {
    setTopImage(null);
    setBottomImage(null);
    setModelImage(null);
    setCombinedImage(null);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Clothing Combinator
      </h1>
      {!combinedImage && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="top-upload">Upload Top</Label>
            <Input
              id="top-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setTopImage)}
            />
          </div>
          <div>
            <Label htmlFor="bottom-upload">Upload Bottom</Label>
            <Input
              id="bottom-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setBottomImage)}
            />
          </div>
          <div>
            <Label htmlFor="model-upload">Upload Model</Label>
            <Input
              id="model-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setModelImage)}
            />
          </div>
          <Button
            className="w-full"
            onClick={combineImages}
            disabled={!topImage || !bottomImage || !modelImage || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Combine Images"
            )}
          </Button>
        </div>
      )}
      {isProcessing && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
        </div>
      )}
      {combinedImage && !isProcessing && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Combined Output</h3>
          <NextImage
            height={200}
            width={200}
            src={combinedImage}
            alt="Combined"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <Button className="w-full" onClick={resetCombinator}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
