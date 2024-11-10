import type { SQL } from "drizzle-orm";
import type { IndexColumn, PgTable } from "drizzle-orm/pg-core";
import type { db } from "./db";

export const insertOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	payload: T["$inferInsert"],
): Promise<T["$inferSelect"]> => {
	const insertedRows = await tx.insert(table).values(payload).returning();
	const insertedRow = insertedRows[0];

	if (!insertedRow) {
		throw new Error(`Failed to insert row into ${table._.name}`);
	}

	return insertedRow;
};

export const upsertOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	payload: T["$inferInsert"],
	conflictTarget: IndexColumn[],
): Promise<T["$inferSelect"]> => {
	const upsertedRows = await tx
		.insert(table)
		.values(payload)
		.onConflictDoUpdate({
			target: conflictTarget,
			set: payload,
		})
		.returning();

	const upsertedRow = upsertedRows[0];

	if (!upsertedRow) {
		throw new Error(`Failed to upsert row into ${table._.name}`);
	}

	return upsertedRow;
};

export const updateOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	where: SQL<unknown>,
	payload: Partial<T["$inferInsert"]>,
): Promise<T["$inferSelect"]> => {
	const updatedRows = await tx.update(table).set(payload).where(where).returning();
	const updatedRow = updatedRows[0];

	if (!updatedRow) {
		throw new Error(`Failed to update row in ${table._.name}`);
	}

	return updatedRow;
};

export const removeOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	where: SQL<unknown>,
): Promise<T["$inferSelect"]> => {
	const deletedRows = await tx.delete(table).where(where).returning();
	const deletedRow = deletedRows[0];

	if (!deletedRow) {
		throw new Error(`Failed to delete row from ${table._.name}`);
	}

	return deletedRow;
};
