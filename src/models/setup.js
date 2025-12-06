/* eslint-disable max-len */
import db from './db.js';

// Catalog data as array
const catalog = [
    {
        courseSlug: 'cse-110',
        facultySlug: 'nathan-jack',
        time: 'Mon Wed Fri 8:00-8:50',
        room: 'STC 101'
    },
    {
        courseSlug: 'cse-111',
        facultySlug: 'nathan-jack',
        time: 'Mon Wed Fri 9:00-9:50',
        room: 'STC 102'
    },
    {
        courseSlug: 'cse-210',
        facultySlug: 'nathan-jack',
        time: 'Tue Thu 10:00-11:15',
        room: 'STC 103'
    },
    {
        courseSlug: 'cse-212',
        facultySlug: 'nathan-jack',
        time: 'Tue Thu 1:00-2:15',
        room: 'STC 104'
    },
    {
        courseSlug: 'cse-340',
        facultySlug: 'nathan-jack',
        time: 'Mon Wed 2:00-3:15',
        room: 'STC 105'
    },
    {
        courseSlug: 'cit-160',
        facultySlug: 'jason-allred',
        time: 'Mon Wed Fri 10:00-10:50',
        room: 'STC 106'
    },
    {
        courseSlug: 'cit-241',
        facultySlug: 'jason-allred',
        time: 'Tue Thu 8:00-9:15',
        room: 'STC 107'
    },
    {
        courseSlug: 'cit-260',
        facultySlug: 'jason-allred',
        time: 'Mon Wed 11:00-12:15',
        room: 'STC 108'
    },
    {
        courseSlug: 'cit-336',
        facultySlug: 'jason-allred',
        time: 'Fri 1:00-3:50',
        room: 'STC 109'
    },
    {
        courseSlug: 'wdd-130',
        facultySlug: 'adam-hayes',
        time: 'Mon Wed Fri 11:00-11:50',
        room: 'STC 201'
    },
    {
        courseSlug: 'wdd-230',
        facultySlug: 'adam-hayes',
        time: 'Tue Thu 11:00-12:15',
        room: 'STC 202'
    },
    {
        courseSlug: 'wdd-330',
        facultySlug: 'adam-hayes',
        time: 'Mon Wed 1:00-2:15',
        room: 'STC 203'
    },
    {
        courseSlug: 'wdd-430',
        facultySlug: 'adam-hayes',
        time: 'Tue Thu 2:30-3:45',
        room: 'STC 204'
    },
    {
        courseSlug: 'cse-310',
        facultySlug: 'adam-hayes',
        time: 'Fri 9:00-11:50',
        room: 'STC 205'
    },
    {
        courseSlug: 'cse-398',
        facultySlug: 'nate-phillips',
        time: 'Mon Wed 9:00-10:15',
        room: 'STC 206'
    },
    {
        courseSlug: 'cse-110',
        facultySlug: 'nate-phillips',
        time: 'Tue Thu 9:00-10:15',
        room: 'STC 207'
    },
    {
        courseSlug: 'cse-111',
        facultySlug: 'nate-phillips',
        time: 'Mon Wed Fri 1:00-1:50',
        room: 'STC 208'
    },
    {
        courseSlug: 'cse-212',
        facultySlug: 'nate-phillips',
        time: 'Tue Thu 3:00-4:15',
        room: 'STC 209'
    },
    {
        courseSlug: 'cse-210',
        facultySlug: 'william-clements',
        time: 'Mon Wed Fri 2:00-2:50',
        room: 'STC 301'
    },
    {
        courseSlug: 'cit-160',
        facultySlug: 'william-clements',
        time: 'Tue Thu 10:00-11:15',
        room: 'STC 302'
    },
    {
        courseSlug: 'cit-260',
        facultySlug: 'william-clements',
        time: 'Mon Wed 3:00-4:15',
        room: 'STC 303'
    },
    {
        courseSlug: 'cse-340',
        facultySlug: 'zachariah-alvey',
        time: 'Tue Thu 8:00-9:15',
        room: 'STC 304'
    },
    {
        courseSlug: 'cse-310',
        facultySlug: 'zachariah-alvey',
        time: 'Mon Wed Fri 8:00-8:50',
        room: 'STC 305'
    },
    {
        courseSlug: 'cse-212',
        facultySlug: 'zachariah-alvey',
        time: 'Tue Thu 1:00-2:15',
        room: 'STC 306'
    },
    {
        courseSlug: 'wdd-130',
        facultySlug: 'zachariah-alvey',
        time: 'Mon Wed 4:00-5:15',
        room: 'STC 307'
    },
    {
        courseSlug: 'cse-111',
        facultySlug: 'zachariah-alvey',
        time: 'Fri 10:00-12:50',
        room: 'STC 308'
    },
    {
        courseSlug: 'cse-110',
        facultySlug: 'bradley-armstrong',
        time: 'Mon Wed Fri 12:00-12:50',
        room: 'STC 309'
    },
    {
        courseSlug: 'cit-241',
        facultySlug: 'bradley-armstrong',
        time: 'Tue Thu 12:00-1:15',
        room: 'STC 310'
    },
    {
        courseSlug: 'wdd-230',
        facultySlug: 'bradley-armstrong',
        time: 'Mon Wed 5:00-6:15',
        room: 'STC 401'
    },
    {
        courseSlug: 'cse-210',
        facultySlug: 'bradley-armstrong',
        time: 'Fri 2:00-4:50',
        room: 'STC 402'
    },
    {
        courseSlug: 'wdd-330',
        facultySlug: 'lee-barney',
        time: 'Mon Wed Fri 3:00-3:50',
        room: 'STC 403'
    },
    {
        courseSlug: 'cse-340',
        facultySlug: 'lee-barney',
        time: 'Tue Thu 4:00-5:15',
        room: 'STC 404'
    },
    {
        courseSlug: 'cit-336',
        facultySlug: 'lee-barney',
        time: 'Mon Wed 6:00-7:15',
        room: 'STC 405'
    },
    {
        courseSlug: 'cse-398',
        facultySlug: 'lee-barney',
        time: 'Thu 6:00-8:50',
        room: 'STC 406'
    },
    {
        courseSlug: 'cit-260',
        facultySlug: 'rex-barzee',
        time: 'Mon Wed Fri 4:00-4:50',
        room: 'STC 407'
    },
    {
        courseSlug: 'wdd-430',
        facultySlug: 'rex-barzee',
        time: 'Tue Thu 5:00-6:15',
        room: 'STC 408'
    },
    {
        courseSlug: 'cse-212',
        facultySlug: 'rex-barzee',
        time: 'Mon Wed 7:00-8:15',
        room: 'STC 409'
    },
    {
        courseSlug: 'cse-310',
        facultySlug: 'rex-barzee',
        time: 'Fri 5:00-7:50',
        room: 'STC 410'
    },
    {
        courseSlug: 'cse-111',
        facultySlug: 'scott-burton',
        time: 'Mon Wed Fri 5:00-5:50',
        room: 'STC 411'
    },
    {
        courseSlug: 'wdd-130',
        facultySlug: 'scott-burton',
        time: 'Tue Thu 6:00-7:15',
        room: 'STC 412'
    },
    {
        courseSlug: 'cit-160',
        facultySlug: 'scott-burton',
        time: 'Mon Wed 8:00-9:15',
        room: 'STC 413'
    },
    {
        courseSlug: 'wdd-230',
        facultySlug: 'scott-burton',
        time: 'Thu 7:00-9:50',
        room: 'STC 414'
    },
    {
        courseSlug: 'cse-210',
        facultySlug: 'christopher-keers',
        time: 'Mon Wed Fri 6:00-6:50',
        room: 'STC 415'
    },
    {
        courseSlug: 'cit-241',
        facultySlug: 'christopher-keers',
        time: 'Tue Thu 7:00-8:15',
        room: 'STC 416'
    },
    {
        courseSlug: 'cse-340',
        facultySlug: 'christopher-keers',
        time: 'Mon Wed 9:00-10:15',
        room: 'STC 417'
    },
    {
        courseSlug: 'wdd-330',
        facultySlug: 'christopher-keers',
        time: 'Fri 6:00-8:50',
        room: 'STC 418'
    },
    {
        courseSlug: 'cse-110',
        facultySlug: 'julie-ann-anderson',
        time: 'Tue Thu 8:00-9:15',
        room: 'STC 419'
    },
    {
        courseSlug: 'wdd-130',
        facultySlug: 'julie-ann-anderson',
        time: 'Mon Wed Fri 7:00-7:50',
        room: 'STC 420'
    },
    {
        courseSlug: 'cit-160',
        facultySlug: 'julie-ann-anderson',
        time: 'Tue Thu 9:00-10:15',
        room: 'STC 421'
    },
    {
        courseSlug: 'wdd-230',
        facultySlug: 'julie-ann-anderson',
        time: 'Mon Wed 10:00-11:15',
        room: 'STC 422'
    },
    {
        courseSlug: 'cse-111',
        facultySlug: 'julie-ann-anderson',
        time: 'Fri 7:00-9:50',
        room: 'STC 423'
    },
    {
        courseSlug: 'eng-150',
        facultySlug: 'joelle-moen',
        time: 'Mon Wed Fri 8:00-8:50',
        room: 'GEB 101'
    },
    {
        courseSlug: 'eng-250',
        facultySlug: 'joelle-moen',
        time: 'Tue Thu 8:00-9:15',
        room: 'GEB 102'
    },
    {
        courseSlug: 'eng-216',
        facultySlug: 'joelle-moen',
        time: 'Mon Wed 9:00-10:15',
        room: 'GEB 103'
    },
    {
        courseSlug: 'eng-324',
        facultySlug: 'joelle-moen',
        time: 'Fri 9:00-11:50',
        room: 'GEB 104'
    },
    {
        courseSlug: 'eng-106',
        facultySlug: 'josh-allen',
        time: 'Mon Wed Fri 9:00-9:50',
        room: 'GEB 105'
    },
    {
        courseSlug: 'eng-150',
        facultySlug: 'josh-allen',
        time: 'Tue Thu 9:00-10:15',
        room: 'GEB 106'
    },
    {
        courseSlug: 'eng-295',
        facultySlug: 'josh-allen',
        time: 'Mon Wed 10:00-11:15',
        room: 'GEB 107'
    },
    {
        courseSlug: 'eng-381',
        facultySlug: 'josh-allen',
        time: 'Fri 10:00-12:50',
        room: 'GEB 108'
    },
    {
        courseSlug: 'eng-150',
        facultySlug: 'matt-babcock',
        time: 'Mon Wed Fri 10:00-10:50',
        room: 'GEB 201'
    },
    {
        courseSlug: 'eng-216',
        facultySlug: 'matt-babcock',
        time: 'Tue Thu 10:00-11:15',
        room: 'GEB 202'
    },
    {
        courseSlug: 'eng-250',
        facultySlug: 'matt-babcock',
        time: 'Mon Wed 11:00-12:15',
        room: 'GEB 203'
    },
    {
        courseSlug: 'eng-295',
        facultySlug: 'matt-babcock',
        time: 'Thu 1:00-3:50',
        room: 'GEB 204'
    },
    {
        courseSlug: 'eng-106',
        facultySlug: 'jeremy-bailey',
        time: 'Mon Wed Fri 11:00-11:50',
        room: 'GEB 301'
    },
    {
        courseSlug: 'eng-150',
        facultySlug: 'jeremy-bailey',
        time: 'Tue Thu 11:00-12:15',
        room: 'GEB 302'
    },
    {
        courseSlug: 'eng-324',
        facultySlug: 'jeremy-bailey',
        time: 'Mon Wed 12:00-1:15',
        room: 'GEB 303'
    },
    {
        courseSlug: 'eng-381',
        facultySlug: 'jeremy-bailey',
        time: 'Fri 11:00-1:50',
        room: 'GEB 304'
    },
    {
        courseSlug: 'eng-150',
        facultySlug: 'tom-ballard',
        time: 'Mon Wed Fri 12:00-12:50',
        room: 'GEB 305'
    },
    {
        courseSlug: 'eng-216',
        facultySlug: 'tom-ballard',
        time: 'Tue Thu 12:00-1:15',
        room: 'GEB 306'
    },
    {
        courseSlug: 'eng-250',
        facultySlug: 'tom-ballard',
        time: 'Mon Wed 1:00-2:15',
        room: 'GEB 307'
    },
    {
        courseSlug: 'eng-295',
        facultySlug: 'tom-ballard',
        time: 'Fri 12:00-2:50',
        room: 'GEB 308'
    },
    {
        courseSlug: 'math-112',
        facultySlug: 'elaine-wagner',
        time: 'Mon Wed Fri 8:00-8:50',
        room: 'MC 101'
    },
    {
        courseSlug: 'math-113',
        facultySlug: 'elaine-wagner',
        time: 'Tue Thu 8:00-9:15',
        room: 'MC 102'
    },
    {
        courseSlug: 'math-215',
        facultySlug: 'elaine-wagner',
        time: 'Mon Wed 9:00-10:15',
        room: 'MC 103'
    },
    {
        courseSlug: 'math-221',
        facultySlug: 'elaine-wagner',
        time: 'Fri 8:00-10:50',
        room: 'MC 104'
    },
    {
        courseSlug: 'math-108x',
        facultySlug: 'brett-amidan',
        time: 'Mon Wed Fri 9:00-9:50',
        room: 'MC 105'
    },
    {
        courseSlug: 'math-112',
        facultySlug: 'brett-amidan',
        time: 'Tue Thu 9:00-10:15',
        room: 'MC 106'
    },
    {
        courseSlug: 'math-280',
        facultySlug: 'brett-amidan',
        time: 'Mon Wed 10:00-11:15',
        room: 'MC 107'
    },
    {
        courseSlug: 'math-341',
        facultySlug: 'brett-amidan',
        time: 'Fri 9:00-11:50',
        room: 'MC 108'
    },
    {
        courseSlug: 'intl-201',
        facultySlug: 'robert-colvin',
        time: 'Mon Wed Fri 10:00-10:50',
        room: 'LA 101'
    },
    {
        courseSlug: 'intl-301',
        facultySlug: 'robert-colvin',
        time: 'Tue Thu 10:00-11:15',
        room: 'LA 102'
    },
    {
        courseSlug: 'intl-350',
        facultySlug: 'robert-colvin',
        time: 'Mon Wed 11:00-12:15',
        room: 'LA 103'
    },
    {
        courseSlug: 'intl-401',
        facultySlug: 'scott-galer',
        time: 'Mon Wed Fri 11:00-11:50',
        room: 'LA 201'
    },
    {
        courseSlug: 'intl-201',
        facultySlug: 'scott-galer',
        time: 'Tue Thu 11:00-12:15',
        room: 'LA 202'
    },
    {
        courseSlug: 'intl-350',
        facultySlug: 'scott-galer',
        time: 'Mon Wed 12:00-1:15',
        room: 'LA 203'
    },
    {
        courseSlug: 'intl-301',
        facultySlug: 'scott-galer',
        time: 'Fri 11:00-1:50',
        room: 'LA 204'
    },
    {
        courseSlug: 'intl-201',
        facultySlug: 'john-ivers',
        time: 'Mon Wed Fri 1:00-1:50',
        room: 'LA 301'
    },
    {
        courseSlug: 'intl-301',
        facultySlug: 'john-ivers',
        time: 'Tue Thu 1:00-2:15',
        room: 'LA 302'
    },
    {
        courseSlug: 'intl-401',
        facultySlug: 'john-ivers',
        time: 'Mon Wed 2:00-3:15',
        room: 'LA 303'
    }
];

// Course data as array
const courses = [
    {
        courseCode: 'CSE 110',
        name: 'Introduction to Programming',
        description:
            'Fundamentals of programming using Python. Introduction to problem solving, algorithm development, and basic programming concepts including variables, control structures, and functions.',
        creditHours: 2,
        departmentId: 0
    },
    {
        courseCode: 'CSE 111',
        name: 'Programming with Functions',
        description:
            'Learn to become a more organized, efficient, and capable computer programmer by researching and calling functions written by others; writing, calling, debugging, and testing your own functions.',
        creditHours: 2,
        departmentId: 0
    },
    {
        courseCode: 'CSE 210',
        name: 'Programming with Classes',
        description:
            'Introduction to the notion of classes and objects. Presents encapsulation at a conceptual level and works with inheritance and polymorphism.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CSE 212',
        name: 'Programming with Data Structures',
        description:
            'Data structures and algorithms including dynamic arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Algorithm analysis and Big O notation.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CSE 310',
        name: 'Operating Systems',
        description:
            'Operating system concepts including processes, threads, CPU scheduling, memory management, file systems, and system security.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CSE 340',
        name: 'Software Engineering',
        description:
            'Software development lifecycle, requirements analysis, design patterns, testing strategies, and project management in software development.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CSE 398',
        name: 'Computer Science Internship',
        description:
            'Supervised work experience in computer science. Students apply classroom knowledge in real-world professional settings.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CIT 160',
        name: 'Introduction to Programming',
        description:
            'Fundamental programming concepts using modern programming languages. Problem solving, algorithm development, and basic programming structures.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CIT 241',
        name: 'Network Routing and Switching',
        description:
            'Initial router configuration, Cisco IOS Software management, routing protocol configuration, TCP/IP, and access control lists (ACLs).',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CIT 260',
        name: 'Object Oriented Programming',
        description:
            'Fundamentals of Object Oriented Programming using Java. Classes, objects, inheritance, polymorphism, and graphical user interfaces.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'CIT 336',
        name: 'Web Backend Development',
        description:
            'Server-side web development using modern frameworks and databases. RESTful APIs, authentication, and data management.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'WDD 130',
        name: 'Web Fundamentals',
        description:
            'Introduction to web development using HTML and CSS. Basic web page structure, styling, and responsive design principles.',
        creditHours: 2,
        departmentId: 0
    },
    {
        courseCode: 'WDD 230',
        name: 'Web Frontend Development I',
        description:
            'Advanced HTML, CSS, and JavaScript. DOM manipulation, event handling, and modern web development tools and practices.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'WDD 330',
        name: 'Web Frontend Development II',
        description:
            'Advanced JavaScript frameworks and libraries. Single page applications, state management, and modern frontend development patterns.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'WDD 430',
        name: 'Full Stack Development',
        description:
            'Integration of frontend and backend technologies. Database design, API development, and deployment of full-stack web applications.',
        creditHours: 3,
        departmentId: 0
    },
    {
        courseCode: 'MATH 108X',
        name: 'Mathematics Preparation',
        description:
            'Preparation for college-level mathematics. Review of algebra, geometry, and trigonometry concepts needed for calculus.',
        creditHours: 3,
        departmentId: 1
    },
    {
        courseCode: 'MATH 112',
        name: 'Calculus I',
        description:
            'Limits, derivatives, and applications of derivatives. Introduction to integration and the Fundamental Theorem of Calculus.',
        creditHours: 4,
        departmentId: 1
    },
    {
        courseCode: 'MATH 113',
        name: 'Calculus II',
        description:
            'Integration techniques, applications of integration, infinite sequences and series, parametric equations, and polar coordinates.',
        creditHours: 4,
        departmentId: 1
    },
    {
        courseCode: 'MATH 215',
        name: 'Calculus III',
        description:
            'Multivariable calculus including partial derivatives, multiple integrals, vector fields, line integrals, and surface integrals.',
        creditHours: 4,
        departmentId: 1
    },
    {
        courseCode: 'MATH 221',
        name: 'Statistics',
        description:
            'Descriptive statistics, probability distributions, hypothesis testing, confidence intervals, regression analysis, and ANOVA.',
        creditHours: 3,
        departmentId: 1
    },
    {
        courseCode: 'MATH 280',
        name: 'Topics in Pure Mathematics',
        description:
            'Advanced mathematical topics including proof techniques, set theory, number theory, and abstract algebra concepts.',
        creditHours: 3,
        departmentId: 1
    },
    {
        courseCode: 'MATH 341',
        name: 'Differential Equations',
        description:
            'First and second order differential equations, systems of differential equations, and applications to physical and biological systems.',
        creditHours: 3,
        departmentId: 1
    },
    {
        courseCode: 'ENG 106',
        name: 'English Preparation',
        description:
            'Development of basic writing skills including grammar, sentence structure, paragraph development, and essay organization.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 150',
        name: 'Writing and Reasoning Foundations',
        description:
            'Academic writing with emphasis on critical thinking, research skills, and argumentation. Introduction to various rhetorical modes.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 250',
        name: 'Writing and Research',
        description:
            'Advanced academic writing with emphasis on research methodology, source evaluation, and scholarly communication.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 216',
        name: 'Technical Writing',
        description:
            'Writing for technical and professional audiences. Reports, proposals, manuals, and other forms of workplace communication.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 295',
        name: 'Literature and Film',
        description:
            'Study of literary works and their film adaptations. Analysis of narrative techniques, themes, and cultural contexts.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 324',
        name: 'Shakespeare',
        description:
            'Study of selected plays and sonnets by William Shakespeare with attention to language, themes, and historical context.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'ENG 381',
        name: 'American Literature',
        description:
            'Survey of American literature from colonial period to present, including major authors, movements, and cultural influences.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'INTL 201',
        name: 'Introduction to International Studies',
        description:
            'Overview of global issues, international relations theory, and cross-cultural analysis of political, economic, and social systems.',
        creditHours: 3,
        departmentId: 3
    },
    {
        courseCode: 'INTL 301',
        name: 'Comparative Politics',
        description:
            'Comparative analysis of political systems, governance structures, and policy-making processes across different nations.',
        creditHours: 3,
        departmentId: 3
    },
    {
        courseCode: 'INTL 350',
        name: 'International Economics',
        description:
            'Economic principles applied to international trade, finance, development, and global economic institutions.',
        creditHours: 3,
        departmentId: 3
    },
    {
        courseCode: 'INTL 401',
        name: 'Global Issues Seminar',
        description:
            'In-depth analysis of contemporary global challenges including security, environment, human rights, and economic development.',
        creditHours: 3,
        departmentId: 3
    },
    {
        courseCode: 'REL 121',
        name: 'The Eternal Family',
        description:
            'Doctrinal foundations of the family, marriage preparation, and principles of successful family relationships from an LDS perspective.',
        creditHours: 2,
        departmentId: 4
    },
    {
        courseCode: 'REL 250',
        name: 'The Living Christ',
        description:
            'Study of the life, mission, and teachings of Jesus Christ as recorded in the New Testament and modern revelation.',
        creditHours: 2,
        departmentId: 4
    },
    {
        courseCode: 'FDMAT 108',
        name: 'Mathematics for Life',
        description:
            'Practical applications of mathematics in personal finance, statistics, and problem-solving for daily life.',
        creditHours: 3,
        departmentId: 1
    },
    {
        courseCode: 'FDENG 101',
        name: 'Writing and Communication',
        description: 'Foundational writing and communication skills for academic and professional success.',
        creditHours: 3,
        departmentId: 2
    },
    {
        courseCode: 'GS 170',
        name: 'Foundations of Learning',
        description:
            'Study skills, time management, goal setting, and strategies for academic success in higher education.',
        creditHours: 2,
        departmentId: 5
    },
    {
        courseCode: 'ECEN 160',
        name: 'Introduction to Electrical Engineering',
        description:
            'Fundamentals of electrical engineering including circuit analysis, Ohms law, and basic electronic components.',
        creditHours: 3,
        departmentId: 6
    },
    {
        courseCode: 'PHYS 121',
        name: 'University Physics I',
        description:
            'Mechanics, wave motion, and thermodynamics with calculus-based approach. Laboratory component included.',
        creditHours: 4,
        departmentId: 7
    },
    {
        courseCode: 'CHEM 111',
        name: 'General Chemistry I',
        description:
            'Fundamental principles of chemistry including atomic structure, bonding, stoichiometry, and thermochemistry.',
        creditHours: 4,
        departmentId: 8
    },
    {
        courseCode: 'BIO 111',
        name: 'General Biology I',
        description:
            'Introduction to biological principles including cell structure, metabolism, genetics, and evolution.',
        creditHours: 4,
        departmentId: 9
    },
    {
        courseCode: 'ECON 151',
        name: 'Macroeconomics',
        description:
            'Introduction to macroeconomic principles including national income, inflation, unemployment, and fiscal policy.',
        creditHours: 3,
        departmentId: 10
    },
    {
        courseCode: 'HIST 170',
        name: 'Foundations of the Restoration',
        description:
            'History of the restoration of the Gospel of Jesus Christ through the Prophet Joseph Smith and the early Church.',
        creditHours: 2,
        departmentId: 11
    }
];

// Department data as array
const departments = [
    { id: 0, code: 'CS', name: 'Computer Science' },
    { id: 1, code: 'MATH', name: 'Mathematics' },
    { id: 2, code: 'ENG', name: 'English' },
    { id: 3, code: 'INTL', name: 'International Studies' },
    { id: 4, code: 'REL', name: 'Religious Education' },
    { id: 5, code: 'GEN', name: 'General Studies' },
    { id: 6, code: 'ENGR', name: 'Engineering' },
    { id: 7, code: 'PHYS', name: 'Physics' },
    { id: 8, code: 'CHEM', name: 'Chemistry' },
    { id: 9, code: 'BIO', name: 'Biology' },
    { id: 10, code: 'ECON', name: 'Economics' },
    { id: 11, code: 'HIST', name: 'History' }
];

// Faculty data as array
const faculty = [
    {
        firstName: 'Nathan',
        lastName: 'Jack',
        office: 'STC 310A',
        phone: '208-496-7622',
        email: 'jackn@byui.edu',
        departmentId: 0,
        title: 'Department Chair',
        gender: 'm'
    },
    {
        firstName: 'Jason',
        lastName: 'Allred',
        office: 'STC 310B',
        phone: '208-496-7607',
        email: 'allredjas@byui.edu',
        departmentId: 0,
        title: 'Associate Chair',
        gender: 'm'
    },
    {
        firstName: 'Adam',
        lastName: 'Hayes',
        office: 'STC 310C',
        phone: '208-496-3782',
        email: 'hayesa@byui.edu',
        departmentId: 0,
        title: 'Associate Chair',
        gender: 'm'
    },
    {
        firstName: 'Nate',
        lastName: 'Phillips',
        office: 'STC 310D',
        phone: '208-496-7625',
        email: 'phillipsn@byui.edu',
        departmentId: 0,
        title: 'Associate Chair',
        gender: 'm'
    },
    {
        firstName: 'William',
        lastName: 'Clements',
        office: 'STC 310E',
        phone: '208-496-7617',
        email: 'clementsw@byui.edu',
        departmentId: 0,
        title: 'Program Lead',
        gender: 'm'
    },
    {
        firstName: 'Zachariah',
        lastName: 'Alvey',
        office: 'STC 330A',
        phone: '208-496-3741',
        email: 'alveyz@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Bradley',
        lastName: 'Armstrong',
        office: 'STC 330B',
        phone: '208-496-3766',
        email: 'armstrongb@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Lee',
        lastName: 'Barney',
        office: 'STC 330C',
        phone: '208-496-3767',
        email: 'barneyl@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Rex',
        lastName: 'Barzee',
        office: 'STC 330D',
        phone: '208-496-3768',
        email: 'barzeer@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Scott',
        lastName: 'Burton',
        office: 'STC 330E',
        phone: '208-496-7614',
        email: 'burtons@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Christopher',
        lastName: 'Keers',
        office: 'STC 330F',
        phone: '208-496-7604',
        email: 'keersc@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Julie Ann',
        lastName: 'Anderson',
        office: 'STC 330G',
        phone: '208-496-4505',
        email: 'andersonju@byui.edu',
        departmentId: 0,
        title: 'Professor',
        gender: 'f'
    },
    {
        firstName: 'Joelle',
        lastName: 'Moen',
        office: 'GEB 205A',
        phone: '208-496-4391',
        email: 'moenj@byui.edu',
        departmentId: 2,
        title: 'Department Chair',
        gender: 'f'
    },
    {
        firstName: 'Josh',
        lastName: 'Allen',
        office: 'GEB 205B',
        phone: '208-496-4366',
        email: 'allenj@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Matt',
        lastName: 'Babcock',
        office: 'GEB 205C',
        phone: '208-496-4367',
        email: 'babcockm@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Jeremy',
        lastName: 'Bailey',
        office: 'GEB 205D',
        phone: '208-496-4405',
        email: 'baileyj@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Tom',
        lastName: 'Ballard',
        office: 'GEB 205E',
        phone: '208-496-4342',
        email: 'ballardt@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Mark',
        lastName: 'Bennion',
        office: 'GEB 205F',
        phone: '208-496-4368',
        email: 'bennionm@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'William',
        lastName: 'Brugger',
        office: 'GEB 205G',
        phone: '208-496-4370',
        email: 'bruggerw@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Curtis',
        lastName: 'Chandler',
        office: 'GEB 205H',
        phone: '208-496-4132',
        email: 'chandlerc@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Anna',
        lastName: 'Durfee',
        office: 'GEB 205I',
        phone: '208-496-4304',
        email: 'durfeean@byui.edu',
        departmentId: 2,
        title: 'Professor',
        gender: 'f'
    },
    {
        firstName: 'Elaine',
        lastName: 'Wagner',
        office: 'MC 301A',
        phone: '208-496-7556',
        email: 'wagnere@byui.edu',
        departmentId: 1,
        title: 'Department Chair',
        gender: 'f'
    },
    {
        firstName: 'Brett',
        lastName: 'Amidan',
        office: 'MC 301B',
        phone: '208-496-7563',
        email: 'amidanb@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Dave',
        lastName: 'Brown',
        office: 'MC 301C',
        phone: '208-496-7527',
        email: 'brownd@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Greg',
        lastName: 'Cameron',
        office: 'MC 301D',
        phone: '208-496-7528',
        email: 'camerong@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Paul',
        lastName: 'Cannon',
        office: 'MC 301E',
        phone: '208-496-7565',
        email: 'cannonp@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Paul',
        lastName: 'Cox',
        office: 'MC 301F',
        phone: '208-496-7529',
        email: 'coxp@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Craig',
        lastName: 'Johnson',
        office: 'MC 301G',
        phone: '208-496-7539',
        email: 'johnsonc@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Chaz',
        lastName: 'Clark',
        office: 'MC 301H',
        phone: '208-496-7535',
        email: 'clarkty@byui.edu',
        departmentId: 1,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Robert',
        lastName: 'Colvin',
        office: 'LA 201A',
        phone: '208-496-4308',
        email: 'colvinr@byui.edu',
        departmentId: 3,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Scott',
        lastName: 'Galer',
        office: 'LA 201B',
        phone: '208-496-4310',
        email: 'galers@byui.edu',
        departmentId: 3,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'John',
        lastName: 'Ivers',
        office: 'LA 201C',
        phone: '208-496-4313',
        email: 'iversj@byui.edu',
        departmentId: 3,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Jeremy',
        lastName: 'Lamoreaux',
        office: 'LA 201D',
        phone: '208-496-4234',
        email: 'lamoreauxj@byui.edu',
        departmentId: 3,
        title: 'Professor',
        gender: 'm'
    },
    {
        firstName: 'Trever',
        lastName: 'McKay',
        office: 'LA 201E',
        phone: '208-496-4312',
        email: 'mckaytr@byui.edu',
        departmentId: 3,
        title: 'Department Chair',
        gender: 'm'
    },
    {
        firstName: 'Michael',
        lastName: 'Paul',
        office: 'LA 201F',
        phone: '208-496-4315',
        email: 'paulm@byui.edu',
        departmentId: 3,
        title: 'Professor',
        gender: 'm'
    }
];

// SQL to create the departments table if it doesn't exist
const createDepartmentsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(200) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(code)
    )
`;

// SQL to create the catalog table if it doesn't exist
const createCatalogTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS catalog (
        id SERIAL PRIMARY KEY,
        course_slug VARCHAR(250) NOT NULL,
        faculty_slug VARCHAR(200) NOT NULL,
        time VARCHAR(100) NOT NULL,
        room VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_slug, faculty_slug, time, room)
    )
`;

// SQL to create the courses table if it doesn't exist
const createCoursesTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        credit_hours INTEGER NOT NULL CHECK (credit_hours > 0),
        department_id INTEGER NOT NULL,
        slug VARCHAR(250) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        UNIQUE(slug)
    )
`;

// SQL to create the faculty table if it doesn't exist
const createFacultyTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        office VARCHAR(50),
        phone VARCHAR(20),
        email VARCHAR(150) UNIQUE NOT NULL,
        department_id INTEGER NOT NULL,
        title VARCHAR(100),
        gender CHAR(1) CHECK (gender IN ('m', 'f')),
        slug VARCHAR(200) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        UNIQUE(slug)
    )
`;

/**
 * Creates a URL-friendly slug from one or more strings by converting to lowercase,
 * replacing spaces with hyphens, and removing special characters.
 *
 * @param {...string} strings - One or more strings to convert into a slug
 * @returns {string} A URL-friendly slug with only lowercase letters, numbers, and hyphens
 */
const createSlug = (...strings) => {
    return strings
        .filter((str) => {
            return str && typeof str === 'string';
        }) // Remove null/undefined/non-string values
        .join(' ') // Join all strings with spaces
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9\-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Insert catalog entry into the catalog table
const insertCatalogEntry = async(entry, verbose = true) => {
    const query = `
        INSERT INTO catalog (course_slug, faculty_slug, time, room)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (course_slug, faculty_slug, time, room) DO UPDATE SET
            room = EXCLUDED.room,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, course_slug, faculty_slug, time, room;
    `;

    const values = [entry.courseSlug, entry.facultySlug, entry.time, entry.room];

    const result = await db.query(query, values);

    if (result.rows.length > 0 && verbose) {
        console.log(
            `Created/Updated catalog option: ${result.rows[0].course_slug} | ${result.rows[0].faculty_slug} | ${result.rows[0].time} | ${result.rows[0].room}`
        );
    }
};

// Insert course data into the courses table
const insertCourse = async(course, verbose = true) => {
    const slug = createSlug(course.courseCode);

    // Use the departmentId directly (it's already an integer id)
    const { departmentId } = course;
    if (departmentId === undefined || departmentId === null) {
        throw new Error(`Course ${course.courseCode}: departmentId is required`);
    }

    const query = `
      INSERT INTO courses (course_code, name, description, credit_hours, department_id, slug)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (slug) DO UPDATE SET
        course_code   = EXCLUDED.course_code,
        name          = EXCLUDED.name,
        description   = EXCLUDED.description,
        credit_hours  = EXCLUDED.credit_hours,
        department_id = EXCLUDED.department_id,
        updated_at    = CURRENT_TIMESTAMP
      RETURNING id, course_code, name, slug;
    `;

    const values = [course.courseCode, course.name, course.description, course.creditHours, departmentId, slug];

    const result = await db.query(query, values);
    if (result.rows.length > 0 && verbose) {
        console.log(`Created/Updated course: ${result.rows[0].course_code} - ${result.rows[0].name}`);
    }
    return result.rows[0];
};

// Insert department data into the departments table
const insertDepartment = async(department, verbose = true) => {
    const query = `
        INSERT INTO departments (id, code, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
            code = EXCLUDED.code,
            name = EXCLUDED.name,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, code, name;
    `;

    const values = [department.id, department.code, department.name];
    const result = await db.query(query, values);

    if (result.rows.length > 0 && verbose) {
        console.log(`Created/Updated department: ${result.rows[0].code} - ${result.rows[0].name}`);
    }
    return result.rows[0];
};

// Insert faculty data into the faculty table
const insertFaculty = async(facultyMember, verbose = true) => {
    const slug = createSlug(facultyMember.firstName, facultyMember.lastName);

    // Use the id directly from the data
    const { departmentId } = facultyMember;
    if (departmentId === undefined || departmentId === null) {
        throw new Error(`Faculty ${facultyMember.firstName} ${facultyMember.lastName}: departmentId is required`);
    }

    const query = `
      INSERT INTO faculty (first_name, last_name, office, phone, email, department_id, title, gender, slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (slug) DO UPDATE SET
        first_name    = EXCLUDED.first_name,
        last_name     = EXCLUDED.last_name,
        office        = EXCLUDED.office,
        phone         = EXCLUDED.phone,
        email         = EXCLUDED.email,
        department_id = EXCLUDED.department_id,
        title         = EXCLUDED.title,
        gender        = EXCLUDED.gender,
        updated_at    = CURRENT_TIMESTAMP
      RETURNING id, first_name, last_name, slug;
    `;

    const values = [
        facultyMember.firstName,
        facultyMember.lastName,
        facultyMember.office,
        facultyMember.phone,
        facultyMember.email,
        departmentId,
        facultyMember.title,
        facultyMember.gender,
        slug
    ];

    const result = await db.query(query, values);

    if (result.rows.length > 0 && verbose) {
        console.log(`Created/Updated faculty member: ${result.rows[0].first_name} ${result.rows[0].last_name}`);
    }

    return result.rows[0];
};

// Check if all four tables are present in the current schema
const allTablesExist = async() => {
    const tables = ['departments', 'catalog', 'courses', 'faculty'];
    const res = await db.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1)
        `,
        [tables]
    );
    return res.rowCount === tables.length;
};

// Check if the last course, last faculty, and last catalog entry already exist
const lastSeedRowsExist = async() => {
    // Last course -> check by slug
    const lastCourse = courses[courses.length - 1];
    const lastCourseSlug = createSlug(lastCourse.courseCode);
    const courseExists = await db.query(`SELECT 1 FROM courses WHERE slug = $1 LIMIT 1`, [lastCourseSlug]);

    if (courseExists.rowCount === 0) return false;

    // Last faculty -> check by slug derived from first/last name
    const lastFaculty = faculty[faculty.length - 1];
    const lastFacultySlug = createSlug(lastFaculty.firstName, lastFaculty.lastName);
    const facultyExists = await db.query(`SELECT 1 FROM faculty WHERE slug = $1 LIMIT 1`, [lastFacultySlug]);

    if (facultyExists.rowCount === 0) return false;

    // Last catalog entry -> check by its conflict key
    const lastCatalog = catalog[catalog.length - 1];
    const catalogExists = await db.query(
        `SELECT 1
        FROM catalog
        WHERE course_slug = $1 AND faculty_slug = $2 AND time = $3 AND room = $4
        LIMIT 1`,
        [lastCatalog.courseSlug, lastCatalog.facultySlug, lastCatalog.time, lastCatalog.room]
    );

    return catalogExists.rowCount > 0;
};

// Check if the database has been initialized already
const isAlreadyInitialized = async(verbose = true) => {
    if (verbose) {
        console.log('Checking existing schema & seed…');
    }

    const tablesOk = await allTablesExist();
    if (!tablesOk) {
        return false;
    }

    const rowsOk = await lastSeedRowsExist();
    return rowsOk;
};

/**
 * Sets up the database by creating tables and inserting initial data.
 * This function should be called when the server starts.
 */
const setupDatabase = async() => {
    const verbose = process.env.ENABLE_SQL_LOGGING === 'true';

    try {
        // Skip everything if schema + last seed rows are present
        if (await isAlreadyInitialized(verbose)) {
            if (verbose) console.log('DB already initialized — skipping setup.');
            return true;
        }

        if (verbose) console.log('Setting up database…');

        // 1) Departments first (schema + data)
        await db.query(createDepartmentsTableIfNotExists);
        for (const department of departments) {
            await insertDepartment(department, verbose);
        }

        // 2) Catalog (schema + data)
        await db.query(createCatalogTableIfNotExists);
        for (const entry of catalog) {
            await insertCatalogEntry(entry, verbose);
        }

        // 3) Courses (schema + data)
        await db.query(createCoursesTableIfNotExists);
        for (const course of courses) {
            await insertCourse(course, verbose);
        }

        // 4) Faculty (schema + data)
        await db.query(createFacultyTableIfNotExists);
        for (const facultyMember of faculty) {
            await insertFaculty(facultyMember, verbose);
        }

        if (verbose) {
            console.log('Database setup complete');
        }
        return true;
    } catch (error) {
        console.error('Error setting up database:', error.message);
        throw error;
    }
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { setupDatabase, testConnection };
