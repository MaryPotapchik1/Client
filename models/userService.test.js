const db = require('../config/db');
const bcrypt = require('bcrypt');
const {
  createUser,
  findUserByEmail,
  createUserProfile,
  addFamilyMember,
  findUserProfileById,
  findFamilyMembersByUserId,
  findFamilyMemberById,
  updateFamilyMember,
  deleteFamilyMember,
  findAllUsersWithProfiles,
  updateUserProfile,
  findAllUserProfiles,
} = require('../services/dbFunctions'); 

jest.mock('../config/db');
jest.mock('bcrypt');

describe('Database service functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return the user object', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashed = 'hashedPassword123';

      bcrypt.hash.mockResolvedValue(hashed);
      db.query.mockResolvedValue({ rows: [{ id: 1, email }] });

      const user = await createUser(email, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [email, hashed, 'user']
      );
      expect(user).toEqual({ id: 1, email });
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found by email', async () => {
      const email = 'user@test.com';
      db.query.mockResolvedValue({ rows: [{ id: 1, email }] });

      const user = await findUserByEmail(email);
      expect(user).toEqual({ id: 1, email });
    });

    it('should return null if no user found', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const user = await findUserByEmail('nonexistent@test.com');
      expect(user).toBeNull();
    });
  });

  describe('createUserProfile', () => {
    it('should create a user profile and return it', async () => {
      const profile = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        middle_name: 'M',
        birth_date: '1990-01-01',
        passport_series: '1234',
        passport_number: '567890',
        address: '123 Main St',
        phone: '1234567890',
        has_maternal_capital: false,
        maternal_capital_amount: null,
        housing_type: 'apartment',
        living_area: 50,
        ownership_status: 'owned'
      };

      db.query.mockResolvedValue({ rows: [profile] });
      const result = await createUserProfile(profile);

      expect(result).toEqual(profile);
    });
  });

  describe('deleteFamilyMember', () => {
    it('should return true when a family member is deleted', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });
      const result = await deleteFamilyMember(1);
      expect(result).toBe(true);
    });

    it('should return false when no family member is found to delete', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await deleteFamilyMember(999);
      expect(result).toBe(false);
    });
  });
});
