import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureCloudinaryConfigured() {
  if (configured) return;
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Variaveis do Cloudinary nao configuradas.");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  configured = true;
}

export async function uploadImageToCloudinary(fileBuffer: Buffer, folder = "bella-aura/products") {
  ensureCloudinaryConfigured();
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Falha ao enviar imagem para Cloudinary."));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );

    stream.end(fileBuffer);
  });
}
