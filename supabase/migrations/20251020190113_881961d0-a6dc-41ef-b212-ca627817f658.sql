-- Update DISC test metadata
UPDATE tests 
SET 
  questions_count = 6, 
  estimated_minutes = 5,
  description = 'Descubra seu perfil comportamental e compreenda como o mundo percebe sua energia. Este teste revela o equilíbrio entre suas tendências de ação, influência, estabilidade e precisão.'
WHERE type = 'disc';