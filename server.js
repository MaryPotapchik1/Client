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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const init_db_1 = __importDefault(require("./config/init-db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'auth-service' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Инициализация базы данных...');
            yield (0, init_db_1.default)();
            console.log('База данных успешно инициализирована');
            app.listen(PORT, () => {
                console.log(`Auth service running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error('Ошибка при запуске сервера:', error);
            console.error('Убедитесь, что PostgreSQL запущен и доступен с указанными в .env параметрами подключения');
            process.exit(1);
        }
    });
}
startServer();
