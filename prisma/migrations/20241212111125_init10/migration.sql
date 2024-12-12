-- AddForeignKey
ALTER TABLE "PermanentSessionOrder" ADD CONSTRAINT "PermanentSessionOrder_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
