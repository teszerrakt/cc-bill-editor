import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
}

export default function UploadArea({ onFileUpload }: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        onFileUpload(file);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-64 border-2 border-dashed rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary hover:bg-primary/5"
      }`}
    >
      <input {...getInputProps()} />
      <FileUp className="mb-4 text-primary" size={64} />
      <p className="text-sm text-center text-muted-foreground">
        Drop PDF or click to upload
      </p>
    </div>
  );
}
