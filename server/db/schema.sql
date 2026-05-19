CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  speciality VARCHAR(100) NOT NULL,
  experience_years INT DEFAULT 0,
  hospital VARCHAR(150),
  location VARCHAR(150),
  rating DECIMAL(2,1) DEFAULT 4.0,
  available BOOLEAN DEFAULT TRUE,
  phone VARCHAR(20),
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS ambulances (
  id SERIAL PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL,
  location VARCHAR(150),
  available BOOLEAN DEFAULT TRUE,
  phone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS ambulance_requests (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  pickup_location TEXT NOT NULL,
  ambulance_id INT REFERENCES ambulances(id),
  status VARCHAR(30) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diagnosis_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  symptoms TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
--Seed user--
INSERT INTO users (name, email, password, phone, role)
VALUES (
  'Admin',
  'admin@seva.com',
  '$2b$10$7QJ8xv....',
  '9999999999',
  'admin'
);
-- Seed doctors
INSERT INTO doctors (name, speciality, experience_years, hospital, location, rating, phone) VALUES
('Dr. Arun Sharma', 'Cardiologist', 12, 'Apollo Hospital', 'Mumbai', 4.8, '+91-9876543210'),
('Dr. Priya Nair', 'Dermatologist', 8, 'Fortis Hospital', 'Delhi', 4.6, '+91-9876543211'),
('Dr. Ravi Kumar', 'Neurologist', 15, 'AIIMS', 'Delhi', 4.9, '+91-9876543212'),
('Dr. Sneha Patel', 'Pediatrician', 10, 'Kokilaben Hospital', 'Mumbai', 4.7, '+91-9876543213'),
('Dr. Mohan Rao', 'Orthopedist', 18, 'Manipal Hospital', 'Bangalore', 4.5, '+91-9876543214'),
('Dr. Anita Desai', 'Gynecologist', 14, 'Cloudnine Hospital', 'Bangalore', 4.8, '+91-9876543215'),
('Dr. Vikram Singh', 'General Physician', 6, 'Max Hospital', 'Hyderabad', 4.3, '+91-9876543216'),
('Dr. Kavya Reddy', 'Psychiatrist', 9, 'NIMHANS', 'Bangalore', 4.7, '+91-9876543217'),
('Dr. Suresh Menon', 'Ophthalmologist', 11, 'Sankara Nethralaya', 'Chennai', 4.6, '+91-9876543218'),
('Dr. Divya Krishnan', 'ENT Specialist', 7, 'Medanta', 'Gurgaon', 4.4, '+91-9876543219');

-- Seed ambulances
INSERT INTO ambulances (driver_name, vehicle_number, location, phone) VALUES
('Ramesh Kumar', 'MH-01-AB-1234', 'Mumbai Central', '+91-9800000001'),
('Sunil Verma', 'DL-02-CD-5678', 'Connaught Place, Delhi', '+91-9800000002'),
('Anil Sharma', 'KA-03-EF-9012', 'MG Road, Bangalore', '+91-9800000003'),
('Prakash Nair', 'TN-04-GH-3456', 'Anna Nagar, Chennai', '+91-9800000004'),
('Deepak Rao', 'TS-05-IJ-7890', 'Banjara Hills, Hyderabad', '+91-9800000005');
