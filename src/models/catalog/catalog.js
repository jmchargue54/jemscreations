import db from '../db.js';

/**
 * Simple time sorting helper - extracts start time from time strings
 * @param {string} timeString - Time string like "Mon Wed Fri 8:00-8:50" or "Tue Thu 10:00-11:15"
 * @returns {number} - Hour in 24-hour format for sorting (8 for 8:00, 20 for 8:00 PM)
 */
const extractStartHour = (timeString) => {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) return 0;
    
    let hour = parseInt(timeMatch[1]);
    // Simple assumption: times before 7 AM are likely PM (like 1:00 = 1:00 PM = 13)
    if (hour < 7) hour += 12;
    
    return hour;
};

/**
 * Get all sections/offerings for a specific course by course ID
 */
const getSectionsByCourseId = async (courseId, sortBy = 'time') => {
    try {
        const query = `
            SELECT cat.id, cat.time, cat.room, 
                   c.course_code, c.name as course_name, c.description, c.credit_hours,
                   f.first_name, f.last_name, f.slug as faculty_slug, f.title as faculty_title,
                   d.name as department_name, d.code as department_code
            FROM catalog cat
            JOIN courses c ON cat.course_slug = c.slug
            JOIN faculty f ON cat.faculty_slug = f.slug
            JOIN departments d ON c.department_id = d.id
            WHERE c.id = $1
        `;
        
        const result = await db.query(query, [courseId]);
        
        let sections = result.rows.map(section => ({
            id: section.id,
            time: section.time,
            room: section.room,
            courseCode: section.course_code,
            courseName: section.course_name,
            description: section.description,
            creditHours: section.credit_hours,
            professor: `${section.first_name} ${section.last_name}`,
            professorSlug: section.faculty_slug,
            professorTitle: section.faculty_title,
            department: section.department_name,
            departmentCode: section.department_code
        }));
        
        if (sortBy === 'time') {
            sections.sort((a, b) => extractStartHour(a.time) - extractStartHour(b.time));
        } else if (sortBy === 'room') {
            sections.sort((a, b) => a.room.localeCompare(b.room));
        }
        
        return sections;
        
    } catch (error) {
        console.error('Error getting sections by course ID:', error.message);
        return [];
    }
};

/**
 * Get all sections/offerings for a specific course by course slug
 */
const getSectionsByCourseSlug = async (courseSlug, sortBy = 'time') => {
    try {
        const query = `
            SELECT cat.id, cat.time, cat.room, 
                   c.course_code, c.name as course_name, c.description, c.credit_hours,
                   f.first_name, f.last_name, f.slug as faculty_slug, f.title as faculty_title,
                   d.name as department_name, d.code as department_code
            FROM catalog cat
            JOIN courses c ON cat.course_slug = c.slug
            JOIN faculty f ON cat.faculty_slug = f.slug
            JOIN departments d ON c.department_id = d.id
            WHERE cat.course_slug = $1
        `;
        
        const result = await db.query(query, [courseSlug]);
        
        let sections = result.rows.map(section => ({
            id: section.id,
            time: section.time,
            room: section.room,
            courseCode: section.course_code,
            courseName: section.course_name,
            description: section.description,
            creditHours: section.credit_hours,
            professor: `${section.first_name} ${section.last_name}`,
            professorSlug: section.faculty_slug,
            professorTitle: section.faculty_title,
            department: section.department_name,
            departmentCode: section.department_code
        }));
        
        if (sortBy === 'time') {
            sections.sort((a, b) => extractStartHour(a.time) - extractStartHour(b.time));
        } else if (sortBy === 'room') {
            sections.sort((a, b) => a.room.localeCompare(b.room));
        }
        
        return sections;
        
    } catch (error) {
        console.error('Error getting sections by course slug:', error.message);
        return [];
    }
};

/**
 * Get all courses being taught by a specific faculty member by faculty ID
 */
const getCoursesByFacultyId = async (facultyId, sortBy = 'time') => {
    try {
        const query = `
            SELECT cat.id, cat.time, cat.room, 
                   c.course_code, c.name as course_name, c.description, c.credit_hours,
                   f.first_name, f.last_name, f.slug as faculty_slug, f.title as faculty_title,
                   d.name as department_name, d.code as department_code
            FROM catalog cat
            JOIN courses c ON cat.course_slug = c.slug
            JOIN faculty f ON cat.faculty_slug = f.slug
            JOIN departments d ON c.department_id = d.id
            WHERE f.id = $1
        `;
        
        const result = await db.query(query, [facultyId]);
        
        let sections = result.rows.map(section => ({
            id: section.id,
            time: section.time,
            room: section.room,
            courseCode: section.course_code,
            courseName: section.course_name,
            description: section.description,
            creditHours: section.credit_hours,
            professor: `${section.first_name} ${section.last_name}`,
            professorSlug: section.faculty_slug,
            professorTitle: section.faculty_title,
            department: section.department_name,
            departmentCode: section.department_code
        }));
        
        if (sortBy === 'time') {
            sections.sort((a, b) => extractStartHour(a.time) - extractStartHour(b.time));
        } else if (sortBy === 'room') {
            sections.sort((a, b) => a.room.localeCompare(b.room));
        }
        
        return sections;
        
    } catch (error) {
        console.error('Error getting courses by faculty ID:', error.message);
        return [];
    }
};

/**
 * Get all courses being taught by a specific faculty member by faculty slug
 */
const getCoursesByFacultySlug = async (facultySlug, sortBy = 'time') => {
    try {
        const query = `
            SELECT cat.id, cat.time, cat.room, 
                   c.course_code, c.name as course_name, c.description, c.credit_hours,
                   f.first_name, f.last_name, f.slug as faculty_slug, f.title as faculty_title,
                   d.name as department_name, d.code as department_code
            FROM catalog cat
            JOIN courses c ON cat.course_slug = c.slug
            JOIN faculty f ON cat.faculty_slug = f.slug
            JOIN departments d ON c.department_id = d.id
            WHERE cat.faculty_slug = $1
        `;
        
        const result = await db.query(query, [facultySlug]);
        
        let sections = result.rows.map(section => ({
            id: section.id,
            time: section.time,
            room: section.room,
            courseCode: section.course_code,
            courseName: section.course_name,
            description: section.description,
            creditHours: section.credit_hours,
            professor: `${section.first_name} ${section.last_name}`,
            professorSlug: section.faculty_slug,
            professorTitle: section.faculty_title,
            department: section.department_name,
            departmentCode: section.department_code
        }));
        
        if (sortBy === 'time') {
            sections.sort((a, b) => extractStartHour(a.time) - extractStartHour(b.time));
        } else if (sortBy === 'room') {
            sections.sort((a, b) => a.room.localeCompare(b.room));
        }
        
        return sections;
        
    } catch (error) {
        console.error('Error getting courses by faculty slug:', error.message);
        return [];
    }
};

/**
* Get sections from catalog table only - skips course join, just gets scheduling info
*/
const getSortedSections = async (courseSlug, sortBy = 'time') => {
    try {
        const query = `
            SELECT cat.id, cat.time, cat.room, cat.course_slug, cat.faculty_slug,
                   f.first_name, f.last_name
            FROM catalog cat
            JOIN faculty f ON cat.faculty_slug = f.slug
            WHERE cat.course_slug = $1
        `;
        
        const result = await db.query(query, [courseSlug]);
        
        let sections = result.rows.map(section => ({
            id: section.id,
            time: section.time,
            room: section.room,
            courseSlug: section.course_slug,
            facultySlug: section.faculty_slug,
            professor: `${section.first_name} ${section.last_name}`
        }));
        
        if (sortBy === 'time') {
            sections.sort((a, b) => extractStartHour(a.time) - extractStartHour(b.time));
        } else if (sortBy === 'room') {
            sections.sort((a, b) => a.room.localeCompare(b.room));
        } else if (sortBy === 'professor') {
            sections.sort((a, b) => a.professor.localeCompare(b.professor));
        }
        
        return sections;
        
    } catch (error) {
        console.error('Error getting sorted sections:', error.message);
        return [];
    }
};

export { getSectionsByCourseId, getSectionsByCourseSlug, getCoursesByFacultyId, getCoursesByFacultySlug, getSortedSections };
