/* eslint-disable max-len */
import db from './db.js';
import setupStoreTables from './setupProducts.js';

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
    }
];

// Department data as array
const departments = [
    { id: 0, code: 'CS', name: 'Computer Science' },
    { id: 1, code: 'MATH', name: 'Mathematics' }
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

        // setup Store tables
        await setupStoreTables(verbose);

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
