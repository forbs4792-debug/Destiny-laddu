import { firebaseConfig, allowedMemberUids } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js';
const configured = firebaseConfig.apiKey !== 'PASTE_API_KEY' && firebaseConfig.projectId !== 'PASTE_PROJECT_ID';
let app, auth, db, storage, user = null;
if (configured) { app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app); onAuthStateChanged(auth,u=>{user=u; const el=document.getElementById('cloudStatus'); if(el) el.textContent=u ? (allowedMemberUids.includes(u.uid) ? 'Signed in as '+u.email+' · private member' : 'Signed in, but this account is not on the private allowlist yet.') : 'Not signed in. Sign in on both devices to sync.';}); }
function requireMember(){if(!configured) throw new Error('Firebase config has not been added yet.'); if(!user) throw new Error('Please sign in first.'); if(!allowedMemberUids.includes(user.uid)) throw new Error('This account is not on the private two-person allowlist.'); return user;}
window.DestinyCloud={
 ready:()=>configured,
 signIn:async(email,password)=>{if(!configured)throw new Error('Firebase config has not been added yet.');await signInWithEmailAndPassword(auth,email,password)},
 register:async(email,password)=>{if(!configured)throw new Error('Firebase config has not been added yet.');if(!email||password.length<8)throw new Error('Enter an email and a password of at least 8 characters.');await createUserWithEmailAndPassword(auth,email,password)},
 signOut:async()=>{if(configured)await signOut(auth)},
 sendChat:async(text)=>{const u=requireMember(); if(!text||text.length>1000)throw new Error('Message must be 1–1000 characters.'); await addDoc(collection(db,'conversations','our-private-chat','messages'),{senderUid:u.uid,senderEmail:u.email,text,createdAt:serverTimestamp()})},
 saveMood:async(entry)=>{const u=requireMember();await addDoc(collection(db,'moods'),{ownerUid:u.uid,mood:String(entry.mood).slice(0,80),note:String(entry.note||'').slice(0,2000),createdAt:serverTimestamp()})},
 uploadMemory:async(file,kind='memory')=>{const u=requireMember();if(!file||file.size>25*1024*1024)throw new Error('Choose a file smaller than 25 MB.');const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const path=`shared/${u.uid}/${Date.now()}-${safe}`;const storageRef=ref(storage,path);await uploadBytes(storageRef,file,{contentType:file.type||'application/octet-stream',customMetadata:{ownerUid:u.uid,kind}});return {path,url:await getDownloadURL(storageRef),name:file.name,kind};}
};
