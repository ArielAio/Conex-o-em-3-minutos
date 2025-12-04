import { UserProgress } from '../types';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'conexao_3min_user_v1';

const DEFAULT_USER: UserProgress = {
  name: 'Visitante',
  startDate: new Date().toISOString(),
  completedMissionIds: [],
  isPremium: false,
  streak: 0,
  lastLoginDate: new Date().toISOString(),
};

// Helper to get local data synchronously
const getLocalData = (): UserProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_USER;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading user data", error);
    return DEFAULT_USER;
  }
};

const saveLocalData = (data: UserProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Main Async Get User Function
export const getUserData = async (): Promise<UserProgress> => {
    const user = auth.currentUser;
    
    // If logged in, try Firestore
    if (user) {
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProgress;
                // Update local storage as cache/backup
                saveLocalData(data);
                return data;
            } else {
                // User logged in but no data in DB yet.
                // Check if we have local data to migrate
                const local = getLocalData();
                
                // Use local name if set, otherwise use Google name
                const initialData: UserProgress = {
                    ...local,
                    name: local.name !== 'Visitante' ? local.name : (user.displayName || 'Usuário'),
                };
                
                // Save to Firestore
                await setDoc(docRef, initialData);
                return initialData;
            }
        } catch (e) {
            console.error("Error fetching from Firestore, falling back to local", e);
            return getLocalData();
        }
    }

    // If not logged in, use LocalStorage
    return getLocalData();
};

export const saveUserData = async (data: UserProgress) => {
  // Always save locally for perceived speed and offline capability
  saveLocalData(data);

  const user = auth.currentUser;
  if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), data, { merge: true });
      } catch (e) {
        console.error("Error syncing to Firestore", e);
      }
  }
};

export const completeMission = async (missionId: number): Promise<UserProgress> => {
  // We first get the latest state (could be local)
  // Note: For a robust app we might re-fetch, but for MVP we assume UI state is close to truth.
  // We'll reload from local cache to be safe.
  const user = getLocalData(); // We modify the local version first for speed
  
  if (!user.completedMissionIds.includes(missionId)) {
    const now = new Date();
    user.streak += 1; 
    user.completedMissionIds.push(missionId);
    user.lastLoginDate = now.toISOString();
    
    await saveUserData(user);
  }
  return user;
};

export const updateUserProfile = async (name: string, partnerName: string): Promise<UserProgress> => {
  const user = getLocalData();
  user.name = name;
  user.partnerName = partnerName;
  await saveUserData(user);
  return user;
};

export const upgradeUser = async (): Promise<UserProgress> => {
    const user = getLocalData();
    user.isPremium = true;
    await saveUserData(user);
    return user;
}