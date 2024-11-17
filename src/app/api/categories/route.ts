import { db } from "@/db";
import { apiRoute } from "@/lib/server";
import { createCategory } from "@/server/categories/create-category";
import { getCategories } from "@/server/categories/get-categories";
import { createCategorySchema } from "@/zod-schemas/categories";
import { NextResponse } from "next/server";

export const GET = apiRoute({}).protected(async (req) => {
	const user = req.user;
	const result = await getCategories({
		user,
	});
	return NextResponse.json(result);
});

export const POST = apiRoute({
	body: createCategorySchema,
}).protected(async (req) => {
	const user = req.user;
	const result = await createCategory({ tx: db, user, category: req.body });
	return NextResponse.json(result);
});
