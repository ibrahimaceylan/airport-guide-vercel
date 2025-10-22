-- Seed Example User Roles
INSERT INTO User (name, email, password, role)
VALUES
  ('Admin User', 'admin@istanbul-airport.com', 'hashed_password_here', 'ADMIN'),
  ('Editor User', 'editor@istanbul-airport.com', 'hashed_password_here', 'EDITOR'),
  ('Regular User', 'user@istanbul-airport.com', 'hashed_password_here', 'USER');
