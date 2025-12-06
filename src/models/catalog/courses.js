import db from '../db.js';

/**
 * Get all courses sorted by the specified field
 * @param {string} sortBy - Field to sort by ('name', 'department', 'course_code') - defaults to 'department'
 * @returns {Array} Array of course objects sorted by the specified field or empty array on error
 */
const getAllCourses = async (sortBy = 'department') => {
    try {
        // Validate sortBy parameter - only allow these 3 field names
        const validSortFields = ['name', 'department', 'course_code'];
        if (!validSortFields.includes(sortBy)) {
            sortBy = 'department'; // Default to department if invalid
        }
        
        // Map sortBy to actual database columns
        let orderByClause;
        switch (sortBy) {
            case 'name':
                orderByClause = 'c.name';
                break;
            case 'department':
                orderByClause = 'd.name, c.course_code';
                break;
            case 'course_code':
                orderByClause = 'c.course_code';
                break;
            default:
                orderByClause = 'd.name, c.course_code';
        }
        
        const query = `
            SELECT c.id, c.course_code, c.name, c.description, c.credit_hours, c.slug,
                   d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            ORDER BY ${orderByClause}
        `;
        
        const result = await db.query(query);
        
        return result.rows.map(course => ({
            id: course.id,
            courseCode: course.course_code,
            name: course.name,
            description: course.description,
            creditHours: course.credit_hours,
            department: course.department_name,
            departmentCode: course.department_code,
            slug: course.slug
        }));
        
    } catch (error) {
        console.error('Error getting all courses:', error.message);
        return [];
    }
};

/**
 * Get course by its database ID
 * @param {number} courseId - The database ID of the course
 * @returns {Object} Course object or empty object if not found/error
 */
const getCourseById = async (courseId) => {
    try {
        const query = `
            SELECT c.id, c.course_code, c.name, c.description, c.credit_hours, c.slug,
                   d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE c.id = $1
        `;
        
        const result = await db.query(query, [courseId]);
        
        if (result.rows.length === 0) {
            return {};
        }
        
        const course = result.rows[0];
        return {
            id: course.id,
            courseCode: course.course_code,
            name: course.name,
            description: course.description,
            creditHours: course.credit_hours,
            department: course.department_name,
            departmentCode: course.department_code,
            slug: course.slug
        };
        
    } catch (error) {
        console.error('Error getting course by ID:', error.message);
        return {};
    }
};

/**
 * Get course by its slug
 * @param {string} courseSlug - The slug of the course (e.g., 'cse-110')
 * @returns {Object} Course object or empty object if not found/error
 */
const getCourseBySlug = async (courseSlug) => {
    try {
        const query = `
            SELECT c.id, c.course_code, c.name, c.description, c.credit_hours, c.slug,
                   d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE c.slug = $1
        `;
        
        const result = await db.query(query, [courseSlug]);
        
        if (result.rows.length === 0) {
            return {};
        }
        
        const course = result.rows[0];
        return {
            id: course.id,
            courseCode: course.course_code,
            name: course.name,
            description: course.description,
            creditHours: course.credit_hours,
            department: course.department_name,
            departmentCode: course.department_code,
            slug: course.slug
        };
        
    } catch (error) {
        console.error('Error getting course by slug:', error.message);
        return {};
    }
};

/**
 * Get courses by department
 * @param {number} departmentId - The ID of the department
 * @param {string} sortBy - Field to sort by ('name', 'department', 'course_code') - defaults to 'course_code'
 * @returns {Array} Array of course objects in the specified department or empty array on error
 */
const getCoursesByDepartment = async (departmentId, sortBy = 'course_code') => {
    try {
        // Validate sortBy parameter - only allow these 3 field names
        const validSortFields = ['name', 'department', 'course_code'];
        if (!validSortFields.includes(sortBy)) {
            sortBy = 'course_code'; // Default to course_code if invalid
        }
        
        // Map sortBy to actual database columns
        let orderByClause;
        switch (sortBy) {
            case 'name':
                orderByClause = 'c.name';
                break;
            case 'department':
                orderByClause = 'd.name, c.course_code';
                break;
            case 'course_code':
                orderByClause = 'c.course_code';
                break;
            default:
                orderByClause = 'c.course_code';
        }
        
        const query = `
            SELECT c.id, c.course_code, c.name, c.description, c.credit_hours, c.slug,
                   d.name as department_name, d.code as department_code
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE c.department_id = $1
            ORDER BY ${orderByClause}
        `;
        
        const result = await db.query(query, [departmentId]);
        
        return result.rows.map(course => ({
            id: course.id,
            courseCode: course.course_code,
            name: course.name,
            description: course.description,
            creditHours: course.credit_hours,
            department: course.department_name,
            departmentCode: course.department_code,
            slug: course.slug
        }));
        
    } catch (error) {
        console.error('Error getting courses by department:', error.message);
        return [];
    }
};

export { getAllCourses, getCourseById, getCourseBySlug, getCoursesByDepartment };
