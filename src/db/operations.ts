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
	try {
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
	} catch (error) {
		throw new Error(`Failed to upsert row into ${table._.name}`);
	}
};

export const updateOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	where: SQL<unknown>,
	payload: Partial<T["$inferInsert"]>,
): Promise<T["$inferSelect"]> => {
	try {
		const updatedRows = await tx.update(table).set(payload).where(where).returning();
		const updatedRow = (updatedRows as T["$inferSelect"][])[0];
		if (!updatedRow) {
			throw new Error(`Failed to update row in ${table._.name}`);
		}
		return updatedRow;
	} catch (error) {
		throw new Error(`Failed to update row in ${table._.name}`);
	}
};

export const removeOne = async <T extends PgTable>(
	tx: typeof db,
	table: T,
	where: SQL<unknown>,
): Promise<T["$inferSelect"]> => {
	try {
		const deletedRows = await tx.delete(table).where(where).returning();
		const deletedRow = deletedRows[0];

		return deletedRow;
	} catch (error) {
		throw new Error(`Failed to delete row from ${table._.name}`);
	}
};
