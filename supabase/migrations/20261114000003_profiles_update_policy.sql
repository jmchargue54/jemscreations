-- Allow signed-in users to update only their own profile row.
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
