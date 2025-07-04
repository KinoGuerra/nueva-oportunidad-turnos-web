-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the function to run every hour to cancel expired appointments
-- This will call the edge function to cancel appointments older than 24 hours
SELECT cron.schedule(
  'cancel-expired-appointments',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://kfwxlqtybutiwtffjuky.supabase.co/functions/v1/cancel-expired-appointments',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmd3hscXR5YnV0aXdmdGZqdWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTYyNjcsImV4cCI6MjA2Njk3MjI2N30.IankYuGWAA34xUkuYzo1wyyICy_r8n8IWEGccPSJ114"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);