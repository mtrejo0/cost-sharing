import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Prompt } from "../types/types";
import { auth } from "../config/firebase";

export default class Prompts {
  static db_name = "prompts";
  static promptsCollection = collection(
    db,
    this.db_name
  ) as CollectionReference<Prompt>;

  static async add(prompt: string) {
    try {
      await addDoc(collection(db, this.db_name), {
        prompt,
        uid: auth.currentUser?.uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  static async delete(id: string) {
    await deleteDoc(doc(db, this.db_name, id));
  }

  static async update(prompt: Prompt, updated: any) {
    const ref = doc(db, this.db_name, prompt.id!);
    setDoc(ref, { ...prompt, ...updated });
  }
}
