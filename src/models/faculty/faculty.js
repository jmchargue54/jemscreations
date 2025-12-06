import db from '../db.js';

/**
 * Get faculty member by their ID (database primary key)
 */
const getFacultyById = async (facultyId) => {
    try {
        const query = `
            SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
                   f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
            FROM faculty f
            JOIN departments d ON f.department_id = d.id
            WHERE f.id = $1
        `;
        
        const result = await db.query(query, [facultyId]);
        
        if (result.rows.length === 0) {
            return {};
        }
        
        const faculty = result.rows[0];
        return {
            id: faculty.id,
            firstName: faculty.first_name,
            lastName: faculty.last_name,
            name: `${faculty.first_name} ${faculty.last_name}`,
            office: faculty.office,
            phone: faculty.phone,
            email: faculty.email,
            department: faculty.department_name,
            departmentCode: faculty.department_code,
            title: faculty.title,
            gender: faculty.gender,
            slug: faculty.slug
        };
        
    } catch (error) {
        console.error('Error getting faculty by ID:', error.message);
        return {};
    }
};

/**
 * Get faculty member by their slug (URL-friendly identifier)
 */
const getFacultyBySlug = async (facultySlug) => {
    try {
        const query = `
            SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
                   f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
            FROM faculty f
            JOIN departments d ON f.department_id = d.id
            WHERE f.slug = $1
        `;
        
        const result = await db.query(query, [facultySlug]);
        
        if (result.rows.length === 0) {
            return {};
        }
        
        const faculty = result.rows[0];
        return {
            id: faculty.id,
            firstName: faculty.first_name,
            lastName: faculty.last_name,
            name: `${faculty.first_name} ${faculty.last_name}`,
            office: faculty.office,
            phone: faculty.phone,
            email: faculty.email,
            department: faculty.department_name,
            departmentCode: faculty.department_code,
            title: faculty.title,
            gender: faculty.gender,
            slug: faculty.slug
        };
        
    } catch (error) {
        console.error('Error getting faculty by slug:', error.message);
        return {};
    }
};

/**
 * Get all faculty members sorted by the specified field
 */
const getSortedFaculty = async (sortBy = 'department') => {
    try {
        const validSortFields = ['name', 'department', 'title'];
        if (!validSortFields.includes(sortBy)) {
            sortBy = 'department';
        }
        
        let orderByClause;
        switch (sortBy) {
            case 'name':
                orderByClause = 'f.last_name, f.first_name';
                break;
            case 'department':
                orderByClause = 'd.name, f.last_name, f.first_name';
                break;
            case 'title':
                orderByClause = 'f.title, f.last_name';
                break;
            default:
                orderByClause = 'd.name, f.last_name, f.first_name';
        }
        
        const query = `
            SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
                   f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
            FROM faculty f
            JOIN departments d ON f.department_id = d.id
            ORDER BY ${orderByClause}
        `;
        
        const result = await db.query(query);
        
        return result.rows.map(faculty => ({
            id: faculty.id,
            firstName: faculty.first_name,
            lastName: faculty.last_name,
            name: `${faculty.first_name} ${faculty.last_name}`,
            office: faculty.office,
            phone: faculty.phone,
            email: faculty.email,
            department: faculty.department_name,
            departmentCode: faculty.department_code,
            title: faculty.title,
            gender: faculty.gender,
            slug: faculty.slug
        }));
        
    } catch (error) {
        console.error('Error getting sorted faculty:', error.message);
        return [];
    }
};

/**
 * Get all faculty members in a specific department
 */
const getFacultyByDepartment = async (departmentId, sortBy = 'name') => {
    try {
        const validSortFields = ['name', 'department', 'title'];
        if (!validSortFields.includes(sortBy)) {
            sortBy = 'name';
        }
        
        let orderByClause;
        switch (sortBy) {
            case 'name':
                orderByClause = 'f.last_name, f.first_name';
                break;
            case 'department':
                orderByClause = 'd.name, f.last_name, f.first_name';
                break;
            case 'title':
                orderByClause = 'f.title, f.last_name';
                break;
            default:
                orderByClause = 'f.last_name, f.first_name';
        }
        
        const query = `
            SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
                   f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
            FROM faculty f
            JOIN departments d ON f.department_id = d.id
            WHERE f.department_id = $1
            ORDER BY ${orderByClause}
        `;
        
        const result = await db.query(query, [departmentId]);
        
        return result.rows.map(faculty => ({
            id: faculty.id,
            firstName: faculty.first_name,
            lastName: faculty.last_name,
            name: `${faculty.first_name} ${faculty.last_name}`,
            office: faculty.office,
            phone: faculty.phone,
            email: faculty.email,
            department: faculty.department_name,
            departmentCode: faculty.department_code,
            title: faculty.title,
            gender: faculty.gender,
            slug: faculty.slug
        }));
        
    } catch (error) {
        console.error('Error getting faculty by department:', error.message);
        return [];
    }
};

export { getFacultyById, getFacultyBySlug, getSortedFaculty, getFacultyByDepartment };
