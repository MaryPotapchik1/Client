import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { 
  createUser, 
  findUserByEmail,
  createUserProfile,
  addFamilyMember as addFamilyMemberModel,
  updateFamilyMember as updateFamilyMemberModel, 
  deleteFamilyMember as deleteFamilyMemberModel,
  User,
  findUserProfileById,
  findFamilyMembersByUserId,
  findAllUsersWithProfiles,
  findFamilyMemberById,
  updateUserProfile,
  findAllUserProfiles
} from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      profile, 
      familyMembers, 
    } = req.body;

    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

  
    const newUser = await createUser(email, password);
    if (!newUser) {
      return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }

    
    if (profile) {
      await createUserProfile({
        ...profile,
        user_id: newUser.id,
        has_maternal_capital: profile.has_maternal_capital || false,
        maternal_capital_amount: profile.maternal_capital_amount || 10000
      });
    }

   
    if (familyMembers && Array.isArray(familyMembers)) {
      for (const member of familyMembers) {
        await addFamilyMemberModel({
          ...member,
          user_id: newUser.id
        });
      }
    }

  
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

   
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

  
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

     
    const user = await findUserByEmail(email);
    if (!user || user.id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

 
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный текущий пароль' });
    }

   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    res.status(200).json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

 
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ message: 'Недействительный или истекший токен' });
    }

    (req as any).user = user;
    next();
  });
};

 
export const authorizeRole = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!userRole || (role === 'admin' && userRole !== 'admin')) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    next();
  };
};

 
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
    
      return res.status(401).json({ message: 'Не удалось определить пользователя из токена' });
    }

 
    const userProfile = await findUserProfileById(userId);
    if (!userProfile) {
 
      return res.status(404).json({ message: 'Профиль пользователя не найден' });
    }

  
    const familyMembers = await findFamilyMembersByUserId(userId);

    res.status(200).json({
      profile: userProfile,
      familyMembers: familyMembers || [],
    });

  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профиля' });
  }
};
 
export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
     
    
    const users = await findAllUsersWithProfiles();
    
   
    res.status(200).json({ users });

  } catch (error) {
    console.error('Error in getAllUsersForAdmin:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при получении списка пользователей' });
  }
};

 
export const getAllUserProfilesForAdmin = async (req: Request, res: Response) => {
  try {
 

    const profiles = await findAllUserProfiles();

    res.status(200).json({ profiles }); 

  } catch (error) {
    console.error('Error in getAllUserProfilesForAdmin:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профилей' });
  }
};

 
export const addFamilyMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    
    const familyMemberData = {
      ...req.body,
      user_id: userId
    };
    
    const newFamilyMember = await addFamilyMemberModel(familyMemberData);
    
    if (!newFamilyMember) {
      return res.status(500).json({ message: 'Ошибка при добавлении члена семьи' });
    }
    
    res.status(201).json({
      message: 'Член семьи успешно добавлен',
      familyMember: newFamilyMember
    });
    
  } catch (error) {
    console.error('Error in addFamilyMember:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при добавлении члена семьи' });
  }
};

 
export const updateFamilyMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const familyMemberId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    
     
    const existingFamilyMember = await findFamilyMemberById(familyMemberId);
    
    if (!existingFamilyMember) {
      return res.status(404).json({ message: 'Член семьи не найден' });
    }
    
    if (existingFamilyMember.user_id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const familyMemberData = {
      ...req.body,
      id: familyMemberId,
      user_id: userId
    };
    
    const updatedFamilyMember = await updateFamilyMemberModel(familyMemberData);
    
    if (!updatedFamilyMember) {
      return res.status(500).json({ message: 'Ошибка при обновлении данных члена семьи' });
    }
    
    res.status(200).json({
      message: 'Данные члена семьи успешно обновлены',
      familyMember: updatedFamilyMember
    });
    
  } catch (error) {
    console.error('Error in updateFamilyMember:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при обновлении данных члена семьи' });
  }
};

 
export const deleteFamilyMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const familyMemberId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    
 
    const existingFamilyMember = await findFamilyMemberById(familyMemberId);
    
    if (!existingFamilyMember) {
      return res.status(404).json({ message: 'Член семьи не найден' });
    }
    
    if (existingFamilyMember.user_id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const result = await deleteFamilyMemberModel(familyMemberId);
    
    if (!result) {
      return res.status(500).json({ message: 'Ошибка при удалении члена семьи' });
    }
    
    res.status(200).json({
      message: 'Член семьи успешно удален'
    });
    
  } catch (error) {
    console.error('Error in deleteFamilyMember:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при удалении члена семьи' });
  }
};

 
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
 
    const profileData = {
      ...req.body,
      user_id: userId,
      has_maternal_capital: req.body.has_maternal_capital !== undefined 
        ? req.body.has_maternal_capital 
        : false,
      maternal_capital_amount: req.body.maternal_capital_amount || 0
    };
  
    const existingProfile = await findUserProfileById(userId);
    
    let result;
    if (existingProfile) {
   
      console.log('Обновляем существующий профиль для пользователя:', userId);
      result = await updateUserProfile(profileData);
      
      if (!result) {
        return res.status(500).json({ message: 'Ошибка при обновлении профиля' });
      }
      
      return res.status(200).json({
        message: 'Профиль успешно обновлен',
        profile: result
      });
    } else {
  
      console.log('Создаем новый профиль для пользователя:', userId);
      result = await createUserProfile(profileData);
      
      if (!result) {
        return res.status(500).json({ message: 'Ошибка при создании профиля' });
      }
      
      return res.status(201).json({
        message: 'Профиль успешно создан',
        profile: result
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при работе с профилем' });
  }
};

 
export const getProfileForAdmin = async (req: Request, res: Response) => {
  try {
 
    const userIdParam = req.params.userId;
    const userId = parseInt(userIdParam);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Неверный ID пользователя' });
    }

 
    const userProfile = await findUserProfileById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'Профиль пользователя не найден' });
    }

 
    const familyMembers = await findFamilyMembersByUserId(userId);

    res.status(200).json({
      profile: userProfile,
      familyMembers: familyMembers || [],
    });

  } catch (error) {
    console.error('Error in getProfileForAdmin:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профиля для админа' });
  }
}; 