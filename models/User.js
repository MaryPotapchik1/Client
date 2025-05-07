"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.createUserProfile = createUserProfile;
exports.addFamilyMember = addFamilyMember;
exports.findUserProfileById = findUserProfileById;
exports.findFamilyMembersByUserId = findFamilyMembersByUserId;
exports.findFamilyMemberById = findFamilyMemberById;
exports.updateFamilyMember = updateFamilyMember;
exports.deleteFamilyMember = deleteFamilyMember;
exports.findAllUsersWithProfiles = findAllUsersWithProfiles;
exports.updateUserProfile = updateUserProfile;
exports.findAllUserProfiles = findAllUserProfiles;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(email_1, password_1) {
    return __awaiter(this, arguments, void 0, function* (email, password, role = 'user') {
        try {
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const result = yield db_1.default.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *', [email, hashedPassword, role]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user:', error);
            return null;
        }
    });
}
function createUserProfile(userProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number, address, phone, has_maternal_capital, maternal_capital_amount, housing_type, living_area, ownership_status } = userProfile;
            const result = yield db_1.default.query(`INSERT INTO user_profiles 
       (user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number, 
        address, phone, has_maternal_capital, maternal_capital_amount,
        housing_type, living_area, ownership_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`, [user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number,
                address, phone, has_maternal_capital, maternal_capital_amount,
                housing_type, living_area, ownership_status]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error creating user profile:', error);
            return null;
        }
    });
}
function addFamilyMember(familyMember) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number } = familyMember;
            const result = yield db_1.default.query(`INSERT INTO family_members 
       (user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`, [user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error adding family member:', error);
            return null;
        }
    });
}
function findUserProfileById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user profile by id:', error);
            return null;
        }
    });
}
function findFamilyMembersByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM family_members WHERE user_id = $1', [userId]);
            return result.rows;
        }
        catch (error) {
            console.error('Error finding family members by user id:', error);
            return [];
        }
    });
}
function findFamilyMemberById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM family_members WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding family member by id:', error);
            return null;
        }
    });
}
function updateFamilyMember(familyMember) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number } = familyMember;
            const result = yield db_1.default.query(`UPDATE family_members 
       SET relation_type = $1, first_name = $2, last_name = $3, middle_name = $4, 
           birth_date = $5, document_type = $6, document_number = $7 
       WHERE id = $8 AND user_id = $9 
       RETURNING *`, [relation_type, first_name, last_name, middle_name, birth_date,
                document_type, document_number, id, user_id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error updating family member:', error);
            return null;
        }
    });
}
function deleteFamilyMember(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('DELETE FROM family_members WHERE id = $1 RETURNING id', [id]);
            return result.rows.length > 0;
        }
        catch (error) {
            console.error('Error deleting family member:', error);
            return false;
        }
    });
}
function findAllUsersWithProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`
      SELECT 
        u.id, u.email, u.role, u.created_at,
        up.first_name, up.last_name, up.middle_name, up.birth_date, 
        up.passport_series, up.passport_number, up.address, up.phone, 
        up.has_maternal_capital, up.maternal_capital_amount
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY u.created_at DESC 
    `);
            const usersWithProfiles = result.rows.map(row => ({
                id: row.id,
                email: row.email,
                password: '',
                role: row.role,
                created_at: row.created_at,
                profile: row.first_name ? {
                    user_id: row.id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    middle_name: row.middle_name,
                    birth_date: row.birth_date,
                    passport_series: row.passport_series,
                    passport_number: row.passport_number,
                    address: row.address,
                    phone: row.phone,
                    has_maternal_capital: row.has_maternal_capital,
                    maternal_capital_amount: row.maternal_capital_amount
                } : null
            }));
            return usersWithProfiles;
        }
        catch (error) {
            console.error('Error finding all users with profiles:', error);
            return [];
        }
    });
}
function updateUserProfile(userProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number, address, phone, has_maternal_capital, maternal_capital_amount, housing_type, living_area, ownership_status } = userProfile;
            const result = yield db_1.default.query(`UPDATE user_profiles 
       SET first_name = $1, last_name = $2, middle_name = $3, birth_date = $4, 
           passport_series = $5, passport_number = $6, address = $7, phone = $8, 
           has_maternal_capital = $9, maternal_capital_amount = $10,
           housing_type = $11, living_area = $12, ownership_status = $13
       WHERE user_id = $14 
       RETURNING *`, [first_name, last_name, middle_name, birth_date, passport_series,
                passport_number, address, phone, has_maternal_capital, maternal_capital_amount,
                housing_type, living_area, ownership_status, user_id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            return null;
        }
    });
}
function findAllUserProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query('SELECT * FROM user_profiles');
            return result.rows;
        }
        catch (error) {
            console.error('Error finding all user profiles:', error);
            return [];
        }
    });
}
