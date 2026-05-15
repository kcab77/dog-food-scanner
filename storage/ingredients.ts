import AsyncStorage from '@react-native-async-storage/async-storage';

export type Severity = 'mild' | 'moderate' | 'severe' | 'toxic';
export type Category = 'preservative' | 'filler' | 'synthetic' | 'toxin' | 'additive' | 'sweetener' | 'other';

export interface CustomIngredient {
  id: string;
  term: string;
  reason: string;
  severity: Severity;
  category: Category;
  sources: string;
}

const KEY = 'custom_ingredients';

export async function loadCustomIngredients(): Promise<CustomIngredient[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveCustomIngredients(list: CustomIngredient[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export async function addCustomIngredient(ing: CustomIngredient): Promise<void> {
  const list = await loadCustomIngredients();
  list.push(ing);
  await saveCustomIngredients(list);
}

export async function deleteCustomIngredient(id: string): Promise<void> {
  const list = await loadCustomIngredients();
  await saveCustomIngredients(list.filter(i => i.id !== id));
}

export async function updateCustomIngredient(updated: CustomIngredient): Promise<void> {
  const list = await loadCustomIngredients();
  await saveCustomIngredients(list.map(i => i.id === updated.id ? updated : i));
}