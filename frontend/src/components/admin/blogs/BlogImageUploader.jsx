"use client";

import { useRef, useState } from "react";

import { ImageIcon, LoaderCircle, Trash2, UploadCloud } from "lucide-react";

import { toast } from "sonner";

import API from "@/lib/api";

export default function BlogImageUploader({
  imageUrl = "",
  imageAlt = "",
  onImageChange,
  onAltChange,
}) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [dragging, setDragging] = useState(false);

  async function uploadFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");

      return;
    }

    const maxSize = 8 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size cannot exceed 8 MB.");

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      formData.append("type", "blog");

      const response = await API.post("/api/uploads/single", formData);

      const uploadedFile = response.data?.data?.file;

      if (!uploadedFile?.url) {
        throw new Error("Uploaded image URL was not returned.");
      }

      onImageChange(uploadedFile.url);

      toast.success("Blog image uploaded successfully.");
    } catch (error) {
      console.error("Blog image upload failed:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to upload image.";

      toast.error(message);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    uploadFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    uploadFile(file);
  }

  function removeImage() {
    onImageChange("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-5">
      {/* Local upload */}

      <div>
        <span className="text-sm font-bold text-foreground">
          Featured image
        </span>

        <p className="mt-1 text-xs leading-5 text-muted">
          Upload an image from your computer. It will be stored securely in
          Cloudinary.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDragOver={(event) => {
            event.preventDefault();

            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            mt-3
            rounded-2xl
            border-2
            border-dashed
            p-6
            text-center
            transition
            ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-background"
            }
          `}
        >
          <div
            className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
            text-primary
            "
          >
            {uploading ? (
              <LoaderCircle size={23} className="animate-spin" />
            ) : (
              <UploadCloud size={23} />
            )}
          </div>

          <p className="mt-3 text-sm font-bold text-foreground">
            {uploading
              ? "Uploading image..."
              : "Drop image here or choose from your computer"}
          </p>

          <p className="mt-1 text-xs text-muted">JPG, JPEG, PNG or WEBP</p>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="
            mt-4
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            text-sm
            font-bold
            text-white
            transition
            hover:bg-primary-hover
            disabled:cursor-not-allowed
            disabled:opacity-60
            "
          >
            {uploading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                Choose Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* URL */}

      <label className="block">
        <span className="text-sm font-bold text-foreground">Image URL</span>

        <input
          type="text"
          value={imageUrl}
          onChange={(event) => onImageChange(event.target.value)}
          placeholder="Uploaded Cloudinary URL will appear here"
          className="
          mt-2
          min-h-11
          w-full
          rounded-xl
          border
          border-border
          bg-background
          px-3
          text-sm
          text-foreground
          outline-none
          placeholder:text-muted
          focus:border-primary
          "
        />

        <p className="mt-1.5 text-xs text-muted">
          You can upload a local image or manually enter an image URL.
        </p>
      </label>

      {/* Alt */}

      <label className="block">
        <span className="text-sm font-bold text-foreground">
          Image alternative text
        </span>

        <input
          type="text"
          value={imageAlt}
          onChange={(event) => onAltChange(event.target.value)}
          placeholder="Example: International student studying in Italy"
          className="
          mt-2
          min-h-11
          w-full
          rounded-xl
          border
          border-border
          bg-background
          px-3
          text-sm
          text-foreground
          outline-none
          placeholder:text-muted
          focus:border-primary
          "
        />
      </label>

      {/* Preview */}

      <div
        className="
        relative
        aspect-16/8
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-background
        "
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={imageAlt || "Featured image preview"}
              className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              "
            />

            <div
              className="
              absolute
              inset-x-0
              bottom-0
              flex
              items-center
              justify-between
              gap-3
              bg-linear-to-t
              from-black/70
              to-transparent
              p-4
              pt-12
              "
            >
              <div>
                <p className="text-sm font-bold text-white">Featured image</p>

                <p className="mt-0.5 text-xs text-white/70">
                  This image will be displayed on blog cards and the blog detail
                  page.
                </p>
              </div>

              <button
                type="button"
                onClick={removeImage}
                className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-500
                text-white
                transition
                hover:bg-red-600
                "
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <div
            className="
            absolute
            inset-0
            grid
            place-items-center
            text-center
            "
          >
            <div>
              <ImageIcon
                size={38}
                className="
                mx-auto
                text-muted/50
                "
              />

              <p className="mt-2 text-xs font-semibold text-muted">
                Image preview
              </p>

              <p className="mt-1 text-[11px] text-muted">
                Upload an image to see it here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
