-- Function to safely deduct credits
create or replace function deduct_credits(user_uuid uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set 
    credits = credits - amount,
    credits_used = coalesce(credits_used, 0) + amount
  where id = user_uuid;
end;
$$;
