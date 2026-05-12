import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Branch from '../models/Branch.js';
import Job from '../models/Job.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Job.deleteMany({});

    console.log('Cleared existing data');

    // Seed branches
    const branches = await Branch.insertMany([
      {
        name: 'Islamabad',
        city: 'Islamabad',
        country: 'Pakistan',
        address: '123 Main St, Islamabad',
        contactPerson: 'Ali Khan',
        email: 'islamabad@company.com',
        phone: '+92-51-XXXXXXX',
      },
      {
        name: 'Lahore',
        city: 'Lahore',
        country: 'Pakistan',
        address: '456 Main St, Lahore',
        contactPerson: 'Sara Ahmed',
        email: 'lahore@company.com',
        phone: '+92-42-XXXXXXX',
      },
      {
        name: 'Karachi',
        city: 'Karachi',
        country: 'Pakistan',
        address: '789 Main St, Karachi',
        contactPerson: 'Hassan Raza',
        email: 'karachi@company.com',
        phone: '+92-21-XXXXXXX',
      },
      {
        name: 'Remote',
        city: 'Remote',
        country: 'Pakistan',
        address: 'Online',
        contactPerson: 'Admin',
        email: 'remote@company.com',
        phone: '+92-XXX-XXXXXXX',
      },
    ]);

    console.log('Branches seeded:', branches.length);

    // Seed admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      phone: '+92-300-1234567',
    });

    console.log('Admin user created');

    // Seed HR users
    const hr1 = await User.create({
      firstName: 'HR',
      lastName: 'Manager',
      email: 'hr@company.com',
      password: 'hr123',
      role: 'hr',
      phone: '+92-300-2345678',
      branch: branches[0]._id,
    });

    console.log('HR user created');

    // Seed candidate users
    const candidate1 = await User.create({
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+92-300-9876543',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: '3',
    });

    const candidate2 = await User.create({
      firstName: 'Fatima',
      lastName: 'Khan',
      email: 'fatima@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+92-300-8765432',
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: '2',
    });

    console.log('Candidate users created');

    // Seed jobs
    const jobs = await Job.insertMany([
      {
        title: 'Frontend Developer',
        description: 'We are looking for an experienced Frontend Developer...',
        department: 'Engineering',
        branch: branches[0]._id,
        salaryMin: 80000,
        salaryMax: 120000,
        experience: '2-3 years',
        employmentType: 'Full-time',
        availableSeats: 2,
        requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
        responsibilities: ['Build responsive UIs', 'Optimize performance', 'Code review'],
        benefits: ['Health insurance', 'Professional development'],
        createdBy: hr1._id,
      },
      {
        title: 'Backend Developer',
        description: 'Looking for a Backend Developer with Node.js expertise...',
        department: 'Engineering',
        branch: branches[1]._id,
        salaryMin: 100000,
        salaryMax: 150000,
        experience: '3-5 years',
        employmentType: 'Full-time',
        availableSeats: 1,
        requiredSkills: ['Node.js', 'Express', 'MongoDB'],
        responsibilities: ['Design APIs', 'Database optimization', 'Deploy services'],
        benefits: ['Competitive salary', 'Remote work'],
        createdBy: hr1._id,
      },
      {
        title: 'UI/UX Designer',
        description: 'Join our design team to create amazing user experiences...',
        department: 'Design',
        branch: branches[2]._id,
        salaryMin: 60000,
        salaryMax: 90000,
        experience: '2-4 years',
        employmentType: 'Full-time',
        availableSeats: 1,
        requiredSkills: ['Figma', 'Adobe XD', 'User Research'],
        responsibilities: ['Design interfaces', 'User testing', 'Design systems'],
        benefits: ['Creative environment', 'Flexible hours'],
        createdBy: hr1._id,
      },
    ]);

    console.log('Jobs seeded:', jobs.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
