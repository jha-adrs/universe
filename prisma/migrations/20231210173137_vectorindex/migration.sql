-- CreateIndex
--CREATE INDEX "Documents_embeddings_idx" ON "Documents"("embeddings");
CREATE INDEX "Documents_embeddings_idx" ON "Documents" USING ivfflat (embeddings vector_cosine_ops);