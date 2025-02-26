"use client"

import { useEffect, useState } from "react";
import { CldUploadButton } from 'next-cloudinary';
import Image from "next/image";

interface ImageUploadProps {
    value: string,
    onChange: (src: string) => void;
    disabled?: boolean;
};


const Image_upload = ({
    value,
    onChange,
    disabled
}: ImageUploadProps) => {


    const [isMounted, setMount] = useState(false);

    useEffect(()=>{
        setMount(true);
    }, [])

    if (!isMounted){
        return null;
    }

    console.log("Image value is ", value)

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
      
      options={{
        maxFiles: 1
      }}
      uploadPreset="witcher"
      onSuccess={(result: any) => {
        console.log("Upload result:", result);
        
        const uploadedUrl = result?.info?.secure_url; // Ensure it's extracting the correct URL
        if (uploadedUrl) {
          onChange(uploadedUrl);
        } else {
          console.error("Upload failed: No valid URL received.");
        }
      }}
      >
            <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                    <div className="relative h-40 w-40">
                        <Image 
                        fill
                        alt="Upload"
                        src={value || "/place2.svg"}
                        className="rounded-lg object-cover"
                        /> 

                    </div>
            </div>
      </CldUploadButton>
    </div>
  )
}

export default Image_upload
