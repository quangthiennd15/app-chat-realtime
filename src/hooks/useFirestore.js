import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    where
} from "firebase/firestore";

const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, collectionName);
        let newQuery = query(collectionRef, orderBy("createdAt"));

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                // Reset dữ liệu documents
                setDocuments([]);
                return;
            }

            newQuery = query(
                collectionRef,
                orderBy("createdAt"),
                where(
                    condition.fieldName,
                    condition.operator,
                    condition.compareValue
                )
            );
        }

        const unsubscribe = onSnapshot(newQuery, (querySnapshot) => {
            const documents = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setDocuments(documents);
        });

        return () => unsubscribe;
    }, [collectionName, condition]);

    return documents;
};

export default useFirestore;