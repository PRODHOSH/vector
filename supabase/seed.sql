DO $$
DECLARE
  target_user_id uuid;
  user_email text := 'prodhosh8cpal@gmail.com';
BEGIN
  -- Find the user ID based on email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NOT NULL THEN
    -- Check if profile exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
      INSERT INTO public.profiles (id, full_name, avatar_url)
      VALUES (target_user_id, 'Prodhosh V S', '');
      RAISE NOTICE 'Created missing profile for user.';
    END IF;

    -- Insert sample tasks
    INSERT INTO public.tasks (user_id, title, description, status, priority, due_date)
    VALUES
      (target_user_id, 'Finish Calculus Assignment', 'Complete chapters 4 and 5 problems from the textbook.', 'todo', 'high', now() + interval '2 days'),
      (target_user_id, 'Read Literature essay', 'Read "The Great Gatsby" chapters 1-3.', 'in_progress', 'medium', now() + interval '4 days'),
      (target_user_id, 'Submit CS Project', 'Finalize the React application and deploy to Vercel.', 'done', 'high', now() - interval '1 day'),
      (target_user_id, 'Schedule study group', 'Find a time for the physics study group to meet.', 'todo', 'low', now() + interval '7 days');
      
    RAISE NOTICE 'Successfully seeded tasks for %', user_email;
  ELSE
    RAISE NOTICE 'User with email % not found.', user_email;
  END IF;
END $$;
