ALTER TABLE public.addresses
ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS addresses_one_default_per_user
ON public.addresses (user_id)
WHERE is_default IS TRUE;
