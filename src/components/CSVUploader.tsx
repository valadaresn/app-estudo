import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';

const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text, 34);
      const collectionRef = collection(db, 'leis');
      const batchSize = 10;
      const totalLines = rows.length;
      const numBatches = Math.ceil(totalLines / batchSize);

      for (let i = 0; i < numBatches; i++) {
        const batch = writeBatch(db);
        const chunk = rows.slice(i * batchSize, (i + 1) * batchSize);

        chunk.forEach((data) => {
          const lei: Lei = {
            lei: data[0] || "",
            dispositivo: data[1] || "",
            hierarquia: data[2] || "",
            tipo: data[3] || "",
            numero: data[4] || "",
            artigo: data[5] || "",
            paragrafo: data[6] || "",
            inciso: data[7] || "",
            aliena: data[8] || "",
            parte: data[9] || "",
            titulo: data[10] || "",
            capitulo: data[11] || "",
            secao: data[12] || "",
            subsecao: data[13] || "",
            ano: data[14] || "",
          };
          const docRef = doc(collectionRef);
          batch.set(docRef, lei);
        });

        await batch.commit();
        alert(`Commit realizado para o batch ${i + 1}`);
      }

      alert('Upload successful!');
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default CSVUploader;