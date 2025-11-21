import { FoodItem } from './types';

export const COMMON_TAIWAN_FOODS: FoodItem[] = [
  { id: '1', name: '牛肉麵', category: '麵食', emoji: '🍜' },
  { id: '2', name: '滷肉飯', category: '米食', emoji: '🍚' },
  { id: '3', name: '小火鍋', category: '鍋物', emoji: '🍲' },
  { id: '4', name: '雞排 & 鹹酥雞', category: '小吃', emoji: '🍗' },
  { id: '5', name: '水餃 / 鍋貼', category: '麵點', emoji: '🥟' },
  { id: '6', name: '便當 / 自助餐', category: '正餐', emoji: '🍱' },
  { id: '7', name: '鐵板燒', category: '正餐', emoji: '🔥' },
  { id: '8', name: '義大利麵', category: '異國', emoji: '🍝' },
  { id: '9', name: '拉麵', category: '日式', emoji: '🍜' },
  { id: '10', name: '壽司 / 生魚片', category: '日式', emoji: '🍣' },
  { id: '11', name: '泰式料理', category: '異國', emoji: '🌶️' },
  { id: '12', name: '速食 (麥當勞/肯德基)', category: '速食', emoji: '🍔' },
  { id: '13', name: '咖哩飯', category: '米食', emoji: '🍛' },
  { id: '14', name: '夜市牛排', category: '排餐', emoji: '🥩' },
  { id: '15', name: '蚵仔煎 / 藥燉排骨', category: '夜市', emoji: '🦪' },
];

export const LOADING_MESSAGES = [
  "正在尋找附近的美味...",
  "AI 正在思考要吃什麼...",
  "正在查看 Google 地圖評價...",
  "正在分析你的口味...",
  "準備好你的胃了嗎？",
];
