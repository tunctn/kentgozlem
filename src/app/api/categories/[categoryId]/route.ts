import { apiRoute } from "@/lib/server";
import { deleteCategory } from "@/server/categories/delete-category";
import { getCategory } from "@/server/categories/get-category";
import { updateCategory, updateCategorySchema } from "@/server/categories/update-category";
import { NextResponse } from "next/server";
import { z } from "zod";

const CategoryIdSchema = z.object({ categoryId: z.string() });

export const GET = apiRoute({
	params: CategoryIdSchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await getCategory({
		id: req.params.categoryId,
		user,
	});
	return NextResponse.json(result);
});

export const DELETE = apiRoute({
	params: CategoryIdSchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await deleteCategory({
		payload: { id: req.params.categoryId },
		user,
	});
	return NextResponse.json(result);
});

export const PATCH = apiRoute({
	params: CategoryIdSchema,
	body: updateCategorySchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await updateCategory({
		id: req.params.categoryId,
		category: req.body,
		user,
	});
	return NextResponse.json(result);
});
