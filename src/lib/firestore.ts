
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import type { AnalysisLogEntry } from '@/components/dashboard/crowd-map';

// Analysis Log
export async function addAnalysisLogEntry(userId: string, entry: Omit<AnalysisLogEntry, 'id'>) {
    const logCollection = collection(db, 'users', userId, 'analysisLog');
    await addDoc(logCollection, entry);
}

export function onAnalysisLogUpdate(userId: string, callback: (log: AnalysisLogEntry[]) => void) {
    const logCollection = collection(db, 'users', userId, 'analysisLog');
    const q = query(logCollection, orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const log = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalysisLogEntry));
        callback(log);
    });
}

// Incidents
export interface Incident {
    id: string;
    type: string;
    location: string;
    time: string; // ISO string
    status: string;
    severity: string;
}

export function onIncidentsUpdate(userId: string, callback: (incidents: Incident[]) => void) {
    const incidentsCollection = collection(db, 'users', userId, 'incidents');
    const q = query(incidentsCollection, orderBy('time', 'desc'));
    
    // Seed initial data if collection is empty
    getDocs(q).then(snapshot => {
        if(snapshot.empty) {
            seedIncidents(userId);
        }
    })

    return onSnapshot(q, (snapshot) => {
        const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
        callback(incidents);
    });
}

export async function updateIncidentStatus(userId: string, incidentId: string, status: string) {
    const incidentDoc = doc(db, 'users', userId, 'incidents', incidentId);
    await updateDoc(incidentDoc, { status });
}


async function seedIncidents(userId: string) {
    const initialIncidents = [
        { type: "Medical", location: "Zone A, Booth 12", time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), status: "New", severity: "High" },
        { type: "Lost Item", location: "Main Stage", time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: "Dispatched", severity: "Low" },
        { type: "Disturbance", location: "Sector 4 Entrance", time: new Date(Date.now() - 8 * 60 * 1000).toISOString(), status: "Resolved", severity: "Medium" },
        { type: "Medical", location: "Food Court", time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), status: "Resolved", severity: "Medium" },
    ];
    for (const incident of initialIncidents) {
        const incidentsCollection = collection(db, 'users', userId, 'incidents');
        await addDoc(incidentsCollection, incident);
    }
}


// Lost & Found
export interface LostItem {
    id?: string;
    description: string;
    photoUrl: string;
    category: string;
    potentialOwnerInfo: string;
    recommendedAction: string;
    foundAt: string; // ISO string
}

export async function addLostItem(userId: string, item: LostItem) {
    const itemsCollection = collection(db, 'users', userId, 'lostAndFound');
    await addDoc(itemsCollection, item);
}

export async function getLostItems(userId: string): Promise<LostItem[]> {
    const itemsCollection = collection(db, 'users', userId, 'lostAndFound');
    const q = query(itemsCollection, orderBy('foundAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));
}

// AI Assistant Chat
interface ChatMessage {
    text: string;
    isUser: boolean;
    timestamp?: any;
}

export async function addChatMessage(userId: string, message: ChatMessage) {
    const chatCollection = collection(db, 'users', userId, 'chatHistory');
    await addDoc(chatCollection, { ...message, timestamp: serverTimestamp() });
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
    const chatCollection = collection(db, 'users', userId, 'chatHistory');
    const q = query(chatCollection, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ChatMessage);
}
