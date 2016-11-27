-- CREATE DATABASE ci;
CREATE TABLE items (
  id bigserial,
  json json,
  timestamp timestamp WITH TIME ZONE DEFAULT current_timestamp
);
