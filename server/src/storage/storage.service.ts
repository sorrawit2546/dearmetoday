import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_KEY must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
  }

  async uploadBuffer(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    const bucket = process.env.SUPABASE_BUCKET ?? 'positive-notes';

    this.logger.debug(
      `Uploading file: ${fileName} to bucket: ${bucket}, mimetype: ${file.mimetype}`,
    );

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      this.logger.error(`Failed upload to Supabase: ${error.message}`);
      throw error;
    }

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(fileName);

    this.logger.debug(`Public URL: ${data.publicUrl}`);

    return data.publicUrl;
  }
}
