const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

// Seed data for quizzes
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

// Seed data for questions
const questions = [
  // Questions for quiz-1 (Introduction to Truck Dispatching)
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
  {
    quizId: 'quiz-1',
    question: 'What is a key responsibility of a dispatcher?',
    options: ['Maintaining truck engines', 'Route planning and load coordination', 'Driving the delivery', 'Warehouse management'],
    correctIndex: 1,
  },
  // Questions for quiz-2 (Freight and Equipment)
  {
    quizId: 'quiz-2',
    question: 'What type of trailer is used for temperature-sensitive cargo?',
    options: ['Dry van', 'Refrigerated (reefer)', 'Flatbed', 'Tanker'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-2',
    question: 'Which equipment is best for hauling construction materials?',
    options: ['Dry van', 'Reefer', 'Flatbed', 'Box truck'],
    correctIndex: 2,
  },
  {
    quizId: 'quiz-2',
    question: 'What is the maximum weight limit for most commercial trucks?',
    options: ['60,000 lbs', '80,000 lbs', '100,000 lbs', '50,000 lbs'],
    correctIndex: 1,
  },
  // Questions for quiz-3 (Rules and Regulations)
  {
    quizId: 'quiz-3',
    question: 'What does FMCSA stand for?',
    options: ['Federal Motor Carrier Safety Administration', 'Federal Motor Car Service Agency', 'Freight Management and Carrier Services', 'Federal Maintenance and Compliance Standards'],
    correctIndex: 0,
  },
  {
    quizId: 'quiz-3',
    question: 'What is required for interstate commercial trucking?',
    options: ['State license only', 'DOT number and MC authority', 'No special requirements', 'City permit'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-3',
    question: 'Who regulates commercial trucking safety in the US?',
    options: ['State police', 'FMCSA', 'FBI', 'Local government'],
    correctIndex: 1,
  },
  // Questions for quiz-4 (HOS Regulations)
  {
    quizId: 'quiz-4',
    question: 'What is the maximum driving time allowed in a single shift?',
    options: ['8 hours', '10 hours', '11 hours', '14 hours'],
    correctIndex: 2,
  },
  {
    quizId: 'quiz-4',
    question: 'How long must a driver rest after 8 hours of driving?',
    options: ['15 minutes', '30 minutes', '1 hour', '2 hours'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-4',
    question: 'What is the 14-hour rule in HOS?',
    options: ['Maximum driving time', 'Maximum on-duty time window', 'Required rest period', 'Weekly limit'],
    correctIndex: 1,
  },
  // Questions for quiz-5 (Load Boards)
  {
    quizId: 'quiz-5',
    question: 'What is a load board?',
    options: ['A physical board in trucks', 'An online marketplace for freight', 'A loading dock', 'A weight scale'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-5',
    question: 'Which is a popular load board platform?',
    options: ['Facebook', 'DAT', 'Instagram', 'LinkedIn'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-5',
    question: 'What should you check before accepting a load from a broker?',
    options: ['Broker credit rating', 'Weather forecast', 'Stock market', 'Gas prices only'],
    correctIndex: 0,
  },
  // Questions for quiz-6 (Dispatching Business)
  {
    quizId: 'quiz-6',
    question: 'What is typically the first step in starting a dispatch business?',
    options: ['Buying trucks', 'Legal structure and registration', 'Hiring drivers', 'Building a warehouse'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-6',
    question: 'What percentage do dispatchers typically charge?',
    options: ['1-3%', '5-10%', '20-30%', '50%'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-6',
    question: 'What insurance is essential for a dispatch business?',
    options: ['Health insurance only', 'Liability and E&O insurance', 'Car insurance', 'No insurance needed'],
    correctIndex: 1,
  },
  // Questions for quiz-7 (Equipment and Tools)
  {
    quizId: 'quiz-7',
    question: 'What technology helps track truck locations in real-time?',
    options: ['Radio', 'GPS tracking', 'Telephone', 'Fax machine'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-7',
    question: 'What is an ELD?',
    options: ['Electronic Logging Device', 'Emergency Load Detector', 'Engine Level Display', 'Extra Large Driver'],
    correctIndex: 0,
  },
  {
    quizId: 'quiz-7',
    question: 'What communication tool is essential for dispatchers?',
    options: ['Carrier TMS software', 'Video games', 'Social media only', 'None needed'],
    correctIndex: 0,
  },
  // Questions for quiz-8 (Dispatch Software)
  {
    quizId: 'quiz-8',
    question: 'What does TMS stand for?',
    options: ['Truck Management System', 'Transportation Management System', 'Traffic Monitoring Service', 'Trailer Maintenance Software'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-8',
    question: 'What is the purpose of route optimization software?',
    options: ['Entertainment', 'Finding the most efficient routes', 'Social networking', 'Music streaming'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-8',
    question: 'Why are ELD apps mandatory for commercial drivers?',
    options: ['For entertainment', 'To track HOS compliance', 'For navigation only', 'They are optional'],
    correctIndex: 1,
  },
  // Questions for quiz-9 (Advanced Load Bidding)
  {
    quizId: 'quiz-9',
    question: 'What factor most affects freight rates?',
    options: ['Driver age', 'Supply and demand', 'Truck color', 'Day of the week only'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-9',
    question: 'When is the best time to negotiate higher rates?',
    options: ['When capacity is tight', 'When there are many available trucks', 'Never', 'Only on weekends'],
    correctIndex: 0,
  },
  {
    quizId: 'quiz-9',
    question: 'What is deadhead in trucking?',
    options: ['A broken truck', 'Driving without cargo', 'A type of freight', 'A loading technique'],
    correctIndex: 1,
  },
  // Questions for quiz-10 (Emergency Procedures)
  {
    quizId: 'quiz-10',
    question: 'What should a dispatcher do first when a driver has a breakdown?',
    options: ['Ignore it', 'Assess the situation and ensure driver safety', 'Find a new driver', 'Cancel all loads'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-10',
    question: 'Who should be notified immediately after an accident?',
    options: ['No one', 'Insurance company and authorities', 'Only the driver family', 'Social media'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-10',
    question: 'What documentation is needed after a truck accident?',
    options: ['None', 'Police report, photos, witness statements', 'Only insurance card', 'Driver license only'],
    correctIndex: 1,
  },
  // Questions for quiz-11 (Dispatching Essentials)
  {
    quizId: 'quiz-11',
    question: 'What is the quickest way to start dispatching?',
    options: ['Buy a trucking company', 'Learn essential skills and find clients', 'Wait for opportunities', 'Do nothing'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-11',
    question: 'What is most important for new dispatchers?',
    options: ['Expensive office', 'Strong communication skills', 'Fancy car', 'Large staff'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-11',
    question: 'How can new dispatchers find their first clients?',
    options: ['Wait for them to call', 'Network and cold outreach', 'Hope for the best', 'Buy clients'],
    correctIndex: 1,
  },
  // Questions for quiz-12 (Load Board Quick)
  {
    quizId: 'quiz-12',
    question: 'What information is essential when searching load boards?',
    options: ['Driver favorite color', 'Origin, destination, and equipment type', 'Weather only', 'Truck brand'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-12',
    question: 'How do you quickly evaluate if a load is profitable?',
    options: ['Guess', 'Calculate rate per mile vs costs', 'Ask friends', 'Flip a coin'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-12',
    question: 'What does RPM stand for in trucking?',
    options: ['Revolutions Per Minute', 'Rate Per Mile', 'Routes Per Month', 'Repairs Per Mile'],
    correctIndex: 1,
  },
  // Questions for quiz-13 (HOS Simplified)
  {
    quizId: 'quiz-13',
    question: 'What is the simplified 11-hour rule?',
    options: ['Work 11 hours total', 'Drive maximum 11 hours after 10 hours off', 'Rest 11 hours', 'Load for 11 hours'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-13',
    question: 'Why is the 30-minute break required?',
    options: ['For meals', 'To prevent driver fatigue', 'To check email', 'Not required'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-13',
    question: 'What happens if a driver violates HOS?',
    options: ['Nothing', 'Fines and potential license suspension', 'Promotion', 'Bonus pay'],
    correctIndex: 1,
  },
  // Questions for quiz-14 (Trucking Industry)
  {
    quizId: 'quiz-14',
    question: 'What percentage of US freight is moved by trucks?',
    options: ['20%', '50%', '70%', '90%'],
    correctIndex: 2,
  },
  {
    quizId: 'quiz-14',
    question: 'What is a common career path in trucking?',
    options: ['Driver to owner-operator', 'Driver to pilot', 'Driver to doctor', 'No advancement possible'],
    correctIndex: 0,
  },
  {
    quizId: 'quiz-14',
    question: 'What is the role of a freight broker?',
    options: ['Drive trucks', 'Connect shippers with carriers', 'Repair trucks', 'Load cargo'],
    correctIndex: 1,
  },
  // Questions for quiz-15 (CDL Requirements)
  {
    quizId: 'quiz-15',
    question: 'What does CDL stand for?',
    options: ['Car Driver License', 'Commercial Driver License', 'Certified Driving Lesson', 'Central Distribution License'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-15',
    question: 'What is a Class A CDL for?',
    options: ['Passenger cars', 'Combination vehicles over 26,001 lbs', 'Motorcycles', 'Bicycles'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-15',
    question: 'What endorsement is needed for hazardous materials?',
    options: ['P endorsement', 'H endorsement', 'N endorsement', 'T endorsement'],
    correctIndex: 1,
  },
  // Questions for quiz-16 (Maintenance and Safety)
  {
    quizId: 'quiz-16',
    question: 'What is a pre-trip inspection?',
    options: ['Checking the truck before driving', 'Planning the route', 'Calling dispatch', 'Fueling up'],
    correctIndex: 0,
  },
  {
    quizId: 'quiz-16',
    question: 'How often should tire pressure be checked?',
    options: ['Never', 'Before each trip', 'Once a year', 'Only when flat'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-16',
    question: 'What should you do if you notice a safety issue?',
    options: ['Ignore it', 'Report and fix it immediately', 'Wait until it breaks', 'Hide it'],
    correctIndex: 1,
  },
  // Questions for quiz-17 (Route Planning)
  {
    quizId: 'quiz-17',
    question: 'What is the most important factor in route planning?',
    options: ['Scenic views', 'Efficiency and fuel economy', 'Number of restaurants', 'Toll roads only'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-17',
    question: 'Why plan rest stops in advance?',
    options: ['For fun', 'To comply with HOS and ensure driver rest', 'To waste time', 'Not necessary'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-17',
    question: 'What tool helps with route optimization?',
    options: ['Paper map only', 'GPS and routing software', 'Guessing', 'Asking strangers'],
    correctIndex: 1,
  },
  // Questions for quiz-18 (Freight Brokering Basics)
  {
    quizId: 'quiz-18',
    question: 'What is the main difference between a broker and a carrier?',
    options: ['Brokers own trucks, carriers do not', 'Brokers arrange transportation, carriers provide it', 'No difference', 'Carriers arrange, brokers provide'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-18',
    question: 'What is required to operate as a freight broker?',
    options: ['Nothing', 'MC authority and surety bond', 'Just a phone', 'Only a website'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-18',
    question: 'How do brokers make money?',
    options: ['Driving trucks', 'Margin between shipper rate and carrier rate', 'Government grants', 'Donations'],
    correctIndex: 1,
  },
  // Questions for quiz-19 (Broker Authority)
  {
    quizId: 'quiz-19',
    question: 'What is an MC number?',
    options: ['Motorcycle number', 'Motor Carrier operating authority number', 'Medical certificate', 'Maintenance code'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-19',
    question: 'What is the minimum surety bond for freight brokers?',
    options: ['$25,000', '$50,000', '$75,000', '$100,000'],
    correctIndex: 2,
  },
  {
    quizId: 'quiz-19',
    question: 'Where do you register for broker authority?',
    options: ['Local DMV', 'FMCSA', 'Post office', 'Bank'],
    correctIndex: 1,
  },
  // Questions for quiz-20 (Carrier Relationships)
  {
    quizId: 'quiz-20',
    question: 'Why is carrier vetting important?',
    options: ['Not important', 'To ensure reliability and safety', 'To waste time', 'To annoy carriers'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-20',
    question: 'What should you verify about a carrier?',
    options: ['Nothing', 'Insurance, authority, and safety rating', 'Only phone number', 'Only email'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-20',
    question: 'How do you build long-term carrier relationships?',
    options: ['Pay late', 'Fair rates and timely payment', 'Ignore them', 'Change carriers constantly'],
    correctIndex: 1,
  },
  // Questions for quiz-21 (Shipper Acquisition)
  {
    quizId: 'quiz-21',
    question: 'What is cold calling in freight brokering?',
    options: ['Calling in winter', 'Reaching out to potential clients without prior contact', 'Calling from a cold place', 'Not calling at all'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-21',
    question: 'What industries commonly need freight services?',
    options: ['None', 'Manufacturing, retail, construction', 'Only tech companies', 'Only restaurants'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-21',
    question: 'What is a key to successful shipper acquisition?',
    options: ['Luck only', 'Persistence and value proposition', 'Giving up quickly', 'Avoiding contact'],
    correctIndex: 1,
  },
  // Questions for quiz-22 (Broker-Dispatcher Dual Role)
  {
    quizId: 'quiz-22',
    question: 'What advantage does combining broker and dispatcher roles offer?',
    options: ['None', 'Multiple revenue streams and better control', 'More confusion', 'Less profit'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-22',
    question: 'Can you dispatch for your own brokered loads?',
    options: ['Never', 'Yes, if you have carrier authority', 'Only on weekends', 'Illegal'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-22',
    question: 'What skill is essential for both roles?',
    options: ['Cooking', 'Communication and negotiation', 'Dancing', 'Singing'],
    correctIndex: 1,
  },
  // Questions for quiz-23 (Advanced Negotiation)
  {
    quizId: 'quiz-23',
    question: 'What is the key to successful rate negotiation?',
    options: ['Being aggressive', 'Understanding market rates and value', 'Accepting first offer', 'Avoiding negotiation'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-23',
    question: 'When should you walk away from a negotiation?',
    options: ['Always', 'When the rate does not cover costs plus profit', 'Never', 'Randomly'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-23',
    question: 'What information strengthens your negotiating position?',
    options: ['Nothing', 'Market data and alternative options', 'Personal opinions', 'Emotions'],
    correctIndex: 1,
  },
  // Questions for quiz-24 (Scaling Brokerage)
  {
    quizId: 'quiz-24',
    question: 'What is essential when hiring your first employee?',
    options: ['Hiring anyone', 'Clear job description and training plan', 'No planning needed', 'Hiring family only'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-24',
    question: 'How can technology help scale a brokerage?',
    options: ['It cannot', 'Automation and efficiency improvements', 'Only for entertainment', 'Makes things harder'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-24',
    question: 'What is a sign your brokerage is ready to scale?',
    options: ['Losing money', 'Consistent profitability and demand', 'No clients', 'Random guess'],
    correctIndex: 1,
  },
  // Questions for quiz-25 (Fast Track CDL)
  {
    quizId: 'quiz-25',
    question: 'What is the fastest way to prepare for CDL exam?',
    options: ['Not studying', 'Focused study on essential topics and practice tests', 'Hoping for luck', 'Copying others'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-25',
    question: 'What are the main components of CDL testing?',
    options: ['Only written test', 'Written, skills, and road tests', 'Only driving test', 'No tests required'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-25',
    question: 'How long does CDL training typically take?',
    options: ['1 day', '3-8 weeks', '5 years', '10 years'],
    correctIndex: 1,
  },
  // Questions for quiz-26 (Quick Start Career)
  {
    quizId: 'quiz-26',
    question: 'What is the best way to find your first trucking job?',
    options: ['Wait at home', 'Apply to multiple carriers and use job boards', 'Do nothing', 'Only apply to one company'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-26',
    question: 'What are common pay structures for truck drivers?',
    options: ['Only hourly', 'Per mile, percentage, or hourly', 'No pay', 'Only tips'],
    correctIndex: 1,
  },
  {
    quizId: 'quiz-26',
    question: 'What should new drivers prioritize?',
    options: ['Speed only', 'Safety and learning', 'Breaking rules', 'Ignoring dispatch'],
    correctIndex: 1,
  },
];

// Helper function to remove undefined values from objects
function cleanObject(obj: any): any {
  const cleaned: any = {};
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
