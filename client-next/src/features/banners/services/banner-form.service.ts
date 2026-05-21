import type { Banner } from "@/types/models";
import type { BannerFormValues } from "@/features/banners/schemas";

export function mapBannerToFormValues(initialData: Banner | any) {
  return {
    title: initialData.title || "",
    link: initialData.link || "",
    displayOrder: initialData.displayOrder || initialData.order || 0,
    isActive: initialData.isActive ?? true,
  };
}

export function mapBannerFormToFormData(
  values: BannerFormValues,
  selectedFile: File | null
) {
  const formData = new FormData();

  formData.append("title", values.title);
  if (values.link) formData.append("link", values.link);
  formData.append("displayOrder", String(values.displayOrder));
  formData.append("isActive", String(values.isActive));

  if (selectedFile) {
    formData.append("image", selectedFile);
  }

  return formData;
}
