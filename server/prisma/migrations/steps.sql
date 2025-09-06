-- 1) เพิ่มคอลัมน์คะแนน (อนุโลมให้เป็น NULL ชั่วคราวเพื่อ backfill)
ALTER TABLE "entries" ADD COLUMN "mood_score" smallint;

-- 2) Backfill จาก enum Mood (ค่าพิมพ์เล็ก)
UPDATE "entries"
SET "mood_score" = CASE "mood"
  WHEN 'happy'::"Mood"   THEN  2
  WHEN 'calm'::"Mood"    THEN  1
  WHEN 'neutral'::"Mood" THEN  0
  WHEN 'tired'::"Mood"   THEN -1
  WHEN 'sad'::"Mood"     THEN -2
  ELSE 0
END
WHERE "mood_score" IS NULL;

-- 3) บังคับต้องมีค่า + จำกัดช่วง -2..+2
ALTER TABLE "entries" ALTER COLUMN "mood_score" SET NOT NULL;

ALTER TABLE "entries" ADD CONSTRAINT "entries_mood_score_range"
CHECK ("mood_score" BETWEEN -2 AND 2);

-- 4) ดัชนีผู้ใช้+เวลา (ถ้ายังไม่มี)
CREATE INDEX IF NOT EXISTS "entries_user_created_idx"
  ON "entries" ("user_id", "created_at");
