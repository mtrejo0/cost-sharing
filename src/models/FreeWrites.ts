import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { FreeWrite } from "../types/types";
import { auth } from "../config/firebase";

export default class FreeWrites {
  static db_name = "freeWrites";
  static freeWritesCollection = collection(
    db,
    this.db_name
  ) as CollectionReference<FreeWrite>;

  static async add(text: string, tags: string[]) {
    try {
      await addDoc(collection(db, this.db_name), {
        text,
        tags,
        uid: auth.currentUser?.uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  static async delete(id: string) {
    await deleteDoc(doc(db, this.db_name, id));
  }

  static async update(freeWrite: FreeWrite, updated: any) {
    const ref = doc(db, this.db_name, freeWrite.id!);
    setDoc(ref, { ...freeWrite, ...updated });
  }
}
