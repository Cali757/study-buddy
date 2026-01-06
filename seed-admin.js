const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://mywebapp-99a71.firebaseio.com`
});

const db = admin.firestore();

// Seed data for lessons - 6 Courses from Google Drive
const lessons = [
  // Course 1: Boss Dispatching 2025 subs
  {
    id: 'lesson-1',
    title: 'Module 01: Introduction to Truck Dispatching',
    description: 'Learn the fundamentals of truck dispatching and the role of a dispatcher in the trucking industry',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 1,
    isPro: false,
    content: 'This module covers the basics of truck dispatching including dispatcher responsibilities, communication with drivers, load coordination, and industry terminology. You will learn how dispatchers serve as the critical link between shippers, carriers, and drivers.',
  },
  {
    id: 'lesson-2',
    title: 'Module 02: Freight and Equipment',
    description: 'Understanding different types of freight and trucking equipment',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 2,
    isPro: false,
    content: 'Learn about various freight types including dry van, refrigerated, flatbed, and specialized cargo. Understand equipment specifications, weight limits, and how to match the right equipment to freight requirements.',
  },
  {
    id: 'lesson-3',
    title: 'Module 03: Rules and Regulations',
    description: 'Federal regulations and compliance requirements for truck dispatching',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 3,
    isPro: true,
    content: 'Comprehensive coverage of FMCSA regulations, DOT requirements, hours of service (HOS) rules, and compliance standards that dispatchers must understand to operate legally and safely.',
  },
  {
    id: 'lesson-4',
    title: 'Module 04: Understanding HOS (Hours of Service)',
    description: 'Master the Hours of Service regulations for commercial drivers',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 4,
    isPro: true,
    content: 'Detailed explanation of HOS rules including 11-hour driving limit, 14-hour on-duty limit, 30-minute break requirements, and 70-hour/8-day limits. Learn how to plan routes while ensuring driver compliance.',
  },
  {
    id: 'lesson-5',
    title: 'Module 05: Load Boards',
    description: 'How to effectively use load boards to find profitable freight',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 5,
    isPro: true,
    content: 'Learn to navigate popular load boards like DAT, Truckstop.com, and 123Loadboard. Understand how to search for loads, evaluate rates, check broker credit, and negotiate better prices.',
  },
  {
    id: 'lesson-6',
    title: 'Module 06: Start Your Truck Dispatching Business',
    description: 'Steps to launch and grow your own dispatching business',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 6,
    isPro: true,
    content: 'Business setup guide including legal structure, licensing, insurance, pricing strategies, client acquisition, and scaling your dispatch operation.',
  },
  {
    id: 'lesson-7',
    title: 'Module 07: Equipment Used in Truck Dispatching',
    description: 'Essential tools and technology for modern dispatchers',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 7,
    isPro: false,
    content: 'Overview of dispatch software, GPS tracking systems, communication tools, and office equipment needed to run an efficient dispatching operation.',
  },
  {
    id: 'lesson-8',
    title: 'Module 08: Software and Apps Used in Truck Dispatching',
    description: 'Digital tools that streamline dispatch operations',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 8,
    isPro: false,
    content: 'Explore TMS (Transportation Management Systems), ELD apps, route optimization software, and communication platforms used by professional dispatchers.',
  },
  {
    id: 'lesson-9',
    title: 'Module 09: Advanced Load Bidding for Dispatchers',
    description: 'Advanced strategies for winning profitable loads',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 9,
    isPro: true,
    content: 'Learn advanced negotiation tactics, rate analysis, market trends, and bidding strategies to maximize profit margins while maintaining competitive rates.',
  },
  {
    id: 'lesson-10',
    title: 'Module 10: Truck Repair and Accident Procedures',
    description: 'Handling breakdowns and accidents professionally',
    courseId: 'boss-dispatching-2025',
    courseName: 'Boss Dispatching 2025',
    order: 10,
    isPro: true,
    content: 'Emergency response protocols, coordinating repairs, managing insurance claims, and maintaining communication during breakdowns or accidents.',
  },

  // Course 2: Boss Dispatching Shortcut 2025
  {
    id: 'lesson-11',
    title: 'Quick Start: Dispatching Essentials',
    description: 'Fast-track introduction to truck dispatching',
    courseId: 'boss-dispatching-shortcut-2025',
    courseName: 'Boss Dispatching Shortcut 2025',
    order: 11,
    isPro: false,
    content: 'Accelerated overview of core dispatching concepts, allowing you to start dispatching quickly with essential knowledge and skills.',
  },
  {
    id: 'lesson-12',
    title: 'Rapid Load Board Mastery',
    description: 'Quick guide to finding and booking loads efficiently',
    courseId: 'boss-dispatching-shortcut-2025',
    courseName: 'Boss Dispatching Shortcut 2025',
    order: 12,
    isPro: true,
    content: 'Streamlined training on load board navigation, quick search techniques, and fast decision-making for load selection.',
  },
  {
    id: 'lesson-13',
    title: 'Essential HOS Rules Simplified',
    description: 'Simplified Hours of Service compliance guide',
    courseId: 'boss-dispatching-shortcut-2025',
    courseName: 'Boss Dispatching Shortcut 2025',
    order: 13,
    isPro: true,
    content: 'Condensed HOS training focusing on the most critical rules and common scenarios dispatchers encounter daily.',
  },

  // Course 3: Boss Trucking Academy
  {
    id: 'lesson-14',
    title: 'Trucking Industry Overview',
    description: 'Comprehensive introduction to the trucking industry',
    courseId: 'boss-trucking-academy',
    courseName: 'Boss Trucking Academy',
    order: 14,
    isPro: false,
    content: 'Understand the trucking industry structure, key players, market dynamics, and career opportunities in trucking and logistics.',
  },
  {
    id: 'lesson-15',
    title: 'CDL Requirements and Training',
    description: 'Commercial Driver License requirements and preparation',
    courseId: 'boss-trucking-academy',
    courseName: 'Boss Trucking Academy',
    order: 15,
    isPro: true,
    content: 'Complete guide to CDL classes, endorsements, testing requirements, and training programs for aspiring truck drivers.',
  },
  {
    id: 'lesson-16',
    title: 'Truck Maintenance and Safety',
    description: 'Essential maintenance and safety protocols for truckers',
    courseId: 'boss-trucking-academy',
    courseName: 'Boss Trucking Academy',
    order: 16,
    isPro: true,
    content: 'Pre-trip inspections, routine maintenance, safety procedures, and DOT compliance for professional truck drivers.',
  },
  {
    id: 'lesson-17',
    title: 'Route Planning and Navigation',
    description: 'Efficient route planning for long-haul trucking',
    courseId: 'boss-trucking-academy',
    courseName: 'Boss Trucking Academy',
    order: 17,
    isPro: false,
    content: 'Learn route optimization, fuel management, rest stop planning, and navigation tools for efficient long-haul operations.',
  },

  // Course 4: Freight Broker Course
  {
    id: 'lesson-18',
    title: 'Introduction to Freight Brokering',
    description: 'Fundamentals of becoming a freight broker',
    courseId: 'freight-broker-course',
    courseName: 'Freight Broker Course (Monthly Installment Plan)',
    order: 18,
    isPro: true,
    content: 'Learn the role of freight brokers, licensing requirements, bonding, and how brokers connect shippers with carriers.',
  },
  {
    id: 'lesson-19',
    title: 'Obtaining Your Broker Authority',
    description: 'Step-by-step guide to getting MC authority',
    courseId: 'freight-broker-course',
    courseName: 'Freight Broker Course (Monthly Installment Plan)',
    order: 19,
    isPro: true,
    content: 'Complete walkthrough of FMCSA registration, obtaining MC number, surety bond requirements, and insurance coverage.',
  },
  {
    id: 'lesson-20',
    title: 'Building Carrier Relationships',
    description: 'How to find and work with reliable carriers',
    courseId: 'freight-broker-course',
    courseName: 'Freight Broker Course (Monthly Installment Plan)',
    order: 20,
    isPro: true,
    content: 'Strategies for recruiting carriers, vetting processes, building trust, and maintaining long-term partnerships.',
  },
  {
    id: 'lesson-21',
    title: 'Shipper Acquisition Strategies',
    description: 'Finding and securing shipper clients',
    courseId: 'freight-broker-course',
    courseName: 'Freight Broker Course (Monthly Installment Plan)',
    order: 21,
    isPro: true,
    content: 'Sales techniques, cold calling, networking, and marketing strategies to build your shipper client base.',
  },

  // Course 5: Mastering Freight Brokering and Dispatching
  {
    id: 'lesson-22',
    title: 'Dual Role: Broker and Dispatcher',
    description: 'Combining brokering and dispatching for maximum profit',
    courseId: 'mastering-freight-brokering',
    courseName: 'Mastering Freight Brokering and Dispatching',
    order: 22,
    isPro: true,
    content: 'Learn how to operate as both a freight broker and dispatcher, maximizing revenue streams and operational efficiency.',
  },
  {
    id: 'lesson-23',
    title: 'Advanced Negotiation Techniques',
    description: 'Master the art of rate negotiation',
    courseId: 'mastering-freight-brokering',
    courseName: 'Mastering Freight Brokering and Dispatching',
    order: 23,
    isPro: true,
    content: 'Advanced negotiation strategies for both shipper and carrier sides, understanding market rates, and maximizing margins.',
  },
  {
    id: 'lesson-24',
    title: 'Scaling Your Brokerage Business',
    description: 'Growth strategies for freight brokers',
    courseId: 'mastering-freight-brokering',
    courseName: 'Mastering Freight Brokering and Dispatching',
    order: 24,
    isPro: true,
    content: 'Hiring staff, automating processes, expanding service offerings, and building a sustainable brokerage operation.',
  },

  // Course 6: Trucking Academy Shortcut 2025
  {
    id: 'lesson-25',
    title: 'Fast Track to CDL',
    description: 'Accelerated CDL preparation program',
    courseId: 'trucking-academy-shortcut',
    courseName: 'Trucking Academy Shortcut 2025',
    order: 25,
    isPro: false,
    content: 'Condensed CDL training focusing on essential skills and knowledge needed to pass your CDL exam quickly.',
  },
  {
    id: 'lesson-26',
    title: 'Quick Start Driving Career',
    description: 'Launch your trucking career fast',
    courseId: 'trucking-academy-shortcut',
    courseName: 'Trucking Academy Shortcut 2025',
    order: 26,
    isPro: true,
    content: 'Rapid onboarding guide for new drivers including finding your first job, understanding pay structures, and essential survival tips.',
  },
];

// Seed data for quizzes (abbreviated for brevity - add all 26)
const quizzes = [
  { id: 'quiz-1', lessonId: 'lesson-1', title: 'Introduction to Truck Dispatching Quiz' },
  { id: 'quiz-2', lessonId: 'lesson-2', title: 'Freight and Equipment Quiz' },
  { id: 'quiz-3', lessonId: 'lesson-3', title: 'Rules and Regulations Quiz' },
  { id: 'quiz-4', lessonId: 'lesson-4', title: 'HOS Regulations Quiz' },
  { id: 'quiz-5', lessonId: 'lesson-5', title: 'Load Boards Mastery Quiz' },
  { id: 'quiz-6', lessonId: 'lesson-6', title: 'Dispatching Business Quiz' },
  { id: 'quiz-7', lessonId: 'lesson-7', title: 'Equipment and Tools Quiz' },
  { id: 'quiz-8', lessonId: 'lesson-8', title: 'Dispatch Software Quiz' },
  { id: 'quiz-9', lessonId: 'lesson-9', title: 'Advanced Load Bidding Quiz' },
  { id: 'quiz-10', lessonId: 'lesson-10', title: 'Emergency Procedures Quiz' },
  { id: 'quiz-11', lessonId: 'lesson-11', title: 'Dispatching Essentials Quiz' },
  { id: 'quiz-12', lessonId: 'lesson-12', title: 'Load Board Quick Quiz' },
  { id: 'quiz-13', lessonId: 'lesson-13', title: 'HOS Simplified Quiz' },
  { id: 'quiz-14', lessonId: 'lesson-14', title: 'Trucking Industry Quiz' },
  { id: 'quiz-15', lessonId: 'lesson-15', title: 'CDL Requirements Quiz' },
  { id: 'quiz-16', lessonId: 'lesson-16', title: 'Maintenance and Safety Quiz' },
  { id: 'quiz-17', lessonId: 'lesson-17', title: 'Route Planning Quiz' },
  { id: 'quiz-18', lessonId: 'lesson-18', title: 'Freight Brokering Basics Quiz' },
  { id: 'quiz-19', lessonId: 'lesson-19', title: 'Broker Authority Quiz' },
  { id: 'quiz-20', lessonId: 'lesson-20', title: 'Carrier Relationships Quiz' },
  { id: 'quiz-21', lessonId: 'lesson-21', title: 'Shipper Acquisition Quiz' },
  { id: 'quiz-22', lessonId: 'lesson-22', title: 'Broker-Dispatcher Dual Role Quiz' },
  { id: 'quiz-23', lessonId: 'lesson-23', title: 'Advanced Negotiation Quiz' },
  { id: 'quiz-24', lessonId: 'lesson-24', title: 'Scaling Brokerage Quiz' },
  { id: 'quiz-25', lessonId: 'lesson-25', title: 'Fast Track CDL Quiz' },
  { id: 'quiz-26', lessonId: 'lesson-26', title: 'Quick Start Career Quiz' },
];

// Seed data for questions (abbreviated - just a few examples)
const questions = [
  {
    quizId: 'quiz-1',
    question: 'What is the primary role of a truck dispatcher?',
    options: ['Driving the truck', 'Coordinating loads between shippers and drivers', 'Repairing trucks', 'Loading cargo'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-1',
    question: 'Who does a dispatcher communicate with regularly?',
    options: ['Only drivers', 'Only shippers', 'Drivers, shippers, and brokers', 'Only mechanics'],
    correctIndex: 2,
  },
  // Add more questions as needed...
];

// Helper function to remove undefined values from objects
function cleanObject(obj) {
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed lessons
    console.log('Seeding lessons...');
    for (const lesson of lessons) {
      await db.collection('lessons').doc(lesson.id).set(cleanObject(lesson));
      console.log(`Added lesson: ${lesson.title}`);
    }

    // Seed quizzes
    console.log('Seeding quizzes...');
    for (const quiz of quizzes) {
      await db.collection('quizzes').doc(quiz.id).set(cleanObject(quiz));
      console.log(`Added quiz: ${quiz.title}`);
    }

    // Seed questions
    console.log('Seeding questions...');
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      await db.collection('questions').doc(`question-${i + 1}`).set(cleanObject(question));
      console.log(`Added question ${i + 1}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
