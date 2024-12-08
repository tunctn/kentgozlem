import { uploadImage } from "@/server/storage/upload";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
	return useMutation({
		mutationFn: uploadImage,
	});
};
