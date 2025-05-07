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
exports.getProfileForAdmin = exports.createOrUpdateProfile = exports.deleteFamilyMember = exports.updateFamilyMember = exports.addFamilyMember = exports.getAllUserProfilesForAdmin = exports.getAllUsersForAdmin = exports.getProfile = exports.authorizeRole = exports.authenticateToken = exports.changePassword = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, profile, familyMembers, } = req.body;
        const existingUser = yield (0, User_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        const newUser = yield (0, User_1.createUser)(email, password);
        if (!newUser) {
            return res.status(500).json({ message: 'Ошибка при создании пользователя' });
        }
        if (profile) {
            yield (0, User_1.createUserProfile)(Object.assign(Object.assign({}, profile), { user_id: newUser.id, has_maternal_capital: profile.has_maternal_capital || false, maternal_capital_amount: profile.maternal_capital_amount || 10000 }));
        }
        if (familyMembers && Array.isArray(familyMembers)) {
            for (const member of familyMembers) {
                yield (0, User_1.addFamilyMember)(Object.assign(Object.assign({}, member), { user_id: newUser.id }));
            }
        }
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        });
    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, User_1.findUserByEmail)(email);
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: 'Авторизация успешна',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});
exports.login = login;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Необходима авторизация' });
        }
        const user = yield (0, User_1.findUserByEmail)(email);
        if (!user || user.id !== userId) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный текущий пароль' });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        yield db_1.default.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        res.status(200).json({ message: 'Пароль успешно изменен' });
    }
    catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});
exports.changePassword = changePassword;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(403).json({ message: 'Недействительный или истекший токен' });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authorizeRole = (role) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!userRole || (role === 'admin' && userRole !== 'admin')) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Не удалось определить пользователя из токена' });
        }
        const userProfile = yield (0, User_1.findUserProfileById)(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'Профиль пользователя не найден' });
        }
        const familyMembers = yield (0, User_1.findFamilyMembersByUserId)(userId);
        res.status(200).json({
            profile: userProfile,
            familyMembers: familyMembers || [],
        });
    }
    catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профиля' });
    }
});
exports.getProfile = getProfile;
const getAllUsersForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, User_1.findAllUsersWithProfiles)();
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('Error in getAllUsersForAdmin:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при получении списка пользователей' });
    }
});
exports.getAllUsersForAdmin = getAllUsersForAdmin;
const getAllUserProfilesForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield (0, User_1.findAllUserProfiles)();
        res.status(200).json({ profiles });
    }
    catch (error) {
        console.error('Error in getAllUserProfilesForAdmin:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профилей' });
    }
});
exports.getAllUserProfilesForAdmin = getAllUserProfilesForAdmin;
const addFamilyMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Необходима авторизация' });
        }
        const familyMemberData = Object.assign(Object.assign({}, req.body), { user_id: userId });
        const newFamilyMember = yield (0, User_1.addFamilyMember)(familyMemberData);
        if (!newFamilyMember) {
            return res.status(500).json({ message: 'Ошибка при добавлении члена семьи' });
        }
        res.status(201).json({
            message: 'Член семьи успешно добавлен',
            familyMember: newFamilyMember
        });
    }
    catch (error) {
        console.error('Error in addFamilyMember:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при добавлении члена семьи' });
    }
});
exports.addFamilyMember = addFamilyMember;
const updateFamilyMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const familyMemberId = parseInt(req.params.id);
        if (!userId) {
            return res.status(401).json({ message: 'Необходима авторизация' });
        }
        const existingFamilyMember = yield (0, User_1.findFamilyMemberById)(familyMemberId);
        if (!existingFamilyMember) {
            return res.status(404).json({ message: 'Член семьи не найден' });
        }
        if (existingFamilyMember.user_id !== userId) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        const familyMemberData = Object.assign(Object.assign({}, req.body), { id: familyMemberId, user_id: userId });
        const updatedFamilyMember = yield (0, User_1.updateFamilyMember)(familyMemberData);
        if (!updatedFamilyMember) {
            return res.status(500).json({ message: 'Ошибка при обновлении данных члена семьи' });
        }
        res.status(200).json({
            message: 'Данные члена семьи успешно обновлены',
            familyMember: updatedFamilyMember
        });
    }
    catch (error) {
        console.error('Error in updateFamilyMember:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при обновлении данных члена семьи' });
    }
});
exports.updateFamilyMember = updateFamilyMember;
const deleteFamilyMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const familyMemberId = parseInt(req.params.id);
        if (!userId) {
            return res.status(401).json({ message: 'Необходима авторизация' });
        }
        const existingFamilyMember = yield (0, User_1.findFamilyMemberById)(familyMemberId);
        if (!existingFamilyMember) {
            return res.status(404).json({ message: 'Член семьи не найден' });
        }
        if (existingFamilyMember.user_id !== userId) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        const result = yield (0, User_1.deleteFamilyMember)(familyMemberId);
        if (!result) {
            return res.status(500).json({ message: 'Ошибка при удалении члена семьи' });
        }
        res.status(200).json({
            message: 'Член семьи успешно удален'
        });
    }
    catch (error) {
        console.error('Error in deleteFamilyMember:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при удалении члена семьи' });
    }
});
exports.deleteFamilyMember = deleteFamilyMember;
const createOrUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Необходима авторизация' });
        }
        const profileData = Object.assign(Object.assign({}, req.body), { user_id: userId, has_maternal_capital: req.body.has_maternal_capital !== undefined
                ? req.body.has_maternal_capital
                : false, maternal_capital_amount: req.body.maternal_capital_amount || 0 });
        const existingProfile = yield (0, User_1.findUserProfileById)(userId);
        let result;
        if (existingProfile) {
            console.log('Обновляем существующий профиль для пользователя:', userId);
            result = yield (0, User_1.updateUserProfile)(profileData);
            if (!result) {
                return res.status(500).json({ message: 'Ошибка при обновлении профиля' });
            }
            return res.status(200).json({
                message: 'Профиль успешно обновлен',
                profile: result
            });
        }
        else {
            console.log('Создаем новый профиль для пользователя:', userId);
            result = yield (0, User_1.createUserProfile)(profileData);
            if (!result) {
                return res.status(500).json({ message: 'Ошибка при создании профиля' });
            }
            return res.status(201).json({
                message: 'Профиль успешно создан',
                profile: result
            });
        }
    }
    catch (error) {
        console.error('Error in createOrUpdateProfile:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при работе с профилем' });
    }
});
exports.createOrUpdateProfile = createOrUpdateProfile;
const getProfileForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdParam = req.params.userId;
        const userId = parseInt(userIdParam);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Неверный ID пользователя' });
        }
        const userProfile = yield (0, User_1.findUserProfileById)(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'Профиль пользователя не найден' });
        }
        const familyMembers = yield (0, User_1.findFamilyMembersByUserId)(userId);
        res.status(200).json({
            profile: userProfile,
            familyMembers: familyMembers || [],
        });
    }
    catch (error) {
        console.error('Error in getProfileForAdmin:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при получении профиля для админа' });
    }
});
exports.getProfileForAdmin = getProfileForAdmin;
