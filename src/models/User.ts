import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: Date;
  passport_series: string;
  passport_number: string;
  address: string;
  phone: string;
  has_maternal_capital: boolean;
  maternal_capital_amount: number;
  housing_type?: 'own_house' | 'own_apartment' | 'rented' | 'social_housing' | 'other';
  living_area?: number;
  ownership_status?: 'sole' | 'joint' | 'none';
}

export interface FamilyMember {
  id: number;
  user_id: number;
  relation_type: 'spouse' | 'child';
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: Date;
  document_type: 'birth_certificate' | 'passport';
  document_number: string;
}

export async function createUser(
  email: string, 
  password: string, 
  role: 'user' | 'admin' = 'user'
): Promise<User | null> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function createUserProfile(
  userProfile: Omit<UserProfile, 'user_id'> & { user_id: number }
): Promise<UserProfile | null> {
  try {
    const {
      user_id,
      first_name,
      last_name,
      middle_name,
      birth_date,
      passport_series,
      passport_number,
      address,
      phone,
      has_maternal_capital,
      maternal_capital_amount,
      housing_type,
      living_area,
      ownership_status
    } = userProfile;
    
    const result = await pool.query(
      `INSERT INTO user_profiles 
       (user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number, 
        address, phone, has_maternal_capital, maternal_capital_amount,
        housing_type, living_area, ownership_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [user_id, first_name, last_name, middle_name, birth_date, passport_series, passport_number, 
       address, phone, has_maternal_capital, maternal_capital_amount,
       housing_type, living_area, ownership_status]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

export async function addFamilyMember(
  familyMember: Omit<FamilyMember, 'id'>
): Promise<FamilyMember | null> {
  try {
    const {
      user_id,
      relation_type,
      first_name,
      last_name,
      middle_name,
      birth_date,
      document_type,
      document_number
    } = familyMember;
    
    const result = await pool.query(
      `INSERT INTO family_members 
       (user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [user_id, relation_type, first_name, last_name, middle_name, birth_date, document_type, document_number]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error adding family member:', error);
    return null;
  }
}

export async function findUserProfileById(userId: number): Promise<UserProfile | null> {
  try {
    const result = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user profile by id:', error);
    return null;
  }
}

export async function findFamilyMembersByUserId(userId: number): Promise<FamilyMember[]> {
  try {
    const result = await pool.query('SELECT * FROM family_members WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error finding family members by user id:', error);
    return [];
  }
}

 
export async function findFamilyMemberById(id: number): Promise<FamilyMember | null> {
  try {
    const result = await pool.query('SELECT * FROM family_members WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error finding family member by id:', error);
    return null;
  }
}

 
export async function updateFamilyMember(
  familyMember: FamilyMember
): Promise<FamilyMember | null> {
  try {
    const {
      id,
      user_id,
      relation_type,
      first_name,
      last_name,
      middle_name,
      birth_date,
      document_type,
      document_number
    } = familyMember;
    
    const result = await pool.query(
      `UPDATE family_members 
       SET relation_type = $1, first_name = $2, last_name = $3, middle_name = $4, 
           birth_date = $5, document_type = $6, document_number = $7 
       WHERE id = $8 AND user_id = $9 
       RETURNING *`,
      [relation_type, first_name, last_name, middle_name, birth_date, 
       document_type, document_number, id, user_id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating family member:', error);
    return null;
  }
}

 
export async function deleteFamilyMember(id: number): Promise<boolean> {
  try {
    const result = await pool.query('DELETE FROM family_members WHERE id = $1 RETURNING id', [id]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting family member:', error);
    return false;
  }
}

 
export async function findAllUsersWithProfiles(): Promise<Array<User & { profile: UserProfile | null }>> {
  try {
     
    const result = await pool.query(`
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
  } catch (error) {
    console.error('Error finding all users with profiles:', error);
    return [];  
  }
}

 
export async function updateUserProfile(
  userProfile: UserProfile
): Promise<UserProfile | null> {
  try {
    const {
      user_id,
      first_name,
      last_name,
      middle_name,
      birth_date,
      passport_series,
      passport_number,
      address,
      phone,
      has_maternal_capital,
      maternal_capital_amount,
      housing_type,
      living_area,
      ownership_status
    } = userProfile;
    
    const result = await pool.query(
      `UPDATE user_profiles 
       SET first_name = $1, last_name = $2, middle_name = $3, birth_date = $4, 
           passport_series = $5, passport_number = $6, address = $7, phone = $8, 
           has_maternal_capital = $9, maternal_capital_amount = $10,
           housing_type = $11, living_area = $12, ownership_status = $13
       WHERE user_id = $14 
       RETURNING *`,
      [first_name, last_name, middle_name, birth_date, passport_series, 
       passport_number, address, phone, has_maternal_capital, maternal_capital_amount,
       housing_type, living_area, ownership_status, user_id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

 
export async function findAllUserProfiles(): Promise<UserProfile[]> {
  try {
    const result = await pool.query('SELECT * FROM user_profiles');
    return result.rows;
  } catch (error) {
    console.error('Error finding all user profiles:', error);
    return []; 
  }
} 