import { UserProgress } from '../types';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'conexao_3min_user_v1';
let FIRESTORE_AVAILABLE = true;

const disableFirestore = (reason: any) => {
  if (FIRESTORE_AVAILABLE) {
    console.warn('Firestore indisponível, usando apenas armazenamento local.', reason);
  }
  FIRESTORE_AVAILABLE = false;
};

const DEFAULT_USER: UserProgress = {
  name: 'Visitante',
  email: '',
  startDate: new Date().toISOString(),
  completedMissionIds: [],
  isPremium: false,
  streak: 0,
  lastLoginDate: new Date().toISOString(),
  partnerName: '',
};

// Helper to get local data synchronously
const ensureDefaults = (data: Partial<UserProgress>): UserProgress => {
  return {
    name: data.name || 'Visitante',
    partnerName: data.partnerName || '',
    email: data.email || '',
    startDate: data.startDate || new Date().toISOString(),
    completedMissionIds: Array.isArray(data.completedMissionIds) ? data.completedMissionIds : [],
    isPremium: data.isPremium || false,
    streak: data.streak || 0,
    lastLoginDate: data.lastLoginDate || new Date().toISOString(),
  };
};

const getLocalData = (): UserProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_USER;
    return ensureDefaults(JSON.parse(data));
  } catch (error) {
    console.error("Error loading user data", error);
    return DEFAULT_USER;
  }
};

const saveLocalData = (data: UserProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureDefaults(data)));
}

const withTimeout = async <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutId);
  return result;
};

// Main Async Get User Function (favor local; remote best-effort with timeout)
export const getUserData = async (): Promise<UserProgress> => {
    const user = auth.currentUser;
    const local = getLocalData();
    
    if (!user || !FIRESTORE_AVAILABLE) {
      return local;
    }
    
    try {
        const docRef = doc(db, "users", user.uid);
        const fetchDoc = getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                return ensureDefaults(docSnap.data() as Partial<UserProgress>);
            } else {
                const initialData: UserProgress = {
                    ...local,
                    name: local.name !== 'Visitante' ? local.name : (user.displayName || 'Usuário'),
                    email: local.email || user.email || '',
                };
                
                return setDoc(docRef, initialData).then(() => initialData);
            }
        });
        
        // Timeout to avoid infinite waits (network/rules)
        const remote = await withTimeout(fetchDoc, 2000, local);
        const merged: UserProgress = {
          name: local.name !== 'Visitante' ? local.name : remote.name,
          partnerName: local.partnerName || remote.partnerName || '',
          email: local.email || remote.email || user?.email || '',
          startDate: local.startDate || remote.startDate,
          completedMissionIds: Array.from(new Set([...(remote.completedMissionIds || []), ...(local.completedMissionIds || [])])),
          isPremium: local.isPremium || remote.isPremium,
          streak: Math.max(local.streak || 0, remote.streak || 0),
          lastLoginDate: local.lastLoginDate || remote.lastLoginDate || new Date().toISOString(),
        };
        saveLocalData(merged);
        setDoc(docRef, merged, { merge: true }).catch(() => {});
        return merged;
    } catch (e) {
        disableFirestore(e);
        return local;
    }
};

export const saveUserData = async (data: UserProgress) => {
  // Always save locally for perceived speed and offline capability
  const withEmail: UserProgress = {
    ...data,
    email: data.email || auth.currentUser?.email || '',
  };
  saveLocalData(withEmail);

  const user = auth.currentUser;
  if (user && FIRESTORE_AVAILABLE) {
      try {
        await setDoc(doc(db, "users", user.uid), withEmail, { merge: true });
      } catch (e) {
        disableFirestore(e);
      }
  }
};

export const completeMission = async (missionId: number, current?: UserProgress): Promise<UserProgress> => {
  const user = ensureDefaults(current || getLocalData());
  
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
  user.email = user.email || auth.currentUser?.email || '';
  user.startDate = user.startDate || new Date().toISOString();
  await saveUserData(user);
  return user;
};

export const upgradeUser = async (): Promise<UserProgress> => {
    const user = getLocalData();
    user.isPremium = true;
    await saveUserData(user);
    return user;
}

export const resetProgress = async (): Promise<UserProgress> => {
    const local = getLocalData();
    const now = new Date().toISOString();
    const resetUser: UserProgress = {
        ...local,
        startDate: now,
        completedMissionIds: [],
        streak: 0,
        lastLoginDate: now,
    };
    await saveUserData(resetUser);
    return resetUser;
};
