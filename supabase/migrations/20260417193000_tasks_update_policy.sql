ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_update_own_project" ON tasks;
CREATE POLICY "tasks_update_own_project"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM milestones m
      JOIN projects p ON p.id = m.project_id
      WHERE m.id = tasks.milestone_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM milestones m
      JOIN projects p ON p.id = m.project_id
      WHERE m.id = tasks.milestone_id
        AND p.user_id = auth.uid()
    )
  );
