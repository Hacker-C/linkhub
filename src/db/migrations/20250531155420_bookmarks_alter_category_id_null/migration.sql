-- category_id nullable
ALTER TABLE "bookmarks" ALTER COLUMN "category_id" DROP NOT NULL;

ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_category_id_fkey";
